const { httpClient } = require('../../../utils')

/**
 * Skype Bot alert utility functions
 */

/**
 * Send message to Skype using Bot Framework API
 * @param {Object} config - Skype configuration
 * @param {string} config.botId - Skype bot application ID
 * @param {string} config.botPassword - Skype bot password
 * @param {string} config.conversationId - Skype conversation ID
 * @param {string} message - Message text
 */
async function sendMessage(config, message) {
    const { botId, botPassword, conversationId, timeout = 10000 } = config

    try {
        // Get access token first
        const tokenUrl =
            'https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token'
        const tokenParams = new URLSearchParams()
        tokenParams.append('grant_type', 'client_credentials')
        tokenParams.append('client_id', botId)
        tokenParams.append('client_secret', botPassword)
        tokenParams.append('scope', 'https://api.botframework.com/.default')

        const tokenResponse = await httpClient.post(tokenUrl, tokenParams, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            timeout
        })

        const accessToken = tokenResponse.data.access_token

        // Send message
        const messageUrl = `https://smba.trafficmanager.net/apis/v3/conversations/${conversationId}/activities`

        const messagePayload = {
            type: 'message',
            text: message,
            textFormat: 'markdown'
        }

        const response = await httpClient.post(messageUrl, messagePayload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            timeout
        })

        return {
            success: true,
            messageId: response.data.id,
            response: response.data
        }
    } catch (sendError) {
        const errorMessage =
            sendError.response &&
            sendError.response.data &&
            sendError.response.data.error
                ? sendError.response.data.error.message
                : sendError.message
        throw new Error(`Skype send failed: ${errorMessage}`)
    }
}

/**
 * Format message for Skype with markdown support
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
