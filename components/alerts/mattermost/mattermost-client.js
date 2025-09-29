const { sendMessage, error, info, warn, success } = require('./alert')

/**
 * MattermostAlert class for sending alerts via Mattermost
 */
class MattermostAlert {
    /**
     * Constructor for MattermostAlert
     * @param {Object} config - Configuration object
     * @param {string} config.apiUrl - Mattermost API URL for posting messages
     * @param {string} config.token - Mattermost bot token or personal access token
     * @param {string} config.channelId - Default channel ID to post messages
     * @param {string} config.environment - Environment (PRODUCTION, STAGING, DEV)
     * @param {number} config.timeout - Request timeout in ms (optional, default: 10000)
     * @param {boolean} config.beauty - Enable rich formatting (optional, default: true)
     * @param {Array} config.specific - Specific field configurations (optional)
     */
    constructor(config) {
        if (!config) {
            throw new Error('Configuration is required')
        }

        const {
            apiUrl,
            token,
            channelId,
            environment = 'STAGING',
            timeout = 10000,
            beauty = true,
            specific = []
        } = config

        // Validate required fields
        if (!apiUrl) {
            throw new Error('Mattermost apiUrl is required')
        }
        if (!token) {
            throw new Error('Mattermost token is required')
        }
        if (!channelId) {
            throw new Error('Mattermost channelId is required')
        }

        // Store configuration
        this.config = {
            apiUrl,
            token,
            channelId,
            environment,
            timeout,
            beauty,
            specific
        }
    }

    /**
     * Send message to Mattermost
     * @param {Object} data - Data to send
     * @param {Object} options - Send options (can override defaults)
     * @returns {Promise<Object>} Mattermost sending result
     */
    async sendMessage(data, options = {}) {
        return sendMessage.call(this, data, options)
    }

    /**
     * Send error alert
     * @param {Object} data - Error data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Mattermost sending result
     */
    async error(data, options = {}) {
        return error.call(this, data, options)
    }

    /**
     * Send info alert
     * @param {Object} data - Info data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Mattermost sending result
     */
    async info(data, options = {}) {
        return info.call(this, data, options)
    }

    /**
     * Send warning alert
     * @param {Object} data - Warning data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Mattermost sending result
     */
    async warn(data, options = {}) {
        return warn.call(this, data, options)
    }

    /**
     * Send success alert
     * @param {Object} data - Success data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Mattermost sending result
     */
    async success(data, options = {}) {
        return success.call(this, data, options)
    }

    /**
     * Update configuration
     * @param {Object} newConfig - New configuration to merge
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig }
    }

    /**
     * Get current configuration
     * @returns {Object} Current configuration
     */
    getConfig() {
        return { ...this.config }
    }
}

module.exports = MattermostAlert
