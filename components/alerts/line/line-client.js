const { sendMessage, error, info, warn, success } = require('./alert')

/**
 * Line Notify Alert Class
 *
 * Setup Requirements:
 * 1. Go to https://notify-bot.line.me/
 * 2. Login with Line account
 * 3. Generate access token for your group/room
 * 4. Copy the access token
 *
 * @class LineAlert
 */
class LineAlert {
    /**
     * Create Line alert client instance
     * @param {Object} config - Line configuration
     * @param {string} config.accessToken - Line Notify access token (REQUIRED)
     * @param {string} config.service - Service type (hotel, flight, tour, transfer)
     * @param {string} config.environment - Environment (DEV, STAGING, PRODUCTION)
     * @param {boolean} config.beauty - Enable rich formatting (default: true)
     * @param {number} config.timeout - Request timeout in ms (default: 10000)
     */
    constructor(config) {
        const {
            accessToken,
            service = 'hotel',
            environment = 'STAGING',
            beauty = true,
            timeout = 10000
        } = config

        if (!accessToken) {
            throw new Error('LineAlert requires accessToken')
        }

        this.config = {
            accessToken,
            service,
            environment,
            beauty,
            timeout
        }
    }

    /**
     * Send error alert to Line
     * @param {Object} data - Alert data object
     */
    async error(data) {
        return error(this.config, data)
    }

    /**
     * Send info alert to Line
     * @param {Object} data - Alert data object
     */
    async info(data) {
        return info(this.config, data)
    }

    /**
     * Send warning alert to Line
     * @param {Object} data - Alert data object
     */
    async warn(data) {
        return warn(this.config, data)
    }

    /**
     * Send success alert to Line
     * @param {Object} data - Alert data object
     */
    async success(data) {
        return success(this.config, data)
    }

    /**
     * Send custom message to Line
     * @param {string} message - Message text
     * @param {Object} options - Additional options (imageUrl, etc.)
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

module.exports = LineAlert
