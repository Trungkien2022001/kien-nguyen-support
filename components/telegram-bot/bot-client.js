const {
    sendMessage,
    sendErrorAlert,
    sendStartupNotification,
    sendCustomNotification
} = require('./alert')

/**
 * Determine message thread ID based on product, type, and metric
 * @param {Object} options - Thread determination options
 * @param {string} options.product - Product type (hotel, flight, tour, transfer)
 * @param {string} options.type - Alert type (system, third_party)
 * @param {string} options.metric - Metric type (search, prebook, book, cancel)
 * @param {Object} options.messageThreadIds - Available thread IDs
 * @returns {number|undefined} Message thread ID
 */
function determineMessageThreadId({ product, type, metric, messageThreadIds }) {
    if (!messageThreadIds || Object.keys(messageThreadIds).length === 0) {
        return undefined
    }

    // Convert to lowercase for consistent matching
    const productLower = product ? product.toLowerCase() : 'hotel'
    const typeLower = type ? type.toLowerCase() : 'system'
    const metricLower = metric ? metric.toLowerCase() : 'general'

    // Determine prefix based on product and type
    let prefix
    if (typeLower === 'third_party') {
        prefix = `${productLower}_third_party_`
    } else {
        prefix = `${productLower}_system_`
    }

    // Build thread key and try to find matching thread ID
    const threadKey = `${prefix}${metricLower}`

    return (
        messageThreadIds[threadKey] ||
        messageThreadIds[`${prefix}general`] ||
        messageThreadIds[`${prefix}all`] ||
        messageThreadIds[`${productLower}_system_general`] ||
        messageThreadIds[`${productLower}_system_all`] ||
        messageThreadIds.general
    )
}

/**
 * Telegram client class with pre-configured settings
 *
 * INITIALIZATION REQUIREMENTS:
 * - botToken (string, required): Telegram bot token from @BotFather
 * - chatId (string, required): Chat ID where messages will be sent
 * - product (string, optional): Default product type ('hotel', 'flight', 'tour', 'transfer')
 * - environment (string, optional): Default environment ('DEV', 'STAGING', 'PROD')
 * - messageThreadIds (Object, optional): Thread routing configuration for smart routing
 * - disableNotification (boolean, optional): Default notification setting
 * - timeout (number, optional): Request timeout in milliseconds
 *
 * THREAD ROUTING CONFIGURATION:
 * messageThreadIds should follow pattern: {product}_{type}_{metric}
 * Example:
 * {
 *   general: 9,
 *   hotel_system_search: 19,
 *   hotel_system_book: 23,
 *   hotel_third_party_search: 30,
 *   hotel_third_party_book: 34,
 *   flight_system_search: 41
 * }
 */
class TelegramClient {
    /**
     * Create Telegram client instance
     * @param {Object} config - Telegram configuration
     * @param {string} config.botToken - Telegram bot token (REQUIRED)
     * @param {string} config.chatId - Default chat ID (REQUIRED)
     * @param {string} config.product - Default product type (hotel, flight, tour, transfer)
     * @param {string} config.environment - Default environment (DEV, STAGING, PROD)
     * @param {Object} config.messageThreadIds - Message thread ID configuration (optional)
     * @param {boolean} config.disableNotification - Default disable notification setting (optional)
     * @param {number} config.timeout - Default timeout (optional)
     */
    constructor(config) {
        const {
            botToken,
            chatId,
            product = 'hotel',
            environment = 'STAGING',
            messageThreadIds = {},
            disableNotification = false,
            beautyMessage = true,
            timeout = 5000
        } = config

        if (!botToken || !chatId) {
            throw new Error('botToken and chatId are required in config')
        }

        // Store config as instance properties
        this.botToken = botToken
        this.chatId = chatId
        this.product = product
        this.environment = environment
        this.messageThreadIds = messageThreadIds
        this.disableNotification = disableNotification
        this.beautyMessage = beautyMessage
        this.timeout = timeout
    }

    /**
     * Send message using error-handler.js style - only options parameter
     *
     * SENDMESSAGE OPTIONS PARAMETER STRUCTURE:
     * Required:
     * - error_message (string): The message text to send
     *
     * Optional (for metadata and routing):
     * - type (string): Alert type ('system' or 'third_party')
     * - metric (string): Metric for thread routing (search, book, cancel, etc.)
     * - user_email (string): User email for context
     * - supplier (Object): Supplier information { code, id, source_id, etc. }
     * - request_metadata (Object|string): Request metadata for debugging
     * - error_code (string): Error code for categorization
     * - error_stack (string): Error stack trace (auto-truncated)
     * - metadata (Object|string): Additional metadata
     * - environment (string): Override default environment
     * - product (string): Override default product
     *
     * LOG META STRUCTURE (auto-generated from options):
     * {
     *   type: 'system' | 'third_party',
     *   environment: 'DEV' | 'STAGING' | 'PROD',
     *   user: string (from user_email or user.email),
     *   supplier_code: string (from supplier.code),
     *   supplier_meta: string (JSON of supplier object),
     *   metric: string,
     *   request_metadata: string (JSON or direct string),
     *   error_code: string,
     *   error_message: string,
     *   error_stack: string (truncated to 2 lines),
     *   error_metadata: string (JSON or direct string)
     * }
     *
     * @param {Object} options - Message options (error-handler.js style)
     * @returns {Promise<Object>} Telegram API response
     */
    async sendMessage(options = {}) {
        // Add default config values to options if not present
        const messageOptions = {
            ...options,
            botToken: this.botToken,
            chatId: this.chatId,
            messageThreadIds: this.messageThreadIds,
            product: this.product,
            environment: this.environment,
            timeout: this.timeout
        }

        return sendMessage(messageOptions)
    }

    /**
     * Send error alert using error-handler.js style - only options parameter
     *
     * ERROR ALERT OPTIONS (inherits all sendMessage options plus):
     * - Automatically sets appropriate type and metric defaults
     * - Uses smart thread routing based on product + type + metric
     * - Falls back gracefully to general thread if specific not found
     *
     * EXAMPLE USAGE:
     * await telegram.sendErrorAlert({
     *   error_message: 'Booking failed',
     *   error_code: 'BOOKING_FAILED',
     *   type: 'third_party',
     *   metric: 'book',
     *   user_email: 'user@example.com',
     *   supplier: { code: 'EXPEDIA', id: 123 },
     *   request_metadata: { bookingId: 'ABC123' },
     *   error_stack: error.stack
     * })
     *
     * @param {Object} options - Error alert options (error-handler.js style)
     * @returns {Promise<Object>} Telegram API response
     */
    async sendErrorAlert(options = {}) {
        // Add default config values to options if not present
        const errorOptions = {
            ...options,
            botToken: options.botToken || this.botToken,
            chatId: options.chatId || this.chatId,
            messageThreadIds: options.messageThreadIds || this.messageThreadIds,
            product: options.product || this.product,
            environment: options.environment || this.environment,
            type: options.type || 'system',
            metric: options.metric || 'general',
            timeout: options.timeout || this.timeout
        }

        return sendMessage(errorOptions)
    }

    /**
     * Send startup notification
     * @param {Object} options - Startup notification options
     * @returns {Promise<Object>} Telegram API response
     */
    async sendStartupNotification(options = {}) {
        const messageThreadId =
            options.messageThreadId ||
            determineMessageThreadId({
                product: options.product || this.product,
                type: 'system',
                metric: 'general',
                messageThreadIds: this.messageThreadIds
            })

        return sendStartupNotification({
            botToken: this.botToken,
            chatId: options.chatId || this.chatId,
            messageThreadId,
            disableNotification:
                options.disableNotification !== undefined
                    ? options.disableNotification
                    : true,
            product: options.product || this.product,
            ...options
        })
    }

    /**
     * Send custom notification
     * @param {Object} options - Custom notification options
     * @returns {Promise<Object>} Telegram API response
     */
    async sendCustomNotification(options) {
        const messageThreadId =
            options.messageThreadId ||
            determineMessageThreadId({
                product: options.product || this.product,
                type: options.type || 'system',
                metric: options.metric || 'general',
                messageThreadIds: this.messageThreadIds
            })

        return sendCustomNotification({
            botToken: this.botToken,
            chatId: options.chatId || this.chatId,
            messageThreadId,
            disableNotification:
                options.disableNotification !== undefined
                    ? options.disableNotification
                    : this.disableNotification,
            product: options.product || this.product,
            ...options
        })
    }

    /**
     * Get current configuration
     * @returns {Object} Current config
     */
    getConfig() {
        return {
            botToken: this.botToken,
            chatId: this.chatId,
            product: this.product,
            environment: this.environment,
            messageThreadIds: this.messageThreadIds,
            disableNotification: this.disableNotification,
            timeout: this.timeout
        }
    }

    /**
     * Access to raw methods if needed (static)
     */
    static get raw() {
        return {
            sendMessage,
            sendErrorAlert,
            sendStartupNotification,
            sendCustomNotification
        }
    }
}

module.exports = {
    TelegramClient
}
