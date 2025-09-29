const { sendMessage, error, info, warn, success } = require('./alert')

/**
 * EmailAlert class for sending alerts via Email
 */
class EmailAlert {
    /**
     * Constructor for EmailAlert
     * @param {Object} config - Configuration object
     * @param {string} config.host - SMTP host (required if not using smtpUrl)
     * @param {number} config.port - SMTP port (optional, default: 587)
     * @param {boolean} config.secure - Use TLS (optional, default: false)
     * @param {string} config.user - SMTP username (required if not using smtpUrl)
     * @param {string} config.password - SMTP password (required if not using smtpUrl)
     * @param {string} config.smtpUrl - Complete SMTP URL (alternative to individual config)
     * @param {string} config.from - From email address (required)
     * @param {string} config.to - To email address (required)
     * @param {string} config.service - Service type (hotel, flight, tour, transfer)
     * @param {string} config.environment - Environment (PRODUCTION, STAGING, DEV)
     * @param {number} config.timeout - Request timeout in ms (optional, default: 30000)
     * @param {boolean} config.beauty - Enable HTML formatting (optional, default: true)
     * @param {Array} config.specific - Specific field configurations (optional)
     */
    constructor(config) {
        if (!config) {
            throw new Error('Configuration is required')
        }

        const {
            host,
            port = 587,
            secure = false,
            user,
            password,
            smtpUrl,
            from,
            to,
            service = 'hotel',
            environment = 'STAGING',
            timeout = 30000,
            beauty = true,
            specific = []
        } = config

        // Validate required fields
        if (!smtpUrl && (!host || !user || !password)) {
            throw new Error(
                'Either smtpUrl or (host, user, password) is required'
            )
        }
        if (!from) {
            throw new Error('from email address is required')
        }
        if (!to) {
            throw new Error('to email address is required')
        }

        // Store configuration
        this.config = {
            host,
            port,
            secure,
            user,
            password,
            smtpUrl,
            from,
            to,
            service,
            environment,
            timeout,
            beauty,
            specific
        }
    }

    /**
     * Send message to Email
     * @param {Object} data - Data to send
     * @param {Object} options - Send options (can override defaults)
     * @returns {Promise<Object>} Email sending result
     */
    async sendMessage(data, options = {}) {
        return sendMessage.call(this, data, options)
    }

    /**
     * Send error alert
     * @param {Object} data - Error data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Email sending result
     */
    async error(data, options = {}) {
        return error.call(this, data, options)
    }

    /**
     * Send info alert
     * @param {Object} data - Info data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Email sending result
     */
    async info(data, options = {}) {
        return info.call(this, data, options)
    }

    /**
     * Send warning alert
     * @param {Object} data - Warning data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Email sending result
     */
    async warn(data, options = {}) {
        return warn.call(this, data, options)
    }

    /**
     * Send success alert
     * @param {Object} data - Success data
     * @param {Object} options - Send options
     * @returns {Promise<Object>} Email sending result
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

module.exports = EmailAlert
