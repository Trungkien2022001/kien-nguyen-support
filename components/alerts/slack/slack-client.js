/**
 * Slack alert client class with pre-configured settings
 *
 * INITIALIZATION REQUIREMENTS:
 * - webhookUrl (string, required): Slack webhook URL
 * - channel (string, optional): Slack channel name (if not in webhook)
 * - environment (string, optional): Default environment ('DEV', 'STAGING', 'PROD')
 * - beautyMessage (boolean, optional): Enable rich formatting (default: true)
 * - timeout (number, optional): Request timeout in milliseconds
 *
 * @example
 * const slackAlert = new SlackAlert({
 *     webhookUrl: 'https://hooks.slack.com/services/...',
 *     channel: '#alerts',
 *     environment: 'PROD',
 *     beautyMessage: true
 * })
 */

const { sendMessage, error, info, warn, success } = require('./alert')

class SlackAlert {
    /**
     * Create Slack alert client instance
     * @param {Object} config - Slack configuration
     * @param {string} config.webhookUrl - Slack webhook URL (REQUIRED)
     * @param {string} config.channel - Slack channel (optional)
     * @param {string} config.service - Service type (hotel, flight, tour, transfer)
     * @param {string} config.environment - Default environment (DEV, STAGING, PROD)
     * @param {boolean} config.beauty - Enable rich formatting (default: true)
     * @param {number} config.timeout - Default timeout (optional)
     * @param {Object} config.channels - Nested channels configuration
     * @param {Array} config.specific - Specific field configurations
     * @param {string} config.action - Action type for channel routing
     */
    constructor(config) {
        const {
            webhookUrl,
            channel,
            service = 'hotel',
            environment = 'STAGING',
            beauty = true,
            timeout = 5000,
            channels = {},
            specific = [],
            action = 'all'
        } = config

        if (!webhookUrl) {
            throw new Error('SlackAlert requires webhookUrl')
        }

        this.config = {
            webhookUrl,
            channel,
            service,
            environment,
            beauty,
            timeout,
            channels,
            specific,
            action
        }

        // Bind methods to maintain context
        this.sendMessage = sendMessage.bind(this)
        this.error = error.bind(this)
        this.info = info.bind(this)
        this.warn = warn.bind(this)
        this.success = success.bind(this)
    }

    /**
     * Get current configuration
     * @returns {Object} Current config
     */
    getConfig() {
        return { ...this.config }
    }
}

module.exports = SlackAlert
