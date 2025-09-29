const axios = require('axios')
const { TELEGRAM } = require('../../constants')
const { printJson, tryParseJson, printStack } = require('../../utils')

/**
 * Build telegram message from log metadata with Markdown formatting
 * @param {Object} logMeta - Log metadata object
 * @returns {string} Formatted telegram message with Markdown
 */
function buildTelegramMessage(logMeta) {
    const lines = []

    // Header with environment
    lines.push(`🔧 **Environment:** \`${logMeta.environment || 'UNKNOWN'}\``)
    lines.push('') // Empty line

    // Alert type with emoji
    if (logMeta.type) {
        const typeEmoji = logMeta.type === 'third_party' ? '🔌' : '⚙️'
        lines.push(`${typeEmoji} **Type:** \`${logMeta.type}\``)
    }

    // Error code with emoji
    if (logMeta.error_code) {
        lines.push(`❌ **Error Code:** \`${logMeta.error_code}\``)
    }

    // Main error message
    if (logMeta.error_message) {
        lines.push(`📝 **Message:**`)
        lines.push(`\`\`\``)
        lines.push(`${logMeta.error_message}`)
        lines.push(`\`\`\``)
    }

    // Metric info
    if (logMeta.metric) {
        lines.push(`📊 **Metric:** \`${logMeta.metric}\``)
    }

    // Event name info
    if (logMeta.event_name) {
        lines.push(`🎯 **Event:** \`${logMeta.event_name}\``)
    }

    // User info
    if (logMeta.user) {
        lines.push(`👤 **User:** \`${logMeta.user}\``)
    }

    // Supplier info
    if (logMeta.supplier_code) {
        lines.push(`🏢 **Supplier:** \`${logMeta.supplier_code}\``)
    }

    if (logMeta.supplier_meta) {
        lines.push(`🔗 **Supplier Details:**`)
        lines.push(`\`\`\`json`)
        lines.push(`${logMeta.supplier_meta}`)
        lines.push(`\`\`\``)
    }

    // Request metadata
    if (logMeta.request_metadata) {
        // Try to parse JSON to extract specific IDs
        const requestData = tryParseJson(logMeta.request_metadata)
        // Extract and display specific IDs if they exist
        if (requestData && typeof requestData === 'object') {
            if (requestData.trace_id || requestData['trace-id']) {
                lines.push(`🔍 **Trace ID:**`)
                lines.push(`\`\`\``)
                lines.push(`${requestData.trace_id || requestData['trace-id']}`)
                lines.push(`\`\`\``)
            }
            if (requestData.request_id) {
                lines.push(`🔍 **Request ID:**`)
                lines.push(`\`\`\``)
                lines.push(`${requestData.request_id}`)
                lines.push(`\`\`\``)
            }
            if (requestData.search_id) {
                lines.push(`🔍 **Search ID:**`)
                lines.push(`\`\`\``)
                lines.push(`${requestData.search_id}`)
                lines.push(`\`\`\``)
            }
            if (requestData.log_id) {
                lines.push(`🔍 **Log ID:**`)
                lines.push(`\`\`\``)
                lines.push(`${requestData.log_id}`)
                lines.push(`\`\`\``)
            }
        }

        lines.push(`📋 **Request Data:**`)
        lines.push(`\`\`\`json`)
        lines.push(`${printJson(logMeta.request_metadata)}`)
        lines.push(`\`\`\``)
    }

    // Request body
    if (logMeta.request_body) {
        lines.push(`📦 **Request Body:**`)
        lines.push(`\`\`\`json`)
        lines.push(printJson(logMeta.request_body))
        lines.push(`\`\`\``)
    }

    // Error stack (most important, so put at bottom)
    if (logMeta.error_stack) {
        lines.push(`🐛 **Stack Trace:**`)
        lines.push(`\`\`\``)
        lines.push(printStack(logMeta.error_stack))
        lines.push(`\`\`\``)
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
 * - event_name (string): Event name for tracking
 * - request_body (Object|string): Request body data
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
 *   event_name: string,
 *   request_body: string (JSON or direct),
 *   request_metadata: string (JSON or direct),
 *   error_code: string,
 *   error_message: string,
 *   error_stack: string,
 *   error_metadata: string (JSON or direct)
 * }
 *
 * @param {Object} options - Input options
 * @returns {Object} Log metadata object
 */
function buildLogMeta(options) {
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
        event_name: options.event_name,
        request_body: options.request_body,
        request_metadata: (() => {
            if (!options.request_metadata) return null

            return typeof options.request_metadata === 'string'
                ? options.request_metadata
                : JSON.stringify(options.request_metadata)
        })(),
        error_code: options.error_code,
        error_message: options.error_message,
        error_stack: options.error_stack,
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
        message_thread_id: messageThreadId,
        parse_mode: 'Markdown'
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
