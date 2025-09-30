const { sendMessage, error, info, warn, success } = require('./alert')

/**
 * Viber Bot Alert Class
 *
 * Setup Requirements:
 * 1. Create Viber Bot Account at https://partners.viber.com/
 * 2. Get bot authentication token
 * 3. Set webhook URL for bot
 * 4. Get user IDs from incoming messages
 *
 * @class ViberAlert
 */
class ViberAlert {
    /**
     * Create Viber alert client instance
     * @param {Object} config - Viber configuration
     * @param {string} config.botToken - Viber bot authentication token (REQUIRED)
     * @param {string} config.receiverId - Viber user ID to send messages to (REQUIRED)
     * @param {string} config.botName - Bot display name (optional)
     * @param {string} config.botAvatar - Bot avatar URL (optional)
     * @param {string} config.service - Service type (hotel, flight, tour, transfer)
     * @param {string} config.environment - Environment (DEV, STAGING, PRODUCTION)
     * @param {boolean} config.beauty - Enable rich formatting (default: true)
     * @param {number} config.timeout - Request timeout in ms (default: 10000)
     */
    constructor(config) {
        const {
            botToken,
            receiverId,
            botName = 'Alert Bot',
            botAvatar = '',
            service = 'hotel',
            environment = 'STAGING',
            beauty = true,
            timeout = 10000
        } = config

        if (!botToken) {
            throw new Error('ViberAlert requires botToken')
        }
        if (!receiverId) {
            throw new Error('ViberAlert requires receiverId')
        }

        this.config = {
            botToken,
            receiverId,
            botName,
            botAvatar,
            service,
            environment,
            beauty,
            timeout
        }
    }

    /**
     * Send error alert to Viber
     * @param {Object} data - Alert data object
     */
    async error(data) {
        return error(this.config, data)
    }

    /**
     * Send info alert to Viber
     * @param {Object} data - Alert data object
     */
    async info(data) {
        return info(this.config, data)
    }

    /**
     * Send warning alert to Viber
     * @param {Object} data - Alert data object
     */
    async warn(data) {
        return warn(this.config, data)
    }

    /**
     * Send success alert to Viber
     * @param {Object} data - Alert data object
     */
    async success(data) {
        return success(this.config, data)
    }

    /**
     * Send custom message to Viber
     * @param {string} message - Message text
     * @param {Object} options - Additional options
     */
    async sendMessage(message, options = {}) {
        return sendMessage(this.config, message, options)
    }

    /**
     * Get current configuration
     */
    getConfig() {
        return { ...this.config }
    }
}

module.exports = ViberAlert
