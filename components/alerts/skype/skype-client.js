const skypeAlert = require('./alert')

/**
 * Skype Alert Client
 *
 * Usage:
 * const SkypeAlert = require('./components/alerts/skype')
 * const skype = new SkypeAlert({
 *     botId: 'your-bot-app-id',
 *     botPassword: 'your-bot-password',
 *     conversationId: 'conversation-id',
 *     environment: 'PRODUCTION',
 *     service: 'hotel',
 *     beauty: true
 * })
 *
 * skype.error({ message: 'Something went wrong!' })
 * skype.info({ message: 'Information message' })
 * skype.warn({ message: 'Warning message' })
 * skype.success({ message: 'Success message' })
 */
class SkypeAlert {
    constructor(config = {}) {
        this.config = {
            beauty: true,
            environment: 'STAGING',
            service: 'hotel',
            timeout: 10000,
            ...config
        }

        // Validate required config
        if (!this.config.botId) {
            throw new Error('SkypeAlert: botId is required')
        }
        if (!this.config.botPassword) {
            throw new Error('SkypeAlert: botPassword is required')
        }
        if (!this.config.conversationId) {
            throw new Error('SkypeAlert: conversationId is required')
        }
    }

    /**
     * Send error alert
     * @param {Object|string} data - Error data or message
     */
    async error(data) {
        const payload = typeof data === 'string' ? { message: data } : data

        return skypeAlert.error(this.config, payload)
    }

    /**
     * Send info alert
     * @param {Object|string} data - Info data or message
     */
    async info(data) {
        const payload = typeof data === 'string' ? { message: data } : data

        return skypeAlert.info(this.config, payload)
    }

    /**
     * Send warning alert
     * @param {Object|string} data - Warning data or message
     */
    async warn(data) {
        const payload = typeof data === 'string' ? { message: data } : data

        return skypeAlert.warn(this.config, payload)
    }

    /**
     * Send success alert
     * @param {Object|string} data - Success data or message
     */
    async success(data) {
        const payload = typeof data === 'string' ? { message: data } : data

        return skypeAlert.success(this.config, payload)
    }

    /**
     * Test connection to Skype
     */
    async testConnection() {
        try {
            await this.info({
                message: 'Skype Alert connection test successful',
                timestamp: new Date().toISOString()
            })

            return { success: true, message: 'Skype connection test passed' }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    /**
     * Update configuration
     * @param {Object} newConfig - New configuration options
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig }
    }

    /**
     * Get current configuration (without sensitive data)
     */
    getConfig() {
        const { botPassword, ...safeConfig } = this.config

        return safeConfig
    }
}

module.exports = SkypeAlert
