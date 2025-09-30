const wechatAlert = require('./alert')

/**
 * WeChat Work Alert Client
 *
 * Usage:
 * const WeChatAlert = require('./components/alerts/wechat')
 * const wechat = new WeChatAlert({
 *     webhookUrl: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=your-webhook-key',
 *     environment: 'PRODUCTION',
 *     service: 'hotel',
 *     beauty: true
 * })
 *
 * wechat.error({ message: 'Something went wrong!' })
 * wechat.info({ message: 'Information message' })
 * wechat.warn({ message: 'Warning message' })
 * wechat.success({ message: 'Success message' })
 */
class WeChatAlert {
    constructor(config = {}) {
        this.config = {
            beauty: true,
            environment: 'STAGING',
            service: 'hotel',
            timeout: 10000,
            ...config
        }

        // Validate required config
        if (!this.config.webhookUrl) {
            throw new Error('WeChatAlert: webhookUrl is required')
        }
    }

    /**
     * Send error alert
     * @param {Object|string} data - Error data or message
     */
    async error(data) {
        const payload = typeof data === 'string' ? { message: data } : data

        return wechatAlert.error(this.config, payload)
    }

    /**
     * Send info alert
     * @param {Object|string} data - Info data or message
     */
    async info(data) {
        const payload = typeof data === 'string' ? { message: data } : data

        return wechatAlert.info(this.config, payload)
    }

    /**
     * Send warning alert
     * @param {Object|string} data - Warning data or message
     */
    async warn(data) {
        const payload = typeof data === 'string' ? { message: data } : data

        return wechatAlert.warn(this.config, payload)
    }

    /**
     * Send success alert
     * @param {Object|string} data - Success data or message
     */
    async success(data) {
        const payload = typeof data === 'string' ? { message: data } : data

        return wechatAlert.success(this.config, payload)
    }

    /**
     * Test connection to WeChat Work
     */
    async testConnection() {
        try {
            await this.info({
                message: 'WeChat Work Alert connection test successful',
                timestamp: new Date().toISOString()
            })

            return {
                success: true,
                message: 'WeChat Work connection test passed'
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

module.exports = WeChatAlert
