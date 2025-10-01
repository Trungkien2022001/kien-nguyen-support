/* eslint-disable no-return-await */
const { sendMessage, error, info, warn, success } = require('./alert')

/**
 * WhatsApp Business Alert Class
 *
 * Setup Requirements:
 * 1. Create Meta Business Account
 * 2. Set up WhatsApp Business API
 * 3. Get Phone Number ID and Access Token
 * 4. Verify recipient phone numbers
 *
 * @class WhatsAppAlert
 */
class WhatsAppAlert {
    /**
     * Create WhatsApp alert client instance
     * @param {Object} config - WhatsApp configuration
     * @param {string} config.phoneNumberId - WhatsApp Business phone number ID (REQUIRED)
     * @param {string} config.accessToken - WhatsApp Business access token (REQUIRED)
     * @param {string} config.recipientPhone - Recipient phone number in international format (REQUIRED)
     * @param {string} config.service - Service type (hotel, flight, tour, transfer)
     * @param {string} config.environment - Environment (DEV, STAGING, PRODUCTION)
     * @param {boolean} config.beauty - Enable rich formatting (default: true)
     * @param {number} config.timeout - Request timeout in ms (default: 10000)
     */
    constructor(config) {
        const {
            phoneNumberId,
            accessToken,
            recipientPhone,
            service = 'hotel',
            environment = 'STAGING',
            beauty = true,
            timeout = 10000
        } = config

        if (!phoneNumberId) {
            throw new Error('WhatsAppAlert requires phoneNumberId')
        }
        if (!accessToken) {
            throw new Error('WhatsAppAlert requires accessToken')
        }
        if (!recipientPhone) {
            throw new Error('WhatsAppAlert requires recipientPhone')
        }

        // Validate phone number format
        if (!recipientPhone.match(/^\+\d{10,15}$/)) {
            throw new Error(
                'recipientPhone must be in international format (+1234567890)'
            )
        }

        this.config = {
            phoneNumberId,
            accessToken,
            recipientPhone,
            service,
            environment,
            beauty,
            timeout
        }
    }

    /**
     * Send error alert to WhatsApp
     * @param {Object} data - Alert data object
     */
    async error(data) {
        return await error(this.config, data)
    }

    /**
     * Send info alert to WhatsApp
     * @param {Object} data - Alert data object
     */
    async info(data) {
        return await info(this.config, data)
    }

    /**
     * Send warning alert to WhatsApp
     * @param {Object} data - Alert data object
     */
    async warn(data) {
        return await warn(this.config, data)
    }

    /**
     * Send success alert to WhatsApp
     * @param {Object} data - Alert data object
     */
    async success(data) {
        return await success(this.config, data)
    }

    /**
     * Send custom message to WhatsApp
     * @param {string} message - Message text
     */
    async sendMessage(message) {
        return await sendMessage(this.config, message)
    }

    /**
     * Get current configuration
     */
    getConfig() {
        return { ...this.config }
    }
}

module.exports = WhatsAppAlert
