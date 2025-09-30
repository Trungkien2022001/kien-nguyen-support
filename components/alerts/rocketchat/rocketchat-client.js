const rocketchatAlert = require('./alert')

/**
 * Rocket.Chat Alert Client
 *
 * Usage:
 * const RocketChatAlert = require('./components/alerts/rocketchat')
 * const rocketchat = new RocketChatAlert({
 *     webhookUrl: 'https://your-server.rocket.chat/hooks/webhook-id/token',
 *     username: 'AlertBot',
 *     channel: '#alerts',
 *     environment: 'PRODUCTION',
 *     service: 'hotel',
 *     beauty: true
 * })
 *
 * rocketchat.error({ message: 'Something went wrong!' })
 * rocketchat.info({ message: 'Information message' })
 * rocketchat.warn({ message: 'Warning message' })
 * rocketchat.success({ message: 'Success message' })
 */
class RocketChatAlert {
    constructor(config = {}) {
        this.config = {
            beauty: true,
            environment: 'STAGING',
            service: 'hotel',
            username: 'AlertBot',
            timeout: 10000,
            ...config
        }

        // Validate required config
        if (!this.config.webhookUrl) {
            throw new Error('RocketChatAlert: webhookUrl is required')
        }
    }

    /**
     * Send error alert
     * @param {Object|string} data - Error data or message
     */
    async error(data) {
        const payload = typeof data === 'string' ? { message: data } : data

        return rocketchatAlert.error(this.config, payload)
    }

    /**
     * Send info alert
     * @param {Object|string} data - Info data or message
     */
    async info(data) {
        const payload = typeof data === 'string' ? { message: data } : data

        return rocketchatAlert.info(this.config, payload)
    }

    /**
     * Send warning alert
     * @param {Object|string} data - Warning data or message
     */
    async warn(data) {
        const payload = typeof data === 'string' ? { message: data } : data

        return rocketchatAlert.warn(this.config, payload)
    }

    /**
     * Send success alert
     * @param {Object|string} data - Success data or message
     */
    async success(data) {
        const payload = typeof data === 'string' ? { message: data } : data

        return rocketchatAlert.success(this.config, payload)
    }

    /**
     * Test connection to Rocket.Chat
     */
    async testConnection() {
        try {
            await this.info({
                message: 'Rocket.Chat Alert connection test successful',
                timestamp: new Date().toISOString()
            })

            return {
                success: true,
                message: 'Rocket.Chat connection test passed'
            }
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
     * Get current configuration
     */
    getConfig() {
        return { ...this.config }
    }
}

module.exports = RocketChatAlert
