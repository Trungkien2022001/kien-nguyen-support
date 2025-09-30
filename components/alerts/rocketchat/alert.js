const { httpClient } = require('../../../utils')

/**
 * Rocket.Chat alert utility functions
 */

/**
 * Send message to Rocket.Chat using webhook
 * @param {Object} config - Rocket.Chat configuration
 * @param {string} config.webhookUrl - Rocket.Chat webhook URL
 * @param {string} message - Message text
 */
async function sendMessage(config, message) {
    const { webhookUrl, username = 'AlertBot', timeout = 10000 } = config

    try {
        const payload = {
            text: message,
            username,
            channel: config.channel || undefined
        }

        const response = await httpClient.post(webhookUrl, payload, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout
        })

        return {
            success: true,
            response: response.data
        }
    } catch (sendError) {
        const errorMessage =
            sendError.response && sendError.response.data
                ? sendError.response.data.error ||
                  sendError.response.data.message
                : sendError.message
        throw new Error(`Rocket.Chat send failed: ${errorMessage}`)
    }
}

/**
 * Format message for Rocket.Chat with markdown support
 */
function formatMessage(data, type = 'error', config = {}) {
    const { beauty = true, environment = 'STAGING', service = 'hotel' } = config

    if (!beauty) {
        return typeof data === 'object'
            ? JSON.stringify(data, null, 2)
            : String(data)
    }

    const typeEmojis = {
        error: '🚨',
        info: 'ℹ️',
        warn: '⚠️',
        success: '✅'
    }

    const emoji = typeEmojis[type] || '📋'
    let message = `${emoji} **${environment} Alert** - ${service.toUpperCase()}\n\n`

    // Error/message content
    if (data.message || data.error_message) {
        message += `**📝 Message:**\n${data.message || data.error_message}\n\n`
    }

    if (data.error_code) {
        message += `**❌ Error Code:** \`${data.error_code}\`\n\n`
    }

    // User info
    if (data.user_id || data.user_email) {
        message += `**👤 User Information:**\n`
        if (data.user_id) message += `• ID: \`${data.user_id}\`\n`
        if (data.user_email) message += `• Email: ${data.user_email}\n`
        message += '\n'
    }

    // Reference IDs
    if (data.booking_id || data.search_id || data.trace_id) {
        message += `**🔍 Reference IDs:**\n`
        if (data.booking_id) message += `• Booking: \`${data.booking_id}\`\n`
        if (data.search_id) message += `• Search: \`${data.search_id}\`\n`
        if (data.trace_id) message += `• Trace: \`${data.trace_id}\`\n`
        message += '\n'
    }

    // Supplier info
    if (data.supplier) {
        message += `**🏢 Supplier:**\n`
        if (data.supplier.code) message += `• Code: \`${data.supplier.code}\`\n`
        if (data.supplier.id) message += `• ID: \`${data.supplier.id}\`\n`
        message += '\n'
    }

    // Additional data
    const excludeKeys = [
        'message',
        'error_message',
        'error_code',
        'user_id',
        'user_email',
        'booking_id',
        'search_id',
        'trace_id',
        'supplier',
        'error_stack'
    ]
    const additionalData = Object.keys(data)
        .filter(key => !excludeKeys.includes(key) && data[key] !== undefined)
        .slice(0, 5)
        .reduce((obj, key) => {
            obj[key] = data[key]

            return obj
        }, {})

    if (Object.keys(additionalData).length > 0) {
        message += `**📋 Additional Information:**\n`
        Object.entries(additionalData).forEach(([key, value]) => {
            const displayValue =
                typeof value === 'object'
                    ? JSON.stringify(value)
                    : String(value)
            message += `• ${key}: \`${displayValue.slice(0, 50)}${
                displayValue.length > 50 ? '...' : ''
            }\`\n`
        })
        message += '\n'
    }

    // Error stack (first line only)
    if (data.error_stack) {
        const firstLine = data.error_stack.split('\n')[0]
        message += `**🐛 Error Stack:**\n\`\`\`\n${firstLine}\n\`\`\``
    }

    return message
}

/**
 * Send error alert
 */
async function error(config, data) {
    const message = formatMessage(data, 'error', config)

    return sendMessage(config, message)
}

/**
 * Send info alert
 */
async function info(config, data) {
    const message = formatMessage(data, 'info', config)

    return sendMessage(config, message)
}

/**
 * Send warning alert
 */
async function warn(config, data) {
    const message = formatMessage(data, 'warn', config)

    return sendMessage(config, message)
}

/**
 * Send success alert
 */
async function success(config, data) {
    const message = formatMessage(data, 'success', config)

    return sendMessage(config, message)
}

module.exports = {
    sendMessage,
    formatMessage,
    error,
    info,
    warn,
    success
}
