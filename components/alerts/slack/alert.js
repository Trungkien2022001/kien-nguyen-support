const axios = require('axios')

/**
 * Build Slack message with beauty formatting options
 * @param {Object} data - Data object to display
 * @param {boolean} beauty - Enable rich formatting
 * @param {Array} specific - Specific field configurations
 * @returns {Object} Formatted Slack message
 */
function buildSlackMessage(data, beauty = true, specific = []) {
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

        return { text: lines.join('\n') }
    }

    // Rich Block Kit format
    const blocks = []

    // Header block
    const environment = data.environment || 'UNKNOWN'
    blocks.push({
        type: 'header',
        text: {
            type: 'plain_text',
            text: `🔧 ${environment} Environment Alert`
        }
    })

    // Build fields from data
    const fields = []

    if (specific && specific.length > 0) {
        // Use specific field configurations
        specific.forEach(field => {
            const { key, title, emoji = '', markdown = beauty } = field
            const value = data[key]

            if (value !== undefined && value !== null) {
                if (typeof value === 'object') {
                    blocks.push({
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: `${emoji} *${title}:*\n\`\`\`${JSON.stringify(
                                value,
                                null,
                                2
                            )}\`\`\``
                        }
                    })
                } else {
                    fields.push({
                        type: 'mrkdwn',
                        text: `${emoji} *${title}:*\n${
                            markdown ? `\`${value}\`` : value
                        }`
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
                    blocks.push({
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: `� *${title}:*\n\`\`\`${JSON.stringify(
                                value,
                                null,
                                2
                            )}\`\`\``
                        }
                    })
                } else {
                    fields.push({
                        type: 'mrkdwn',
                        text: `� *${title}:*\n\`${value}\``
                    })
                }
            }
        })
    }

    if (fields.length > 0) {
        // Split fields into groups of 10 (Slack limit)
        for (let i = 0; i < fields.length; i += 10) {
            blocks.push({
                type: 'section',
                fields: fields.slice(i, i + 10)
            })
        }
    }

    return { blocks }
}

/**
 * Detect Slack channel from nested config
 * @param {Object} params - Detection parameters
 * @param {string} params.service - Service type (hotel, flight, etc.)
 * @param {string} params.type - Alert type (error, info, etc.)
 * @param {string} params.action - Action type (search, book, etc.)
 * @param {Object} params.channels - Nested channels config
 * @returns {string|undefined} Channel name
 */
function detectSlackChannel({ service, type, action, channels }) {
    if (!channels || Object.keys(channels).length === 0) {
        return undefined
    }

    const serviceLower = (service || 'hotel').toLowerCase()
    const typeLower = (type || 'error').toLowerCase()
    const actionLower = (action || 'all').toLowerCase()

    // Try nested structure: service -> type -> action
    if (channels[serviceLower]) {
        const serviceConfig = channels[serviceLower]

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
    if (channels.general !== undefined) {
        return channels.general
    }

    return undefined
}

/**
 * Build Slack payload
 * @param {Object} data - Data to send
 * @param {Object} options - Slack config
 * @returns {Object} Slack payload
 */
function buildSlackPayload(data, options) {
    const {
        channels = {},
        service = 'hotel',
        type = 'error',
        action = 'all',
        beauty = true,
        specific = [],
        channel
    } = options

    // Get channel using dynamic detection or use default
    const targetChannel =
        channel ||
        detectSlackChannel({
            service,
            type,
            action,
            channels
        })

    // Build message
    const payload = buildSlackMessage(data, beauty, specific)

    // Add channel if available
    if (targetChannel) {
        payload.channel = targetChannel
    }

    return payload
}

/**
 * Send message to Slack
 * @param {Object} data - Data to send
 * @param {Object} options - Send options (can override defaults)
 */
async function sendMessage(data, options = {}) {
    if (!data) {
        throw new Error('data is required')
    }

    // Merge with instance config
    const config = { ...this.config, ...options }
    const { webhookUrl, timeout = 5000 } = config

    if (!webhookUrl) {
        throw new Error('webhookUrl is required')
    }

    try {
        const payload = buildSlackPayload(data, config)

        await axios.post(webhookUrl, payload, {
            timeout,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return { success: true }
    } catch (err) {
        throw new Error(
            `Failed to send Slack message: ${(err.response &&
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
    buildSlackMessage,
    detectSlackChannel,
    buildSlackPayload,
    sendMessage,
    error,
    info,
    warn,
    success
}
