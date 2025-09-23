const axios = require('axios')
const { TELEGRAM } = require('../../constants')

/**
 * Build telegram message from log metadata
 * @param {Object} logMeta - Log metadata object
 * @returns {string} Formatted telegram message
 */
function buildTelegramMessage(logMeta) {
    const lines = []

    lines.push(`ENV: ${logMeta.environment || 'UNKNOWN'}`)

    if (logMeta.type) {
        lines.push(`TYPE: ${logMeta.type}`)
    }

    if (logMeta.error_code) {
        lines.push(`ERROR: ${logMeta.error_code}`)
    }

    if (logMeta.error_message) {
        lines.push(`MESSAGE: ${logMeta.error_message}`)
    }

    if (logMeta.metric) {
        lines.push(`METRIC: ${logMeta.metric}`)
    }

    if (logMeta.user) {
        lines.push(`USER: ${logMeta.user}`)
    }

    if (logMeta.supplier_code) {
        lines.push(`SUPPLIER CODE: ${logMeta.supplier_code}`)
    }

    if (logMeta.supplier_meta) {
        lines.push(`SUPPLIER META: ${logMeta.supplier_meta}`)
    }

    if (logMeta.request_metadata) {
        lines.push(`REQUEST METADATA: ${logMeta.request_metadata}`)
    }

    if (logMeta.error_stack) {
        lines.push(`STACK: ${logMeta.error_stack}`)
    }

    return lines.join('\n')
}

/**
 * Build log metadata from options (error-handler.js style)
 *
 * INPUT OPTIONS STRUCTURE:
 * - type (string): 'system' or 'third_party' (default: 'system')
 * - environment (string): 'DEV', 'STAGING', 'PROD' (default: 'STAGING')
 * - user_email (string): User email
 * - user (Object): User object with email property
 * - supplier (Object): Supplier info { code, id, source_id, contract_id, user_name }
 * - metric (string): Metric for routing (search, book, cancel, etc.)
 * - request_metadata (Object|string): Request metadata
 * - error_code (string): Error code
 * - error_message (string): Error message
 * - error_stack (string): Error stack trace
 * - metadata (Object|string): Additional metadata
 *
 * OUTPUT LOG META STRUCTURE:
 * {
 *   type: string,
 *   environment: string,
 *   user: string,
 *   supplier_code: string,
 *   supplier_meta: string (JSON),
 *   metric: string,
 *   request_metadata: string (JSON or direct),
 *   error_code: string,
 *   error_message: string,
 *   error_stack: string (truncated to 2 lines),
 *   error_metadata: string (JSON or direct)
 * }
 *
 * @param {Object} options - Input options
 * @returns {Object} Log metadata object
 */
function buildLogMeta(options) {
    // Truncate error stack to first 2 lines if error_stack is present
    let errorStack = options.error_stack
    if (errorStack && typeof errorStack === 'string') {
        const stackLines = errorStack.split('\n')
        if (stackLines.length > 2) {
            errorStack = stackLines.slice(0, 2).join('\n')
        }
    }

    return {
        type: options.type || 'system',
        environment: options.environment || 'STAGING',
        user: options.user_email || (options.user && options.user.email),
        supplier_code: options.supplier && options.supplier.code,
        supplier_meta: options.supplier
            ? JSON.stringify({
                  id: options.supplier.id,
                  code: options.supplier.code,
                  source_id: options.supplier.source_id,
                  contract_id: options.supplier.contract_id,
                  user_name: options.supplier.user_name
              })
            : null,
        metric: options.metric,
        request_metadata: (() => {
            if (!options.request_metadata) return null

            return typeof options.request_metadata === 'string'
                ? options.request_metadata
                : JSON.stringify(options.request_metadata)
        })(),
        error_code: options.error_code,
        error_message: options.error_message,
        error_stack: errorStack,
        error_metadata: (() => {
            if (!options.metadata) return null

            return typeof options.metadata === 'string'
                ? options.metadata
                : JSON.stringify(options.metadata)
        })()
    }
}

/**
 * Dynamically detect message thread ID from config
 * @param {Object} params - Detection parameters
 * @param {string} params.product - Product type (flight, hotel, etc.)
 * @param {string} params.type - Alert type (system, third_party)
 * @param {string} params.metric - Metric type (search, book, support, etc.)
 * @param {Object} params.messageThreadIds - Available thread IDs from config
 * @returns {number|undefined} Message thread ID
 */
function detectMessageThreadId({ product, type, metric, messageThreadIds }) {
    if (!messageThreadIds || Object.keys(messageThreadIds).length === 0) {
        return undefined
    }

    const productLower = (product || 'hotel').toLowerCase()
    const typeLower = (type || 'system').toLowerCase()
    const metricLower = (metric || 'general').toLowerCase()

    // Normalize metric using METRIC_MAPPINGS if available, otherwise use as-is
    const normalizedMetric = metricLower

    // Build possible thread keys in priority order
    const possibleKeys = [
        // 1. Exact match: product_type_metric
        `${productLower}_${typeLower}_${normalizedMetric}`,
        // 2. Fallback to general for this product+type
        `${productLower}_${typeLower}_general`,
        // 3. Fallback to all for this product+type
        `${productLower}_${typeLower}_all`
    ]

    // 4. Fallback to system if type was third_party
    if (typeLower === 'third_party') {
        possibleKeys.push(
            `${productLower}_system_${normalizedMetric}`,
            `${productLower}_system_general`,
            `${productLower}_system_all`
        )
    }

    // 5. Global fallback
    possibleKeys.push('general')

    // Find first matching thread ID using find method
    const foundKey = possibleKeys.find(
        key => messageThreadIds[key] !== undefined
    )

    return foundKey ? messageThreadIds[foundKey] : undefined
}

/**
 * Build telegram payload with dynamic thread routing
 * @param {Object} logMeta - Log metadata
 * @param {Object} options - Telegram config
 * @returns {Object} Telegram payload
 */
function buildTelegramPayload(logMeta, options) {
    const { chatId, messageThreadIds = {}, product = 'hotel' } = options

    // Get thread ID using dynamic detection from messageThreadIds config
    const messageThreadId = detectMessageThreadId({
        product,
        type: logMeta.type,
        metric: logMeta.metric,
        messageThreadIds
    })

    return {
        chat_id: chatId,
        text: buildTelegramMessage(logMeta),
        message_thread_id: messageThreadId
    }
}

/**
 * Send message to Telegram using error-handler.js style - only options parameter
 *
 * FUNCTION SIGNATURE: sendMessage(options)
 * - Single options parameter containing all config and message data
 * - Matches error-handler.js pattern for consistency
 *
 * REQUIRED OPTIONS:
 * - botToken (string): Telegram bot token
 * - chatId (string): Chat ID to send message to
 * - error_message (string): Message text to send
 *
 * OPTIONAL OPTIONS:
 * - messageThreadIds (Object): Thread routing config
 * - product (string): Product type for routing (default: 'hotel')
 * - type (string): Alert type (default: 'system')
 * - metric (string): Metric for routing (default: 'general')
 * - timeout (number): Request timeout in ms (default: 10000)
 * - user_email, supplier, request_metadata, error_code, error_stack, metadata
 *
 * THREAD ROUTING:
 * Uses detectMessageThreadId() to find appropriate thread based on:
 * product + type + metric → messageThreadIds[key] → fallback to general
 *
 * @param {Object} options - All options including config (like error-handler.js)
 * @param {string} options.botToken - Telegram bot token
 * @param {string} options.chatId - Chat ID to send message to
 * @param {Object} options.messageThreadIds - Message thread ID configuration
 * @param {string} options.product - Product type (hotel, flight, tour, transfer)
 * @param {string} options.error_message - Message text
 * @param {number} options.timeout - Request timeout in ms (optional, default: 10000)
 * @returns {Promise<Object>} Telegram API response
 */
async function sendMessage(options) {
    if (!options) {
        throw new Error('options is required')
    }

    const { botToken, timeout = 10000 } = options

    if (!botToken) {
        throw new Error('botToken is required in config')
    }

    try {
        const logMeta = buildLogMeta(options)
        const payload = buildTelegramPayload(logMeta, options)
        const url = `${TELEGRAM.API_BASE_URL}${botToken}/sendMessage`

        const response = await axios.post(url, payload, {
            timeout,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return response.data
    } catch (error) {
        throw new Error(
            `Failed to send Telegram message: ${(error.response &&
                error.response.data &&
                error.response.data.description) ||
                error.message}`
        )
    }
}

/**
 * Send error alert using error-handler.js style
 * @param {Object} options - All options including config (like error-handler.js)
 * @returns {Promise<Object>} Telegram API response
 */
async function sendErrorAlert(options) {
    return sendMessage(options)
}

/**
 * Send startup notification using error-handler.js style
 * @param {Object} options - All options including config (like error-handler.js)
 * @returns {Promise<Object>} Telegram API response
 */
async function sendStartupNotification(options) {
    const startupOptions = {
        ...options,
        error_message: `${options.serviceName ||
            'Service'} has started successfully`,
        type: 'system',
        metric: 'startup'
    }

    return sendMessage(startupOptions)
}

/**
 * Send custom notification using error-handler.js style
 * @param {Object} options - All options including config (like error-handler.js)
 * @returns {Promise<Object>} Telegram API response
 */
async function sendCustomNotification(options) {
    return sendMessage(options)
}

module.exports = {
    sendMessage,
    sendErrorAlert,
    sendStartupNotification,
    sendCustomNotification,
    buildLogMeta,
    buildTelegramMessage,
    buildTelegramPayload
}
