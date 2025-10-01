/* eslint-disable no-return-await */
/* eslint-disable no-unused-vars */
const { httpClient } = require('../../../utils')

/**
 * WhatsApp alert utility functions
 */

/**
 * Send message to WhatsApp using Business API
 * @param {Object} config - WhatsApp configuration
 * @param {string} config.phoneNumberId - WhatsApp Business phone number ID
 * @param {string} config.accessToken - WhatsApp Business access token
 * @param {string} config.recipientPhone - Recipient phone number
 * @param {string} message - Message text
 * @param {Object} options - Additional options
 */
async function sendMessage(config, message, options = {}) {
    const {
        phoneNumberId,
        accessToken,
        recipientPhone,
        timeout = 10000
    } = config

    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`

    const payload = {
        messaging_product: 'whatsapp',
        to: recipientPhone,
        type: 'text',
        text: {
            body: message
        }
    }

    try {
        const response = await httpClient.post(url, payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            timeout
        })

        return {
            success: true,
            messageId:
                response.data.messages && response.data.messages[0]
                    ? response.data.messages[0].id
                    : null,
            response: response.data
        }
    } catch (err) {
        throw new Error(
            `WhatsApp send failed: ${
                err.response &&
                err.response.data &&
                err.response.data.error &&
                err.response.data.error.message
                    ? err.response.data.error.message
                    : err.message
            }`
        )
    }
}

/**
 * Format message with rich formatting for WhatsApp
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
    let message = `${emoji} *${environment} Alert*\n\n`

    // Error/message content
    if (data.message || data.error_message) {
        message += `📝 *Message:*\n${data.message || data.error_message}\n\n`
    }

    if (data.error_code) {
        message += `❌ *Error Code:* ${data.error_code}\n\n`
    }

    // User info
    if (data.user_id || data.user_email) {
        message += `👤 *User:*\n`
        if (data.user_id) message += `• ID: ${data.user_id}\n`
        if (data.user_email) message += `• Email: ${data.user_email}\n`
        message += '\n'
    }

    // Booking info
    if (data.booking_id || data.search_id) {
        message += `🔍 *IDs:*\n`
        if (data.booking_id) message += `• Booking: ${data.booking_id}\n`
        if (data.search_id) message += `• Search: ${data.search_id}\n`
        if (data.trace_id) message += `• Trace: ${data.trace_id}\n`
        message += '\n'
    }

    // Supplier info
    if (data.supplier) {
        message += `🏢 *Supplier:*\n`
        if (data.supplier.code) message += `• Code: ${data.supplier.code}\n`
        if (data.supplier.id) message += `• ID: ${data.supplier.id}\n`
        message += '\n'
    }

    // Additional metadata
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
        .filter(key => !excludeKeys.includes(key))
        .reduce((obj, key) => {
            obj[key] = data[key]

            return obj
        }, {})

    if (Object.keys(additionalData).length > 0) {
        message += `📋 *Additional Data:*\n`
        message += '```\n'
        message += JSON.stringify(additionalData, null, 2)
        message += '\n```\n\n'
    }

    // Error stack (truncated)
    if (data.error_stack) {
        const stackLines = data.error_stack.split('\n').slice(0, 2)
        message += `🐛 *Stack:*\n`
        message += '```\n'
        message += stackLines.join('\n')
        message += '\n```'
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
