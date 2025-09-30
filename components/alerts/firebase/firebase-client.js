const firebaseAlert = require('./alert')

/**
 * Firebase Cloud Messaging Alert Client
 *
 * Usage:
 * const FirebaseAlert = require('./components/alerts/firebase')
 * const firebase = new FirebaseAlert({
 *     serverKey: 'your-firebase-server-key',
 *     registrationToken: 'device-registration-token',
 *     environment: 'PRODUCTION',
 *     service: 'hotel',
 *     beauty: true
 * })
 *
 * firebase.error({ message: 'Something went wrong!' })
 * firebase.info({ message: 'Information message' })
 * firebase.warn({ message: 'Warning message' })
 * firebase.success({ message: 'Success message' })
 */
class FirebaseAlert {
    constructor(config = {}) {
        this.config = {
            beauty: true,
            environment: 'STAGING',
            service: 'hotel',
            timeout: 10000,
            ...config
        }

        // Validate required config
        if (!this.config.serverKey) {
            throw new Error('FirebaseAlert: serverKey is required')
        }
        if (!this.config.registrationToken) {
            throw new Error('FirebaseAlert: registrationToken is required')
        }
    }

    /**
     * Send error alert
     * @param {Object|string} data - Error data or message
     */
    async error(data) {
        const payload = typeof data === 'string' ? { message: data } : data

        return firebaseAlert.error(this.config, payload)
    }

    /**
     * Send info alert
     * @param {Object|string} data - Info data or message
     */
    async info(data) {
        const payload = typeof data === 'string' ? { message: data } : data

        return firebaseAlert.info(this.config, payload)
    }

    /**
     * Send warning alert
     * @param {Object|string} data - Warning data or message
     */
    async warn(data) {
        const payload = typeof data === 'string' ? { message: data } : data

        return firebaseAlert.warn(this.config, payload)
    }

    /**
     * Send success alert
     * @param {Object|string} data - Success data or message
     */
    async success(data) {
        const payload = typeof data === 'string' ? { message: data } : data

        return firebaseAlert.success(this.config, payload)
    }

    /**
     * Test connection to Firebase
     */
    async testConnection() {
        try {
            await this.info({
                message: 'Firebase Alert connection test successful',
                timestamp: new Date().toISOString()
            })

            return {
                success: true,
                message: 'Firebase connection test passed'
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
     * Get current configuration (without sensitive data)
     */
    getConfig() {
        const { serverKey, ...safeConfig } = this.config

        return safeConfig
    }
}

module.exports = FirebaseAlert
