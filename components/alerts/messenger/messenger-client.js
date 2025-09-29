/**
 * Messenger (Facebook) alert client class with pre-configured settings
 *
 * INITIALIZATION REQUIREMENTS:
 * - pageAccessToken (string, required): Facebook Page Access Token
 * - recipientId (string, required): Recipient PSID (Page Scoped ID)
 * - environment (string, optional): Default environment ('DEV', 'STAGING', 'PROD')
 * - beautyMessage (boolean, optional): Enable rich formatting (default: true)
 * - timeout (number, optional): Request timeout in milliseconds
 *
 * @example
 * const messengerAlert = new MessengerAlert({
 *     pageAccessToken: 'EAAxxxxxxxxxxxxxx',
 *     recipientId: '1234567890123456',
 *     environment: 'PROD',
 *     beautyMessage: true
 * })
 */

const { sendMessage, error, info, warn, success } = require('./alert')

class MessengerAlert {
    /**
     * Create Messenger alert client instance
     * @param {Object} config - Messenger configuration
     * @param {string} config.pageAccessToken - Facebook Page Access Token (REQUIRED)
     * @param {string} config.recipientId - Recipient PSID (REQUIRED)
     * @param {string} config.environment - Default environment (DEV, STAGING, PROD)
     * @param {boolean} config.beauty - Enable rich formatting (default: true)
     * @param {Array} config.specific - Specific field configurations (optional)
     * @param {number} config.timeout - Default timeout (optional)
     */
    constructor(config) {
        if (!config) {
            throw new Error('Configuration is required')
        }

        const {
            pageAccessToken,
            recipientId,
            environment = 'STAGING',
            beauty = true,
            specific = [],
            timeout = 5000
        } = config

        if (!pageAccessToken) {
            throw new Error('Messenger pageAccessToken is required')
        }

        if (!recipientId) {
            throw new Error('Messenger recipientId is required')
        }

        this.config = {
            pageAccessToken,
            recipientId,
            environment,
            beauty,
            specific,
            timeout
        }
    }

    /**
     * Send message to Messenger
     * @param {Object} data - Data to send
     * @param {Object} options - Send options (can override defaults)
     * @returns {Promise<Object>} Messenger sending result
     */
    async sendMessage(data, options = {}) {
        return sendMessage.call(this, data, options)
    }

    /**
     * Send error alert
     * @param {Object} data - Error data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Messenger sending result
     */
    async error(data, options = {}) {
        return error.call(this, data, options)
    }

    /**
     * Send info alert
     * @param {Object} data - Info data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Messenger sending result
     */
    async info(data, options = {}) {
        return info.call(this, data, options)
    }

    /**
     * Send warning alert
     * @param {Object} data - Warning data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Messenger sending result
     */
    async warn(data, options = {}) {
        return warn.call(this, data, options)
    }

    /**
     * Send success alert
     * @param {Object} data - Success data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Messenger sending result
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
     * Get current configuration (without sensitive data)
     * @returns {Object} Current config
     */
    getConfig() {
        const { pageAccessToken, ...safeConfig } = this.config

        return {
            ...safeConfig,
            pageAccessToken: pageAccessToken ? '[HIDDEN]' : null
        }
    }
}

module.exports = MessengerAlert
