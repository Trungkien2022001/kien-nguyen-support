const axios = require('axios')

/**
 * Build Zalo message with beauty formatting options
 * @param {Object} data - Data object to display
 * @param {boolean} beauty - Enable rich formatting
 * @param {Array} specific - Specific field configurations
 * @returns {Object} Formatted Zalo message
 */
function buildZaloMessage(data, beauty = true, specific = []) {
    if (!beauty) {
        // Simple text format
        const lines = []

        if (specific && specific.length > 0) {
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
                        typeof value === 'object'
                            ? JSON.stringify(value)
                            : value
                    lines.push(`${title}: ${displayValue}`)
                }
            })
        }

        return {
            message: {
                text: lines.join('\n')
            }
        }
    }

    // Rich message format for Zalo
    const elements = []
    const environment = data.environment || 'UNKNOWN'

    // Header element
    elements.push({
        type: 'text',
        text: `🚨 ${environment} Environment Alert`,
        style: 'bold'
    })

    // Build message elements from data
    if (specific && specific.length > 0) {
        // Use specific field configurations
        specific.forEach(field => {
            const { key, title, emoji = '' } = field
            const value = data[key]

            if (value !== undefined && value !== null) {
                if (typeof value === 'object') {
                    elements.push({
                        type: 'text',
                        text: `${emoji} ${title}:`,
                        style: 'bold'
                    })
                    elements.push({
                        type: 'text',
                        text: JSON.stringify(value, null, 2)
                    })
                } else {
                    elements.push({
                        type: 'text',
                        text: `${emoji} ${title}: ${value}`
                    })
                }
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

                if (typeof value === 'object') {
                    elements.push({
                        type: 'text',
                        text: `📋 ${title}:`,
                        style: 'bold'
                    })
                    elements.push({
                        type: 'text',
                        text: JSON.stringify(value, null, 2)
                    })
                } else {
                    elements.push({
                        type: 'text',
                        text: `📝 ${title}: ${value}`
                    })
                }
            }
        })
    }

    return {
        message: {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'list',
                    elements
                }
            }
        }
    }
}

/**
 * Detect Zalo conversation from nested config
 * @param {Object} params - Detection parameters
 * @param {string} params.service - Service type (hotel, flight, etc.)
 * @param {string} params.type - Alert type (error, info, etc.)
 * @param {string} params.action - Action type (search, book, etc.)
 * @param {Object} params.conversations - Nested conversations config
 * @returns {string|undefined} Conversation ID
 */
function detectZaloConversation({ service, type, action, conversations }) {
    if (!conversations || Object.keys(conversations).length === 0) {
        return undefined
    }

    const serviceLower = (service || 'hotel').toLowerCase()
    const typeLower = (type || 'error').toLowerCase()
    const actionLower = (action || 'all').toLowerCase()

    // Try nested structure: service -> type -> action
    if (conversations[serviceLower]) {
        const serviceConfig = conversations[serviceLower]

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
        if (typeLower !== 'error' && serviceConfig.error) {
            if (serviceConfig.error[actionLower] !== undefined) {
                return serviceConfig.error[actionLower]
            }
            if (serviceConfig.error.all !== undefined) {
                return serviceConfig.error.all
            }
        }
    }

    // Global fallbacks
    if (conversations.general !== undefined) {
        return conversations.general
    }

    return undefined
}

/**
 * Build Zalo payload
 * @param {Object} data - Data to send
 * @param {Object} options - Zalo config
 * @returns {Object} Zalo payload
 */
function buildZaloPayload(data, options) {
    const {
        conversations = {},
        service = 'hotel',
        type = 'error',
        action = 'all',
        beauty = true,
        specific = [],
        userId
    } = options

    // Get conversation ID using dynamic detection or use userId
    const conversationId = detectZaloConversation({
        service,
        type,
        action,
        conversations
    })

    // Build message
    const messagePayload = buildZaloMessage(data, beauty, specific)

    // Zalo API structure
    const payload = {
        recipient: {
            user_id: userId || conversationId
        },
        ...messagePayload
    }

    return payload
}

/**
 * Send message to Zalo
 * @param {Object} data - Data to send
 * @param {Object} options - Send options (can override defaults)
 */
async function sendMessage(data, options = {}) {
    if (!data) {
        throw new Error('data is required')
    }

    // Merge with instance config
    const config = { ...this.config, ...options }
    const { accessToken, timeout = 5000 } = config

    if (!accessToken) {
        throw new Error('accessToken is required')
    }

    try {
        const payload = buildZaloPayload(data, config)
        const url = `https://openapi.zalo.me/v2.0/oa/message`

        await axios.post(url, payload, {
            timeout,
            headers: {
                'Content-Type': 'application/json',
                access_token: accessToken
            }
        })

        return { success: true }
    } catch (err) {
        throw new Error(
            `Failed to send Zalo message: ${(err.response &&
                err.response.data &&
                err.response.data.error) ||
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
    buildZaloMessage,
    detectZaloConversation,
    buildZaloPayload,
    sendMessage,
    error,
    info,
    warn,
    success
}
