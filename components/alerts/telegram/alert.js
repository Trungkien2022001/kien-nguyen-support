const { httpClient, filterDataBySpecific } = require('../../../utils')
const { printJson, printStack } = require('../../../utils')
const { TELEGRAM } = require('../../../constants')

/**
 * Escape Telegram markdown special characters for legacy Markdown
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeMarkdown(text) {
    if (typeof text !== 'string') return text

    // For Telegram legacy Markdown, only escape these characters
    return text
        .replace(/\*/g, '\\*')
        .replace(/_/g, '\\_')
        .replace(/`/g, '\\`')
        .replace(/\[/g, '\\[')
}
/**
 * Build telegram message with beauty formatting options
 * @param {Object} data - Data object to display
 * @param {boolean} beauty - Enable markdown formatting
 * @param {Array} specific - Specific field configurations
 * @returns {string} Formatted telegram message
 */
function buildTelegramMessage(data, beauty = true, specific = []) {
    const lines = []

    if (specific && specific.length > 0) {
        // Use specific field configurations
        specific.forEach(field => {
            const { key, title, markdown = beauty } = field
            const value = data[key]

            if (value !== undefined && value !== null) {
                // Format value using printJson utility
                let displayValue = value
                if (typeof value === 'object') {
                    displayValue = printJson(value)
                } else if (
                    typeof value === 'string' &&
                    ['stack', 'stack_trace'].includes(key)
                ) {
                    // Use printStack for error stack traces
                    displayValue = printStack(value)
                }

                if (markdown) {
                    // Use Telegram Markdown format like telegram-bot: **bold**
                    lines.push(`**${title}:**`)
                    lines.push(`\`\`\``)
                    lines.push(`${displayValue}`)
                    lines.push(`\`\`\``)
                } else {
                    // Plain text, no formatting
                    lines.push(`${title}: ${displayValue}`)
                }
            }
        })
    } else {
        // Auto-generate from all object keys
        Object.keys(data).forEach(key => {
            const value = data[key]

            if (value !== undefined && value !== null) {
                // Skip functions and complex objects
                if (typeof value === 'function') return

                // Format value using printJson utility
                let displayValue = value
                if (typeof value === 'object') {
                    displayValue = printJson(value)
                } else if (
                    typeof value === 'string' &&
                    ['stack', 'stack_trace'].includes(key)
                ) {
                    // Use printStack for error stack traces
                    displayValue = printStack(value)
                }

                // Auto-generate title from key
                const title = key
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase())

                if (beauty) {
                    if (typeof value === 'object') {
                        lines.push(`📋 *${escapeMarkdown(title)}*:`)
                        lines.push(`\`\`\`json`)
                        lines.push(escapeMarkdown(displayValue))
                        lines.push(`\`\`\``)
                    } else {
                        lines.push(
                            `📝 *${escapeMarkdown(title)}*: \`${escapeMarkdown(
                                displayValue
                            )}\``
                        )
                    }
                } else {
                    lines.push(`${title}: ${displayValue}`)
                }
            }
        })
    }

    return lines.join('\n')
}

/**
 * Build simple telegram message (non-beauty format)
 * @param {Object} data - Data object to display
 * @param {Array} specific - Specific field configurations
 * @returns {string} Simple formatted message
 */
function buildSimpleMessage(data, specific = []) {
    const lines = []

    if (specific && specific.length > 0) {
        // Use specific field configurations
        specific.forEach(field => {
            const { key, title } = field
            const value = data[key]

            if (value !== undefined && value !== null) {
                lines.push(`${title}: ${value}`)
            }
        })
    } else {
        // Auto-generate from all object keys
        Object.keys(data).forEach(key => {
            const value = data[key]

            if (
                value !== undefined &&
                value !== null &&
                typeof value !== 'function'
            ) {
                const title = key
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase())
                const displayValue =
                    typeof value === 'object' ? JSON.stringify(value) : value
                lines.push(`${title}: ${displayValue}`)
            }
        })
    }

    return lines.join('\n')
}

/**
 * Detect message thread ID from nested config
 * @param {Object} params - Detection parameters
 * @param {string} params.service - Service type (hotel, flight, etc.)
 * @param {string} params.type - Alert type (Error, Info, etc.)
 * @param {string} params.action - Action type (search, book, etc.)
 * @param {Object} params.messageThreadIds - Nested thread IDs config
 * @returns {number|undefined} Message thread ID
 */
function detectNestedThreadId({ service, type, action, messageThreadIds }) {
    if (!messageThreadIds || Object.keys(messageThreadIds).length === 0) {
        return undefined
    }

    const serviceLower = (service || 'hotel').toLowerCase()
    const typeLower = (type || 'error').toLowerCase()
    const actionLower = (action || 'all').toLowerCase()

    // Try nested structure: service -> type -> action
    if (messageThreadIds[serviceLower]) {
        const serviceConfig = messageThreadIds[serviceLower]

        if (serviceConfig[typeLower]) {
            const typeConfig = serviceConfig[typeLower]

            // Try specific action first
            if (typeConfig[actionLower] !== undefined) {
                return typeConfig[actionLower]
            }

            // Fallback to 'all' in same type
            if (typeConfig.all !== undefined) {
                return typeConfig.all
            }
        }

        // Fallback to error type if exists
        if (serviceLower !== 'error' && serviceConfig.error) {
            if (serviceConfig.error[actionLower] !== undefined) {
                return serviceConfig.error[actionLower]
            }
            if (serviceConfig.error.all !== undefined) {
                return serviceConfig.error.all
            }
        }
    }

    // Global fallbacks
    if (messageThreadIds.general !== undefined) {
        return messageThreadIds.general
    }

    return undefined
}

/**
 * Build telegram payload
 * @param {Object} data - Data to send
 * @param {Object} options - Telegram config
 * @returns {Object} Telegram payload
 */
function buildTelegramPayload(data, options) {
    const {
        chatId,
        messageThreadIds = {},
        service = 'hotel',
        type = 'error',
        action = 'all',
        beauty = true,
        specific = [],
        disableNotification = false
    } = options

    // Get thread ID using nested detection
    const messageThreadId = detectNestedThreadId({
        service,
        type,
        action,
        messageThreadIds
    })

    // Build message text
    const text = beauty
        ? buildTelegramMessage(data, true, specific)
        : buildSimpleMessage(data, specific)

    const payload = {
        chat_id: chatId,
        text,
        disable_notification: disableNotification
    }

    // Add thread ID if available
    if (messageThreadId !== undefined) {
        payload.message_thread_id = messageThreadId
    }

    // Add parse mode for beauty messages
    if (beauty) {
        payload.parse_mode = 'Markdown'
    }

    return payload
}

/**
 * Send message to Telegram
 * @param {Object} data - Data to send
 * @param {Object} options - Send options (can override defaults)
 */
async function sendMessage(data, options = {}) {
    if (!data) {
        throw new Error('data is required')
    }

    // Merge with instance config
    const config = { ...this.config, ...options }
    const { botToken, timeout = 10000, specific, strictMode } = config

    if (!botToken) {
        throw new Error('botToken is required')
    }

    try {
        // Apply data filtering if strictMode is enabled
        const filteredData = filterDataBySpecific(data, specific, strictMode)

        const payload = buildTelegramPayload(filteredData, config)
        const url = `${TELEGRAM.API_BASE_URL}${botToken}/sendMessage`

        const response = await httpClient.post(url, payload, {
            timeout,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return response.data
    } catch (err) {
        throw new Error(
            `Failed to send Telegram message: ${(err.response &&
                err.response.data &&
                err.response.data.description) ||
                err.message}`
        )
    }
}

/**
 * Send error alert
 * @param {Object} data - Error data
 * @param {Object} options - Send options
 */
async function error(data, options = {}) {
    return this.sendMessage(data, { ...options, type: 'error' })
}

/**
 * Send info alert
 * @param {Object} data - Info data
 * @param {Object} options - Send options
 */
async function info(data, options = {}) {
    return this.sendMessage(data, { ...options, type: 'info' })
}

/**
 * Send warning alert
 * @param {Object} data - Warning data
 * @param {Object} options - Send options
 */
async function warn(data, options = {}) {
    return this.sendMessage(data, { ...options, type: 'warning' })
}

/**
 * Send success alert
 * @param {Object} data - Success data
 * @param {Object} options - Send options
 */
async function success(data, options = {}) {
    return this.sendMessage(data, { ...options, type: 'success' })
}

module.exports = {
    buildTelegramMessage,
    buildSimpleMessage,
    detectNestedThreadId,
    buildTelegramPayload,
    sendMessage,
    error,
    info,
    warn,
    success
}
