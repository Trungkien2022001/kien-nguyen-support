const axios = require('axios')
const { TELEGRAM } = require('../../constants')

/**
 * Set up Telegram webhook
 * @param {Object} options - Webhook setup options
 * @param {string} options.botToken - Telegram bot token
 * @param {string} options.webhookUrl - Webhook URL to set
 * @param {Array<string>} options.allowedUpdates - Array of allowed update types (optional)
 * @param {number} options.maxConnections - Maximum webhook connections (optional, 1-100)
 * @param {boolean} options.dropPendingUpdates - Drop pending updates (optional)
 * @param {string} options.secretToken - Secret token for webhook validation (optional)
 * @param {number} options.timeout - Request timeout in ms (optional, default: 10000)
 * @returns {Promise<Object>} Webhook setup response
 */
async function setWebhook({
    botToken,
    webhookUrl,
    allowedUpdates,
    maxConnections,
    dropPendingUpdates,
    secretToken,
    timeout = 10000
}) {
    if (!botToken || !webhookUrl) {
        throw new Error('botToken and webhookUrl are required')
    }

    const url = `${TELEGRAM.API_BASE_URL}${botToken}/setWebhook`
    
    const payload = {
        url: webhookUrl
    }

    if (allowedUpdates) {
        payload.allowed_updates = allowedUpdates
    }

    if (maxConnections) {
        payload.max_connections = maxConnections
    }

    if (dropPendingUpdates !== undefined) {
        payload.drop_pending_updates = dropPendingUpdates
    }

    if (secretToken) {
        payload.secret_token = secretToken
    }

    try {
        const response = await axios.post(url, payload, {
            timeout,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.data.ok) {
            throw new Error(`Telegram API error: ${response.data.description}`)
        }

        return {
            success: true,
            result: response.data.result,
            description: response.data.description
        }
    } catch (error) {
        throw new Error(`Failed to set webhook: ${error.message}`)
    }
}

/**
 * Delete Telegram webhook
 * @param {Object} options - Webhook deletion options
 * @param {string} options.botToken - Telegram bot token
 * @param {boolean} options.dropPendingUpdates - Drop pending updates (optional)
 * @param {number} options.timeout - Request timeout in ms (optional, default: 10000)
 * @returns {Promise<Object>} Webhook deletion response
 */
async function deleteWebhook({
    botToken,
    dropPendingUpdates,
    timeout = 10000
}) {
    if (!botToken) {
        throw new Error('botToken is required')
    }

    const url = `${TELEGRAM.API_BASE_URL}${botToken}/deleteWebhook`
    
    const payload = {}

    if (dropPendingUpdates !== undefined) {
        payload.drop_pending_updates = dropPendingUpdates
    }

    try {
        const response = await axios.post(url, payload, {
            timeout,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.data.ok) {
            throw new Error(`Telegram API error: ${response.data.description}`)
        }

        return {
            success: true,
            result: response.data.result,
            description: response.data.description
        }
    } catch (error) {
        throw new Error(`Failed to delete webhook: ${error.message}`)
    }
}

/**
 * Get webhook info
 * @param {Object} options - Get webhook info options
 * @param {string} options.botToken - Telegram bot token
 * @param {number} options.timeout - Request timeout in ms (optional, default: 10000)
 * @returns {Promise<Object>} Webhook info response
 */
async function getWebhookInfo({
    botToken,
    timeout = 10000
}) {
    if (!botToken) {
        throw new Error('botToken is required')
    }

    const url = `${TELEGRAM.API_BASE_URL}${botToken}/getWebhookInfo`

    try {
        const response = await axios.get(url, {
            timeout,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.data.ok) {
            throw new Error(`Telegram API error: ${response.data.description}`)
        }

        return {
            success: true,
            result: response.data.result
        }
    } catch (error) {
        throw new Error(`Failed to get webhook info: ${error.message}`)
    }
}

/**
 * Get bot updates using long polling
 * @param {Object} options - Get updates options
 * @param {string} options.botToken - Telegram bot token
 * @param {number} options.offset - Offset for getting updates (optional)
 * @param {number} options.limit - Limit number of updates (optional, 1-100)
 * @param {number} options.timeout - Polling timeout in seconds (optional, default: 10)
 * @param {Array<string>} options.allowedUpdates - Array of allowed update types (optional)
 * @param {number} options.requestTimeout - Request timeout in ms (optional, default: based on polling timeout)
 * @returns {Promise<Object>} Updates response
 */
async function getUpdates({
    botToken,
    offset,
    limit,
    timeout = TELEGRAM.POLLING.TIMEOUT,
    allowedUpdates,
    requestTimeout
}) {
    if (!botToken) {
        throw new Error('botToken is required')
    }

    const url = `${TELEGRAM.API_BASE_URL}${botToken}/getUpdates`
    
    const params = {}

    if (offset !== undefined) {
        params.offset = offset
    }

    if (limit) {
        params.limit = limit
    }

    if (timeout) {
        params.timeout = Math.floor(timeout / 1000) // Convert to seconds
    }

    if (allowedUpdates) {
        params.allowed_updates = allowedUpdates
    }

    // Set request timeout slightly longer than polling timeout
    const axiosTimeout = requestTimeout || (timeout + 5000)

    try {
        const response = await axios.get(url, {
            params,
            timeout: axiosTimeout,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.data.ok) {
            throw new Error(`Telegram API error: ${response.data.description}`)
        }

        return {
            success: true,
            result: response.data.result
        }
    } catch (error) {
        throw new Error(`Failed to get updates: ${error.message}`)
    }
}

/**
 * Initialize webhook with automatic fallback to polling
 * @param {Object} options - Initialization options
 * @param {string} options.botToken - Telegram bot token
 * @param {string} options.webhookUrl - Webhook URL (optional, if not provided will use polling)
 * @param {boolean} options.usePolling - Force use polling instead of webhook (optional)
 * @param {Array<string>} options.allowedUpdates - Array of allowed update types (optional)
 * @param {number} options.maxConnections - Maximum webhook connections (optional)
 * @param {string} options.secretToken - Secret token for webhook validation (optional)
 * @param {Function} options.onUpdate - Callback function for handling updates (optional)
 * @param {boolean} options.dropPendingUpdates - Drop pending updates when switching modes (optional)
 * @returns {Promise<Object>} Initialization result
 */
async function initializeTelegram({
    botToken,
    webhookUrl,
    usePolling = false,
    allowedUpdates,
    maxConnections,
    secretToken,
    onUpdate,
    dropPendingUpdates = false
}) {
    if (!botToken) {
        throw new Error('botToken is required')
    }

    try {
        // If webhook URL provided and not forcing polling, try to set webhook
        if (webhookUrl && !usePolling) {
            try {
                const webhookResult = await setWebhook({
                    botToken,
                    webhookUrl,
                    allowedUpdates,
                    maxConnections,
                    dropPendingUpdates,
                    secretToken
                })

                return {
                    mode: 'webhook',
                    success: true,
                    webhook: webhookResult
                }
            } catch (webhookError) {
                // Webhook failed, fallback to polling if onUpdate provided
                if (onUpdate) {
                    console.warn(`Webhook setup failed, falling back to polling: ${webhookError.message}`)
                } else {
                    throw webhookError
                }
            }
        }

        // Use polling mode if webhook not available or onUpdate callback provided
        if (onUpdate) {
            // Delete any existing webhook first
            try {
                await deleteWebhook({
                    botToken,
                    dropPendingUpdates
                })
            } catch (deleteError) {
                console.warn(`Failed to delete existing webhook: ${deleteError.message}`)
            }

            return {
                mode: 'polling',
                success: true,
                polling: {
                    message: 'Polling mode initialized. Use startPolling() to begin.'
                }
            }
        }

        throw new Error('Either webhookUrl or onUpdate callback must be provided')

    } catch (error) {
        throw new Error(`Failed to initialize Telegram: ${error.message}`)
    }
}

/**
 * Start polling for updates
 * @param {Object} options - Polling options
 * @param {string} options.botToken - Telegram bot token
 * @param {Function} options.onUpdate - Callback function for handling updates
 * @param {Function} options.onError - Callback function for handling errors (optional)
 * @param {number} options.interval - Polling interval in ms (optional, default: 30000)
 * @param {number} options.errorInterval - Error retry interval in ms (optional, default: 60000)
 * @param {number} options.timeout - Polling timeout in ms (optional, default: 10000)
 * @param {Array<string>} options.allowedUpdates - Array of allowed update types (optional)
 * @returns {Object} Polling controller with stop function
 */
function startPolling({
    botToken,
    onUpdate,
    onError,
    interval = TELEGRAM.POLLING.INTERVAL,
    errorInterval = TELEGRAM.POLLING.ERROR_INTERVAL,
    timeout = TELEGRAM.POLLING.TIMEOUT,
    allowedUpdates
}) {
    if (!botToken || !onUpdate) {
        throw new Error('botToken and onUpdate callback are required')
    }

    let lastUpdateId = 0
    let pollingTimeoutId = null
    let isPolling = false

    const poll = async () => {
        if (!isPolling) return

        try {
            const result = await getUpdates({
                botToken,
                offset: lastUpdateId + 1,
                timeout,
                allowedUpdates
            })

            if (result.success && result.result.length > 0) {
                for (const update of result.result) {
                    lastUpdateId = update.update_id
                    try {
                        await onUpdate(update)
                    } catch (updateError) {
                        if (onError) {
                            onError(updateError)
                        } else {
                            console.error('Error processing update:', updateError)
                        }
                    }
                }
            }

            // Schedule next poll
            if (isPolling) {
                pollingTimeoutId = setTimeout(poll, interval)
            }

        } catch (error) {
            if (onError) {
                onError(error)
            } else {
                console.error('Polling error:', error)
            }

            // Retry after error interval
            if (isPolling) {
                pollingTimeoutId = setTimeout(poll, errorInterval)
            }
        }
    }

    const start = () => {
        if (!isPolling) {
            isPolling = true
            poll()
        }
    }

    const stop = () => {
        isPolling = false
        if (pollingTimeoutId) {
            clearTimeout(pollingTimeoutId)
            pollingTimeoutId = null
        }
    }

    // Auto-start polling
    start()

    return {
        start,
        stop,
        isPolling: () => isPolling
    }
}

module.exports = {
    setWebhook,
    deleteWebhook,
    getWebhookInfo,
    getUpdates,
    initializeTelegram,
    startPolling
}