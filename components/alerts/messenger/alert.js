const { httpClient } = require('../../../utils')

/**
 * Get type emoji for Messenger messages
 * @param {string} type - Alert type
 * @returns {string} Emoji
 */
function getTypeEmoji(type) {
    switch (type) {
        case 'error':
            return '🚨'
        case 'warn':
        case 'warning':
            return '⚠️'
        case 'info':
            return 'ℹ️'
        case 'success':
            return '✅'
        default:
            return '📋'
    }
}

/**
 * Build Messenger message with beauty formatting options
 * @param {Object} data - Data object with dynamic properties
 * @param {boolean} beauty - Enable rich formatting
 * @param {Array} specific - Specific field configurations
 * @param {string} type - Alert type
 * @param {string} environment - Environment
 * @returns {Object} Formatted Messenger message
 */
function buildMessengerMessage(
    data,
    beauty = true,
    specific = [],
    type = 'error',
    environment = 'STAGING'
) {
    if (!beauty) {
        // Simple text format
        const lines = []
        lines.push(`${getTypeEmoji(type)} Environment: ${environment}`)

        // Auto-display all object properties
        Object.keys(data).forEach(key => {
            if (data[key] != null) {
                lines.push(`${key}: ${data[key]}`)
            }
        })

        return { text: lines.join('\n') }
    }

    // Rich message format using Messenger structured messages
    const elements = []

    // Main alert card
    const mainElement = {
        title: `${getTypeEmoji(type)} ${environment} Environment Alert`,
        subtitle: data.message || data.error_message || 'System notification',
        buttons: []
    }

    elements.push(mainElement)

    // Build text summary for fallback
    const textLines = []
    textLines.push(`${getTypeEmoji(type)} Environment: ${environment}`)

    // Handle specific field configurations first
    if (specific && specific.length > 0) {
        specific.forEach(fieldConfig => {
            const value = data[fieldConfig.key]
            if (value != null) {
                const label = fieldConfig.label || fieldConfig.key
                textLines.push(`${label}: ${value}`)
            }
        })
    }

    // Auto-display remaining object properties
    Object.keys(data).forEach(key => {
        // Skip if already handled in specific fields
        const isSpecific =
            specific && specific.some(fieldConfig => fieldConfig.key === key)
        if (!isSpecific && data[key] != null) {
            textLines.push(`${key}: ${data[key]}`)
        }
    })

    return {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements
            }
        },
        // Fallback text for clients that don't support structured messages
        text: textLines.join('\n')
    }
}

/**
 * Build Messenger payload
 * @param {Object} data - Data to send
 * @param {Object} options - Messenger config
 * @returns {Object} Messenger payload
 */
function buildMessengerPayload(data, options) {
    const {
        beauty = true,
        specific = [],
        type = 'error',
        environment = 'STAGING',
        recipientId
    } = options

    const messageData = buildMessengerMessage(
        data,
        beauty,
        specific,
        type,
        environment
    )

    return {
        recipient: {
            id: recipientId
        },
        message: messageData
    }
}

/**
 * Send Messenger message
 * @param {Object} data - Data to send
 * @param {Object} options - Send options
 */
async function sendMessage(data, options = {}) {
    // Merge with instance config
    const config = { ...this.config, ...options }

    try {
        const payload = buildMessengerPayload(data, config)

        const url = `https://graph.facebook.com/v18.0/me/messages?access_token=${config.pageAccessToken}`

        await httpClient.post(url, payload, {
            timeout: config.timeout || 5000,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return { success: true }
    } catch (err) {
        throw new Error(`Failed to send Messenger message: ${err.message}`)
    }
}

/**
 * Send error alert
 * @param {Object} data - Error data
 * @param {Object} options - Send options
 * @returns {Promise<Object>} Messenger sending result
 */
async function error(data, options = {}) {
    return sendMessage.call(this, data, { ...options, type: 'error' })
}

/**
 * Send info alert
 * @param {Object} data - Info data
 * @param {Object} options - Send options
 * @returns {Promise<Object>} Messenger sending result
 */
async function info(data, options = {}) {
    return sendMessage.call(this, data, { ...options, type: 'info' })
}

/**
 * Send warning alert
 * @param {Object} data - Warning data
 * @param {Object} options - Send options
 * @returns {Promise<Object>} Messenger sending result
 */
async function warn(data, options = {}) {
    return sendMessage.call(this, data, { ...options, type: 'warn' })
}

/**
 * Send success alert
 * @param {Object} data - Success data
 * @param {Object} options - Send options
 * @returns {Promise<Object>} Messenger sending result
 */
async function success(data, options = {}) {
    return sendMessage.call(this, data, { ...options, type: 'success' })
}

module.exports = {
    buildMessengerMessage,
    buildMessengerPayload,
    sendMessage,
    error,
    info,
    warn,
    success
}
