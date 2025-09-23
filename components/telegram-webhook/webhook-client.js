const {
    setWebhook,
    deleteWebhook,
    getWebhookInfo,
    verifyWebhookRequest,
    parseWebhookUpdate
} = require('./webhook')

/**
 * Create Telegram webhook client with pre-configured settings
 * @param {Object} config - Webhook configuration
 * @param {string} config.botToken - Telegram bot token
 * @param {string} config.webhookUrl - Default webhook URL
 * @param {string} config.secretToken - Secret token for webhook verification (optional)
 * @param {Array<string>} config.allowedUpdates - Default allowed update types (optional)
 * @param {number} config.maxConnections - Default max connections (optional)
 * @param {number} config.timeout - Default timeout (optional)
 * @returns {Object} Telegram webhook client with simplified methods
 */
function createTelegramWebhookClient(config) {
    const {
        botToken,
        webhookUrl,
        secretToken,
        allowedUpdates,
        maxConnections,
        timeout = 10000
    } = config

    if (!botToken) {
        throw new Error('botToken is required in config')
    }

    return {
        // Simplified setWebhook - auto-filled with config
        async setWebhook(options = {}) {
            return setWebhook({
                botToken,
                url: options.url || webhookUrl,
                secretToken: options.secretToken || secretToken,
                allowedUpdates: options.allowedUpdates || allowedUpdates,
                dropPendingUpdates: options.dropPendingUpdates,
                maxConnections: options.maxConnections || maxConnections,
                timeout: options.timeout || timeout
            })
        },

        // Simplified deleteWebhook
        async deleteWebhook(options = {}) {
            return deleteWebhook({
                botToken,
                dropPendingUpdates: options.dropPendingUpdates,
                timeout: options.timeout || timeout
            })
        },

        // Simplified getWebhookInfo
        async getWebhookInfo(options = {}) {
            return getWebhookInfo({
                botToken,
                timeout: options.timeout || timeout
            })
        },

        // Verify webhook request using configured secret token
        verifyRequest(xTelegramBotApiSecretToken) {
            return verifyWebhookRequest({
                secretToken,
                xTelegramBotApiSecretToken
            })
        },

        // Parse webhook update
        parseUpdate: parseWebhookUpdate,

        // Access to original methods if needed
        raw: {
            setWebhook,
            deleteWebhook,
            getWebhookInfo,
            verifyWebhookRequest,
            parseWebhookUpdate
        },

        // Config getters
        getConfig() {
            return {
                botToken,
                webhookUrl,
                secretToken,
                allowedUpdates,
                maxConnections,
                timeout
            }
        }
    }
}

module.exports = {
    createTelegramWebhookClient
}
