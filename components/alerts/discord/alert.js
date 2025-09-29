const axios = require('axios')

/**
 * Get type color for Discord embeds
 * @param {s        specific.forEach(fieldConfig => {
            const value = data[fieldConfig.key]
            if (value != null) {
                embed.fields.push({
                    name: fieldConfig.label || fieldConfig.key,
                    value: `\`${value}\`,
                    inline: true
                })
            }
        })e - Alert type
 * @returns {number} Discord color code
 */
function getTypeColor(type) {
    switch (type) {
        case 'error':
            return 0xe74c3c // Red
        case 'warn':
        case 'warning':
            return 0xf39c12 // Orange
        case 'info':
            return 0x3498db // Blue
        case 'success':
            return 0x27ae60 // Green
        default:
            return 0x95a5a6 // Gray
    }
}

/**
 * Get type emoji for Discord messages
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
 * Build Discord message with beauty formatting options
 * @param {Object} data - Data object with dynamic properties
 * @param {boolean} beauty - Enable rich formatting
 * @param {Array} specific - Specific field configurations
 * @param {string} type - Alert type
 * @param {string} environment - Environment
 * @returns {Object} Formatted Discord message
 */
function buildDiscordMessage(
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

        return { content: lines.join('\n') }
    }

    // Rich embed format
    const embed = {
        title: `${getTypeEmoji(type)} ${environment} Environment Alert`,
        color: getTypeColor(type),
        timestamp: new Date().toISOString(),
        fields: []
    }

    // Handle specific field configurations
    if (specific && specific.length > 0) {
        specific.forEach(fieldConfig => {
            const value = data[fieldConfig.key]
            if (value != null) {
                embed.fields.push({
                    name: fieldConfig.label || fieldConfig.key,
                    value: `\`${value}\``,
                    inline: true
                })
            }
        })
    }

    // Auto-display remaining object properties
    Object.keys(data).forEach(key => {
        // Skip if already handled in specific fields
        const isSpecific =
            specific && specific.some(fieldConfig => fieldConfig.key === key)
        if (!isSpecific && data[key] != null) {
            embed.fields.push({
                name: key,
                value: `\`${data[key]}\``,
                inline: true
            })
        }
    })

    // Use message or error_message as description
    const description = data.message || data.error_message
    if (description) {
        embed.description = `📝 **Message:**\n\`\`\`${description}\`\`\``
    }

    return {
        embeds: [embed]
    }
}

/**
 * Build Discord payload
 * @param {Object} data - Data to send
 * @param {Object} options - Discord config
 * @returns {Object} Discord payload
 */
function buildDiscordPayload(data, options) {
    const {
        beauty = true,
        specific = [],
        type = 'error',
        environment = 'STAGING'
    } = options

    return buildDiscordMessage(data, beauty, specific, type, environment)
}

/**
 * Send Discord message
 * @param {Object} data - Data to send
 * @param {Object} options - Send options
 */
async function sendMessage(data, options = {}) {
    // Merge with instance config
    const config = { ...this.config, ...options }

    try {
        const payload = buildDiscordPayload(data, config)

        await axios.post(config.webhookUrl, payload, {
            timeout: config.timeout || 5000,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return { success: true }
    } catch (err) {
        throw new Error(`Failed to send Discord message: ${err.message}`)
    }
}

/**
 * Send error alert
 * @param {Object} data - Error data
 * @param {Object} options - Send options
 * @returns {Promise<Object>} Discord sending result
 */
async function error(data, options = {}) {
    return sendMessage.call(this, data, { ...options, type: 'error' })
}

/**
 * Send info alert
 * @param {Object} data - Info data
 * @param {Object} options - Send options
 * @returns {Promise<Object>} Discord sending result
 */
async function info(data, options = {}) {
    return sendMessage.call(this, data, { ...options, type: 'info' })
}

/**
 * Send warning alert
 * @param {Object} data - Warning data
 * @param {Object} options - Send options
 * @returns {Promise<Object>} Discord sending result
 */
async function warn(data, options = {}) {
    return sendMessage.call(this, data, { ...options, type: 'warn' })
}

/**
 * Send success alert
 * @param {Object} data - Success data
 * @param {Object} options - Send options
 * @returns {Promise<Object>} Discord sending result
 */
async function success(data, options = {}) {
    return sendMessage.call(this, data, { ...options, type: 'success' })
}

module.exports = {
    buildDiscordMessage,
    buildDiscordPayload,
    sendMessage,
    error,
    info,
    warn,
    success
}
