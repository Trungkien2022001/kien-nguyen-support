const { httpClient } = require('../../utils')
const { TELEGRAM } = require('../../constants')

/**
 * Register a webhook for Telegram bot
 * @param {Object} options - Webhook registration options
 * @param {string} options.botToken - Telegram bot token
 * @param {string} options.url - Webhook URL
 * @param {string} options.secretToken - Secret token for webhook verification (optional)
 * @param {Array<string>} options.allowedUpdates - List of update types to receive (optional)
 * @param {boolean} options.dropPendingUpdates - Whether to drop pending updates (optional)
 * @param {number} options.maxConnections - Maximum connections for webhook (optional, 1-100)
 * @param {number} options.timeout - Request timeout in ms (optional, default: 10000)
 * @returns {Promise<Object>} Telegram API response
 */
async function setWebhook({
    botToken,
    url,
    secretToken,
    allowedUpdates,
    dropPendingUpdates,
    maxConnections,
    timeout = 10000
}) {
    if (!botToken || !url) {
        throw new Error('botToken and url are required')
    }

    const apiUrl = `${TELEGRAM.API_BASE_URL}${botToken}/setWebhook`

    const payload = {
        url,
        max_connections: maxConnections || 40,
        allowed_updates: allowedUpdates || ['message', 'callback_query'],
        secret_token: secretToken,
        ...(dropPendingUpdates !== undefined && {
            drop_pending_updates: dropPendingUpdates
        })
    }

    try {
        const response = await httpClient.post(apiUrl, payload, {
            timeout
        })

        return response.data
    } catch (error) {
        throw new Error(
            `Failed to set Telegram webhook: ${(error.response &&
                error.response.data &&
                error.response.data.description) ||
                error.message}`
        )
    }
}

/**
 * Remove webhook for Telegram bot
 * @param {Object} options - Webhook removal options
 * @param {string} options.botToken - Telegram bot token
 * @param {boolean} options.dropPendingUpdates - Whether to drop pending updates (optional)
 * @param {number} options.timeout - Request timeout in ms (optional, default: 10000)
 * @returns {Promise<Object>} Telegram API response
 */
async function deleteWebhook({
    botToken,
    dropPendingUpdates,
    timeout = 10000
}) {
    if (!botToken) {
        throw new Error('botToken is required')
    }

    const apiUrl = `${TELEGRAM.API_BASE_URL}${botToken}/deleteWebhook`

    const payload = {
        ...(dropPendingUpdates !== undefined && {
            drop_pending_updates: dropPendingUpdates
        })
    }

    try {
        const response = await httpClient.post(apiUrl, payload, {
            timeout,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return response.data
    } catch (error) {
        throw new Error(
            `Failed to delete Telegram webhook: ${(error.response &&
                error.response.data &&
                error.response.data.description) ||
                error.message}`
        )
    }
}

/**
 * Get current webhook info for Telegram bot
 * @param {Object} options - Webhook info options
 * @param {string} options.botToken - Telegram bot token
 * @param {number} options.timeout - Request timeout in ms (optional, default: 10000)
 * @returns {Promise<Object>} Telegram API response with webhook info
 */
async function getWebhookInfo({ botToken, timeout = 10000 }) {
    if (!botToken) {
        throw new Error('botToken is required')
    }

    const apiUrl = `${TELEGRAM.API_BASE_URL}${botToken}/getWebhookInfo`

    try {
        const response = await httpClient.get(apiUrl, {
            timeout,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return response.data
    } catch (error) {
        throw new Error(
            `Failed to get Telegram webhook info: ${(error.response &&
                error.response.data &&
                error.response.data.description) ||
                error.message}`
        )
    }
}

/**
 * Verify webhook request authenticity
 * @param {Object} options - Verification options
 * @param {string} options.secretToken - Secret token used in webhook registration
 * @param {string} options.xTelegramBotApiSecretToken - Header value from request
 * @returns {boolean} Whether the request is authentic
 */
function verifyWebhookRequest({ secretToken, xTelegramBotApiSecretToken }) {
    if (!secretToken) {
        return true // If no secret token configured, skip verification
    }

    return secretToken === xTelegramBotApiSecretToken
}

/**
 * Parse webhook update and extract useful information
 * @param {Object} update - Telegram update object from webhook
 * @returns {Object} Parsed update information
 */
function parseWebhookUpdate(update) {
    const result = {
        updateId: update.update_id,
        type: null,
        data: null,
        chat: null,
        user: null,
        date: null
    }

    // Determine update type and extract relevant data
    if (update.message) {
        result.type = 'message'
        result.data = update.message
        result.chat = update.message.chat
        result.user = update.message.from
        result.date = new Date(update.message.date * 1000)
    } else if (update.edited_message) {
        result.type = 'edited_message'
        result.data = update.edited_message
        result.chat = update.edited_message.chat
        result.user = update.edited_message.from
        result.date = new Date(update.edited_message.edit_date * 1000)
    } else if (update.channel_post) {
        result.type = 'channel_post'
        result.data = update.channel_post
        result.chat = update.channel_post.chat
        result.date = new Date(update.channel_post.date * 1000)
    } else if (update.edited_channel_post) {
        result.type = 'edited_channel_post'
        result.data = update.edited_channel_post
        result.chat = update.edited_channel_post.chat
        result.date = new Date(update.edited_channel_post.edit_date * 1000)
    } else if (update.callback_query) {
        result.type = 'callback_query'
        result.data = update.callback_query
        result.user = update.callback_query.from
        if (update.callback_query.message) {
            result.chat = update.callback_query.message.chat
            result.date = new Date(update.callback_query.message.date * 1000)
        }
    } else if (update.inline_query) {
        result.type = 'inline_query'
        result.data = update.inline_query
        result.user = update.inline_query.from
    } else if (update.chosen_inline_result) {
        result.type = 'chosen_inline_result'
        result.data = update.chosen_inline_result
        result.user = update.chosen_inline_result.from
    }

    return result
}

module.exports = {
    setWebhook,
    deleteWebhook,
    getWebhookInfo,
    verifyWebhookRequest,
    parseWebhookUpdate
}
