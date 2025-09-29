const { sendMessage, error, info, warn, success } = require('./alert')

/**
 * ZaloAlert class for sending alerts to Zalo
 */
class ZaloAlert {
    /**
     * Constructor for ZaloAlert
     * @param {Object} config - Configuration object
     * @param {string} config.accessToken - Zalo OA access token
     * @param {string} config.userId - Default user ID to send messages to
     * @param {string} config.service - Service type (hotel, flight, tour, transfer)
     * @param {string} config.environment - Environment (PRODUCTION, STAGING, DEV)
     * @param {number} config.timeout - Request timeout in ms (optional, default: 5000)
     * @param {Object} config.conversations - Nested conversation IDs configuration
     * @param {boolean} config.beauty - Enable rich formatting (optional, default: true)
     * @param {Array} config.specific - Specific field configurations (optional)
     * @param {string} config.action - Action type for conversation routing (optional, default: 'all')
     */
    constructor(config) {
        if (!config) {
            throw new Error('Configuration is required')
        }

        const {
            accessToken,
            userId,
            service = 'hotel',
            environment = 'STAGING',
            timeout = 5000,
            conversations = {},
            beauty = true,
            specific = [],
            action = 'all'
        } = config

        // Validate required fields
        if (!accessToken) {
            throw new Error('accessToken is required')
        }

        // Store configuration
        this.config = {
            accessToken,
            userId,
            service,
            environment,
            timeout,
            conversations,
            beauty,
            specific,
            action
        }
    }

    /**
     * Send message to Zalo
     * @param {Object} data - Data to send
     * @param {Object} options - Send options (can override defaults)
     * @returns {Promise<Object>} Zalo API response
     */
    async sendMessage(data, options = {}) {
        return sendMessage.call(this, data, options)
    }

    /**
     * Send error alert
     * @param {Object} data - Error data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Zalo API response
     */
    async error(data, options = {}) {
        return error.call(this, data, options)
    }

    /**
     * Send info alert
     * @param {Object} data - Info data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Zalo API response
     */
    async info(data, options = {}) {
        return info.call(this, data, options)
    }

    /**
     * Send warning alert
     * @param {Object} data - Warning data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Zalo API response
     */
    async warn(data, options = {}) {
        return warn.call(this, data, options)
    }

    /**
     * Send success alert
     * @param {Object} data - Success data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Zalo API response
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

module.exports = ZaloAlert
