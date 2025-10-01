const { sendMessage, error, info, warn, success } = require('./alert')

/**
 * TelegramAlert class for sending alerts to Telegram
 */
class TelegramAlert {
    /**
     * Constructor for TelegramAlert
     * @param {Object} config - Configuration object
     * @param {string} config.botToken - Telegram bot token
     * @param {string} config.chatId - Chat ID to send messages to
     * @param {string} config.service - Service type (hotel, flight, tour, transfer)
     * @param {string} config.environment - Environment (PRODUCTION, STAGING, DEV)
     * @param {boolean} config.disableNotification - Disable notification (optional, default: false)
     * @param {number} config.timeout - Request timeout in ms (optional, default: 10000)
     * @param {Object} config.messageThreadIds - Nested thread IDs configuration
     * @param {boolean} config.beauty - Enable markdown formatting (optional, default: true)
     * @param {Array} config.specific - Specific field configurations (optional)
     * @param {string} config.action - Action type for thread routing (optional, default: 'all')
     */
    constructor(config) {
        if (!config) {
            throw new Error('Configuration is required')
        }

        const {
            botToken,
            chatId,
            service = 'hotel',
            environment = 'STAGING',
            disableNotification = false,
            timeout = 10000,
            messageThreadIds = {},
            beauty = true,
            specific = [],
            action = 'all'
        } = config

        // Validate required fields
        if (!botToken) {
            throw new Error('botToken is required')
        }
        if (!chatId) {
            throw new Error('chatId is required')
        }

        // Store configuration
        this.config = {
            botToken,
            chatId,
            service,
            environment,
            disableNotification,
            timeout,
            messageThreadIds,
            beauty,
            specific,
            action
        }
    }

    /**
     * Send message to Telegram
     * @param {Object} data - Data to send
     * @param {Object} options - Send options (can override defaults)
     * @returns {Promise<Object>} Telegram API response
     */
    async sendMessage(data, options = {}) {
        return sendMessage.call(this, data, options)
    }

    /**
     * Send error alert
     * @param {Object} data - Error data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Telegram API response
     */
    async error(data, options = {}) {
        return error.call(this, data, options)
    }

    /**
     * Send info alert
     * @param {Object} data - Info data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Telegram API response
     */
    async info(data, options = {}) {
        return info.call(this, data, options)
    }

    /**
     * Send warning alert
     * @param {Object} data - Warning data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Telegram API response
     */
    async warn(data, options = {}) {
        return warn.call(this, data, options)
    }

    /**
     * Send success alert
     * @param {Object} data - Success data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Telegram API response
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

module.exports = TelegramAlert
