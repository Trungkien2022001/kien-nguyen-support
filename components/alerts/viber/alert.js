/* eslint-disable no-return-await */
/* eslint-disable no-unused-vars */
const { httpClient } = require('../../../utils')

/**
 * Viber Bot alert utility functions
 */

/**
 * Send message to Viber using Bot API
 * @param {Object} config - Viber configuration
 * @param {string} config.botToken - Viber bot authentication token
 * @param {string} config.receiverId - Viber user ID to send message to
 * @param {string} message - Message text
 * @param {Object} options - Additional options
 */
async function sendMessage(config, message, options = {}) {
    const {
        botToken,
        receiverId,
        botName = 'Alert Bot',
        botAvatar = '',
        timeout = 10000
    } = config

    const url = 'https://chatapi.viber.com/pa/send_message'

    const payload = {
        receiver: receiverId,
        type: 'text',
        text: message,
        sender: {
            name: botName,
            avatar: botAvatar
        }
    }

    try {
        const response = await httpClient.post(url, payload, {
            headers: {
                'X-Viber-Auth-Token': botToken,
                'Content-Type': 'application/json'
            },
            timeout
        })

        if (response.data.status !== 0) {
            throw new Error(`Viber API error: ${response.data.status_message}`)
        }

        return {
            success: true,
            messageToken: response.data.message_token,
            response: response.data
        }
    } catch (err) {
        const errorMessage =
            err.response &&
            err.response.data &&
            err.response.data.status_message
                ? err.response.data.status_message
                : err.message
        throw new Error(`Viber send failed: ${errorMessage}`)
    }
}

/**
 * Format message for Viber
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
    let message = `${emoji} ${environment} Alert\n${service.toUpperCase()} Service\n\n`

    // Error/message content
    if (data.message || data.error_message) {
        message += `📝 Message:\n${data.message || data.error_message}\n\n`
    }

    if (data.error_code) {
        message += `❌ Error Code: ${data.error_code}\n\n`
    }

    // User info
    if (data.user_id || data.user_email) {
        message += `👤 User:\n`
        if (data.user_id) message += `ID: ${data.user_id}\n`
        if (data.user_email) message += `Email: ${data.user_email}\n`
        message += '\n'
    }

    // Reference IDs
    if (data.booking_id || data.search_id || data.trace_id) {
        message += `🔍 References:\n`
        if (data.booking_id) message += `Booking: ${data.booking_id}\n`
        if (data.search_id) message += `Search: ${data.search_id}\n`
        if (data.trace_id) message += `Trace: ${data.trace_id}\n`
        message += '\n'
    }

    // Supplier info
    if (data.supplier) {
        message += `🏢 Supplier:\n`
        if (data.supplier.code) message += `Code: ${data.supplier.code}\n`
        if (data.supplier.id) message += `ID: ${data.supplier.id}\n`
        message += '\n'
    }

    // Additional data (limited for Viber)
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
        .slice(0, 3) // Limit to 3 items for Viber
        .reduce((obj, key) => {
            obj[key] = data[key]

            return obj
        }, {})

    if (Object.keys(additionalData).length > 0) {
        message += `📋 Additional:\n`
        Object.entries(additionalData).forEach(([key, value]) => {
            const displayValue =
                typeof value === 'object'
                    ? JSON.stringify(value)
                    : String(value)
            message += `${key}: ${displayValue.slice(0, 40)}${
                displayValue.length > 40 ? '...' : ''
            }\n`
        })
        message += '\n'
    }

    // Error stack (first line only)
    if (data.error_stack) {
        const firstLine = data.error_stack.split('\n')[0]
        message += `🐛 ${firstLine}`
    }

    return message
}

/**
 * Send error alert
 */
async function error(config, data) {
    const message = formatMessage(data, 'error', config)

    return await sendMessage(config, message)
}

/**
 * Send info alert
 */
async function info(config, data) {
    const message = formatMessage(data, 'info', config)

    return await sendMessage(config, message)
}

/**
 * Send warning alert
 */
async function warn(config, data) {
    const message = formatMessage(data, 'warn', config)

    return await sendMessage(config, message)
}

/**
 * Send success alert
 */
async function success(config, data) {
    const message = formatMessage(data, 'success', config)

    return await sendMessage(config, message)
}

module.exports = {
    sendMessage,
    formatMessage,
    error,
    info,
    warn,
    success
}
