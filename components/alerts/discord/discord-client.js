/**
 * Discord alert client class with pre-configured settings
 *
 * INITIALIZATION REQUIREMENTS:
 * - webhookUrl (string, required): Discord webhook URL
 * - environment (string, optional): Default environment ('DEV', 'STAGING', 'PROD')
 * - beautyMessage (boolean, optional): Enable rich formatting (default: true)
 * - timeout (number, optional): Request timeout in milliseconds
 *
 * @example
 * const discordAlert = new DiscordAlert({
 *     webhookUrl: 'https://discord.com/api/webhooks/...',
 *     environment: 'PROD',
 *     beautyMessage: true
 * })
 */

const { sendMessage, error, info, warn, success } = require('./alert')

class DiscordAlert {
    /**
     * Create Discord alert client instance
     * @param {Object} config - Discord configuration
     * @param {string} config.webhookUrl - Discord webhook URL (REQUIRED)
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
            webhookUrl,
            environment = 'STAGING',
            beauty = true,
            specific = [],
            timeout = 5000
        } = config

        if (!webhookUrl) {
            throw new Error('Discord webhookUrl is required')
        }

        this.config = {
            webhookUrl,
            environment,
            beauty,
            specific,
            timeout
        }
    }

    /**
     * Send message to Discord
     * @param {Object} data - Data to send
     * @param {Object} options - Send options (can override defaults)
     * @returns {Promise<Object>} Discord sending result
     */
    async sendMessage(data, options = {}) {
        return sendMessage.call(this, data, options)
    }

    /**
     * Send error alert
     * @param {Object} data - Error data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Discord sending result
     */
    async error(data, options = {}) {
        return error.call(this, data, options)
    }

    /**
     * Send info alert
     * @param {Object} data - Info data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Discord sending result
     */
    async info(data, options = {}) {
        return info.call(this, data, options)
    }

    /**
     * Send warning alert
     * @param {Object} data - Warning data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Discord sending result
     */
    async warn(data, options = {}) {
        return warn.call(this, data, options)
    }

    /**
     * Send success alert
     * @param {Object} data - Success data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Discord sending result
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
     * @returns {Object} Current config
     */
    getConfig() {
        return { ...this.config }
    }
}

module.exports = DiscordAlert
