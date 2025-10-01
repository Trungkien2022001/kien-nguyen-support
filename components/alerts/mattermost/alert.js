const { httpClient, filterDataBySpecific } = require('../../../utils')

/**
 * Get type emoji for Mattermost messages
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
 * Build Mattermost message with beauty formatting options
 * @param {Object} data - Data object with dynamic properties
 * @param {boolean} beauty - Enable rich formatting
 * @param {Array} specific - Specific field configurations
 * @param {string} type - Alert type
 * @param {string} environment - Environment
 * @returns {Object} Formatted Mattermost message
 */
function buildMattermostMessage(
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
                lines.push(`${key}: \`${data[key]}\``)
            }
        })

        return { text: lines.join('\n') }
    }

    // Rich Markdown format for Mattermost
    const lines = []
    lines.push('------------------------')
    lines.push(`**[From Mattermost Bot Alert]**`)
    lines.push(`${getTypeEmoji(type)} **Environment:** \`${environment}\``)

    // Handle specific field configurations first
    if (specific && specific.length > 0) {
        specific.forEach(fieldConfig => {
            const value = data[fieldConfig.key]
            if (value != null) {
                const label =
                    fieldConfig.title || fieldConfig.label || fieldConfig.key

                // Special formatting for different data types
                if (typeof value === 'object') {
                    lines.push(`**${label}:**`)
                    lines.push('```json')
                    lines.push(JSON.stringify(value, null, 2))
                    lines.push('```')
                } else if (
                    fieldConfig.key === 'curl' ||
                    fieldConfig.key === 'curl_command'
                ) {
                    lines.push(`**${label}:**`)
                    lines.push('```bash')
                    lines.push(value)
                    lines.push('```')
                } else {
                    lines.push(`**${label}:** \`${value}\``)
                }
            }
        })
    } else {
        // Auto-display all object properties when no specific config
        Object.keys(data).forEach(key => {
            if (data[key] != null) {
                const value = data[key]

                if (typeof value === 'object') {
                    lines.push(`**${key}:**`)
                    lines.push('```json')
                    lines.push(JSON.stringify(value, null, 2))
                    lines.push('```')
                } else if (key === 'curl' || key === 'curl_command') {
                    lines.push(`**${key}:**`)
                    lines.push('```bash')
                    lines.push(value)
                    lines.push('```')
                } else {
                    lines.push(`**${key}:** \`${value}\``)
                }
            }
        })
    }

    lines.push('------------------------')

    return { text: lines.join('\n') }
}

/**
 * Build Mattermost payload
 * @param {Object} data - Data to send
 * @param {Object} options - Mattermost config
 * @returns {Object} Mattermost payload
 */
function buildMattermostPayload(data, options) {
    const {
        beauty = true,
        specific = [],
        type = 'error',
        environment = 'STAGING',
        channelId,
        channelId: legacyChannelId
    } = options

    const message = buildMattermostMessage(
        data,
        beauty,
        specific,
        type,
        environment
    )

    return {
        channel_id: channelId || legacyChannelId,
        message: message.text
    }
}

/**
 * Send Mattermost message
 * @param {Object} data - Data to send
 * @param {Object} options - Send options
 */
async function sendMessage(data, options = {}) {
    // Merge with instance config
    const config = { ...this.config, ...options }
    const { specific, strictMode } = config

    try {
        // Apply data filtering if strictMode is enabled
        const filteredData = filterDataBySpecific(data, specific, strictMode)

        const payload = buildMattermostPayload(filteredData, config)

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.token}`
        }

        await httpClient.post(config.apiUrl, payload, {
            timeout: config.timeout || 10000,
            headers
        })

        return { success: true }
    } catch (err) {
        throw new Error(`Failed to send Mattermost message: ${err.message}`)
    }
}

/**
 * Send error alert
 * @param {Object} data - Error data
 * @param {Object} options - Send options
 * @returns {Promise<Object>} Mattermost sending result
 */
async function error(data, options = {}) {
    return sendMessage.call(this, data, { ...options, type: 'error' })
}

/**
 * Send info alert
 * @param {Object} data - Info data
 * @param {Object} options - Send options
 * @returns {Promise<Object>} Mattermost sending result
 */
async function info(data, options = {}) {
    return sendMessage.call(this, data, { ...options, type: 'info' })
}

/**
 * Send warning alert
 * @param {Object} data - Warning data
 * @param {Object} options - Send options
 * @returns {Promise<Object>} Mattermost sending result
 */
async function warn(data, options = {}) {
    return sendMessage.call(this, data, { ...options, type: 'warn' })
}

/**
 * Send success alert
 * @param {Object} data - Success data
 * @param {Object} options - Send options
 * @returns {Promise<Object>} Mattermost sending result
 */
async function success(data, options = {}) {
    return sendMessage.call(this, data, { ...options, type: 'success' })
}

module.exports = {
    buildMattermostMessage,
    buildMattermostPayload,
    sendMessage,
    error,
    info,
    warn,
    success
}
