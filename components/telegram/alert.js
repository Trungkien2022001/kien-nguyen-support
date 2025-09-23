const axios = require('axios')
const moment = require('moment')
const { TELEGRAM } = require('../../constants')

/**
 * Build Telegram message text from error log metadata
 * @param {Object} options - Message options
 * @param {string} options.environment - Environment (PROD/STAGING/DEV)
 * @param {string} options.type - Error type
 * @param {string} options.errorCode - Error code
 * @param {string} options.errorMessage - Error message
 * @param {string} options.metric - Metric name
 * @param {string} options.user - User email
 * @param {string} options.supplierCode - Supplier code
 * @param {string} options.supplierMeta - Supplier metadata
 * @param {Object} options.requestMetadata - Request metadata
 * @param {string} options.errorStack - Error stack trace
 * @returns {string} Formatted message text
 */
function buildMessageText({ 
    environment, 
    type, 
    errorCode, 
    errorMessage, 
    metric, 
    user, 
    supplierCode, 
    supplierMeta, 
    requestMetadata, 
    errorStack 
}) {
    const lines = []

    if (environment) {
        lines.push(`ENV: ${environment}`)
    }

    if (type) {
        lines.push(`TYPE: ${type}`)
    }

    if (errorCode) {
        lines.push(`ERROR: ${errorCode}`)
    }

    if (errorMessage) {
        lines.push(`MESSAGE: ${errorMessage}`)
    }

    if (metric) {
        lines.push(`METRIC: ${metric}`)
    }

    if (user) {
        lines.push(`USER: ${user}`)
    }

    if (supplierCode) {
        lines.push(`SUPPLIER CODE: ${supplierCode}`)
    }

    if (supplierMeta) {
        lines.push(`SUPPLIER META: ${supplierMeta}`)
    }

    if (requestMetadata) {
        lines.push(`REQUEST METADATA: ${requestMetadata}`)
    }

    if (errorStack) {
        lines.push(`STACK: ${errorStack}`)
    }

    return lines.join('\n')
}

/**
 * Determine message thread ID based on product, error type and metric
 * @param {Object} options - Thread determination options
 * @param {string} options.product - Product type (hotel, flight, tour, transfer)
 * @param {string} options.type - Error type
 * @param {string} options.metric - Metric name
 * @param {Object} options.messageThreadIds - Message thread ID configuration
 * @returns {number|undefined} Message thread ID
 */
function determineMessageThread({ product, type, metric, messageThreadIds }) {
    // Default to hotel if no product specified (backward compatibility)
    const productType = product || TELEGRAM.PRODUCTS.HOTEL
    
    // Determine prefix based on product and type
    let prefix
    if (type && type.toLowerCase() === TELEGRAM.ERROR_TYPES.THIRD_PARTY) {
        prefix = `${productType}_third_party_`
    } else {
        prefix = `${productType}_system_`
    }

    // Determine suffix based on product and metric
    let suffix = 'general' // default
    if (metric) {
        const metricLower = metric.toLowerCase()
        suffix = getMetricSuffix(productType, metricLower)
    }

    // Build thread key
    const threadKey = `${prefix}${suffix}`

    // Get message thread ID from config
    return messageThreadIds[threadKey] || 
           messageThreadIds[`${prefix}all`] ||
           messageThreadIds[`${prefix}general`] ||
           messageThreadIds.general
}

/**
 * Get metric suffix based on product and metric
 * @param {string} product - Product type
 * @param {string} metric - Metric name (lowercase)
 * @returns {string} Metric suffix
 */
function getMetricSuffix(product, metric) {
    switch (product) {
        case TELEGRAM.PRODUCTS.HOTEL:
            return getHotelMetricSuffix(metric)
        case TELEGRAM.PRODUCTS.FLIGHT:
            return getFlightMetricSuffix(metric)
        case TELEGRAM.PRODUCTS.TOUR:
            return getTourMetricSuffix(metric)
        case TELEGRAM.PRODUCTS.TRANSFER:
            return getTransferMetricSuffix(metric)
        default:
            return 'all'
    }
}

/**
 * Get hotel metric suffix
 * @param {string} metric - Metric name (lowercase)
 * @returns {string} Metric suffix
 */
function getHotelMetricSuffix(metric) {
    switch (metric) {
        case TELEGRAM.METRICS.HOTEL.OFFER_SEARCH:
        case TELEGRAM.METRICS.HOTEL.SEARCH_BY_REGION:
        case TELEGRAM.METRICS.HOTEL.SEARCH_BY_ID:
        case TELEGRAM.METRICS.HOTEL.SEARCHALL:
        case TELEGRAM.METRICS.HOTEL.SEARCH:
            return 'search'
        case TELEGRAM.METRICS.HOTEL.OFFER_PREBOOK:
        case TELEGRAM.METRICS.HOTEL.PREBOOK:
            return 'prebook'
        case TELEGRAM.METRICS.HOTEL.OFFER_BOOK:
        case TELEGRAM.METRICS.HOTEL.BOOK:
        case TELEGRAM.METRICS.HOTEL.BOOKING:
            return 'book'
        case TELEGRAM.METRICS.HOTEL.OFFER_CANCEL:
        case TELEGRAM.METRICS.HOTEL.CANCEL:
            return 'cancel'
        default:
            return 'all'
    }
}

/**
 * Get flight metric suffix
 * @param {string} metric - Metric name (lowercase)
 * @returns {string} Metric suffix
 */
function getFlightMetricSuffix(metric) {
    switch (metric) {
        case TELEGRAM.METRICS.FLIGHT.SEARCH:
            return 'search'
        case TELEGRAM.METRICS.FLIGHT.CONFIRM_TAX:
        case TELEGRAM.METRICS.FLIGHT.CONFIRM_TAXES:
            return 'confirm_tax'
        case TELEGRAM.METRICS.FLIGHT.GENERATE_PNR:
            return 'generate_pnr'
        case TELEGRAM.METRICS.FLIGHT.GENERATE_ETICKET:
            return 'generate_eticket'
        case TELEGRAM.METRICS.FLIGHT.RETRIEVE_PNR:
            return 'retrieve_pnr'
        case TELEGRAM.METRICS.FLIGHT.RETRIEVE:
            return 'retrieve'
        case TELEGRAM.METRICS.FLIGHT.CANCEL:
            return 'cancel'
        default:
            return 'all'
    }
}

/**
 * Get tour metric suffix
 * @param {string} metric - Metric name (lowercase)
 * @returns {string} Metric suffix
 */
function getTourMetricSuffix(metric) {
    switch (metric) {
        case TELEGRAM.METRICS.TOUR.SEARCH:
            return 'search'
        case TELEGRAM.METRICS.TOUR.BOOK:
        case TELEGRAM.METRICS.TOUR.BOOKING:
            return 'book'
        case TELEGRAM.METRICS.TOUR.CANCEL:
            return 'cancel'
        default:
            return 'all'
    }
}

/**
 * Get transfer metric suffix
 * @param {string} metric - Metric name (lowercase)
 * @returns {string} Metric suffix
 */
function getTransferMetricSuffix(metric) {
    switch (metric) {
        case TELEGRAM.METRICS.TRANSFER.SEARCH:
            return 'search'
        case TELEGRAM.METRICS.TRANSFER.BOOK:
        case TELEGRAM.METRICS.TRANSFER.BOOKING:
            return 'book'
        case TELEGRAM.METRICS.TRANSFER.CANCEL:
            return 'cancel'
        default:
            return 'all'
    }
}

/**
 * Send a message to Telegram
 * @param {Object} options - Send message options
 * @param {string} options.botToken - Telegram bot token
 * @param {string} options.chatId - Chat ID to send message to
 * @param {string} options.text - Message text
 * @param {number} options.messageThreadId - Message thread ID (optional)
 * @param {string} options.parseMode - Parse mode (Markdown/HTML, optional)
 * @param {boolean} options.disableNotification - Disable notification (optional)
 * @param {number} options.timeout - Request timeout in ms (optional, default: 5000)
 * @returns {Promise<Object>} Axios response object
 */
async function sendMessage({ 
    botToken, 
    chatId, 
    text, 
    messageThreadId, 
    parseMode, 
    disableNotification = false,
    timeout = 5000 
}) {
    if (!botToken || !chatId || !text) {
        throw new Error('botToken, chatId, and text are required')
    }

    const url = `${TELEGRAM.API_BASE_URL}${botToken}/sendMessage`
    
    const payload = {
        chat_id: chatId,
        text,
        disable_notification: disableNotification
    }

    if (messageThreadId) {
        payload.message_thread_id = messageThreadId
    }

    if (parseMode) {
        payload.parse_mode = parseMode
    }

    try {
        const response = await axios.post(url, payload, {
            timeout,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response
    } catch (error) {
        throw new Error(`Failed to send Telegram message: ${error.message}`)
    }
}

/**
 * Send an error alert to Telegram
 * @param {Object} options - Error alert options
 * @param {string} options.botToken - Telegram bot token
 * @param {string} options.chatId - Chat ID to send message to  
 * @param {Object} options.messageThreadIds - Message thread ID configuration
 * @param {string} options.product - Product type (hotel, flight, tour, transfer)
 * @param {string} options.environment - Environment (PROD/STAGING/DEV)
 * @param {string} options.type - Error type
 * @param {string} options.errorCode - Error code
 * @param {string} options.errorMessage - Error message
 * @param {string} options.metric - Metric name
 * @param {string} options.user - User email
 * @param {string} options.supplierCode - Supplier code
 * @param {Object} options.supplier - Supplier object
 * @param {Object} options.requestMetadata - Request metadata
 * @param {string} options.errorStack - Error stack trace
 * @param {boolean} options.disableNotification - Disable notification (optional)
 * @returns {Promise<Object>} Axios response object
 */
async function sendErrorAlert({
    botToken,
    chatId,
    messageThreadIds,
    product,
    environment,
    type,
    errorCode,
    errorMessage,
    metric,
    user,
    supplierCode,
    supplier,
    requestMetadata,
    errorStack,
    disableNotification = false
}) {
    // Clean up request metadata
    let cleanRequestMetadata = requestMetadata
    if (requestMetadata && typeof requestMetadata === 'object') {
        const cleaned = { ...requestMetadata }
        delete cleaned.regions
        delete cleaned.mappings
        cleanRequestMetadata = JSON.stringify(cleaned)
    }

    // Truncate error stack to first 2 lines
    let truncatedErrorStack = errorStack
    if (errorStack && typeof errorStack === 'string') {
        const stackLines = errorStack.split('\n')
        if (stackLines.length > 2) {
            truncatedErrorStack = stackLines.slice(0, 2).join('\n')
        }
    }

    // Build supplier meta if supplier object provided
    let supplierMeta = null
    if (supplier) {
        supplierMeta = JSON.stringify({
            id: supplier.id,
            code: supplier.code,
            source_id: supplier.source_id,
            contract_id: supplier.contract_id,
            user_name: supplier.user_name
        })
    }

    const messageText = buildMessageText({
        environment,
        type,
        errorCode,
        errorMessage,
        metric,
        user,
        supplierCode: supplierCode || (supplier && supplier.code),
        supplierMeta,
        requestMetadata: cleanRequestMetadata,
        errorStack: truncatedErrorStack
    })

    const messageThreadId = determineMessageThread({
        product,
        type,
        metric,
        messageThreadIds
    })

    return sendMessage({
        botToken,
        chatId,
        text: messageText,
        messageThreadId,
        disableNotification
    })
}

/**
 * Send a startup notification to Telegram
 * @param {Object} options - Startup notification options
 * @param {string} options.botToken - Telegram bot token
 * @param {string} options.chatId - Chat ID to send message to
 * @param {string} options.environment - Environment (PROD/STAGING/DEV)
 * @param {string} options.serviceName - Service name (optional)
 * @param {string} options.version - Service version (optional)
 * @param {Object} options.customMessage - Custom message parts (optional)
 * @param {boolean} options.disableNotification - Disable notification (optional, default: true)
 * @returns {Promise<Object>} Axios response object
 */
async function sendStartupNotification({
    botToken,
    chatId,
    environment,
    serviceName = 'Service',
    version,
    customMessage,
    disableNotification = true
}) {
    const timestamp = moment().format('DD/MM/YYYY HH:mm:ss')
    
    let message = `🚀 **${serviceName} Started**\n\n`
    message += `📅 ${timestamp}\n`
    message += `🌍 Environment: **${environment}**\n`
    
    if (version) {
        message += `📦 Version: ${version}\n`
    }

    if (customMessage) {
        message += `\n${customMessage}`
    }

    message += '\n\nReady to serve! 💪'

    return sendMessage({
        botToken,
        chatId,
        text: message,
        parseMode: 'Markdown',
        disableNotification
    })
}

/**
 * Send a custom notification to Telegram
 * @param {Object} options - Custom notification options
 * @param {string} options.botToken - Telegram bot token
 * @param {string} options.chatId - Chat ID to send message to
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message
 * @param {string} options.icon - Icon emoji (optional)
 * @param {string} options.environment - Environment (optional)
 * @param {number} options.messageThreadId - Message thread ID (optional)
 * @param {string} options.parseMode - Parse mode (optional)
 * @param {boolean} options.disableNotification - Disable notification (optional)
 * @returns {Promise<Object>} Axios response object
 */
async function sendCustomNotification({
    botToken,
    chatId,
    title,
    message,
    icon = '📢',
    environment,
    messageThreadId,
    parseMode,
    disableNotification = false
}) {
    const timestamp = moment().format('DD/MM/YYYY HH:mm:ss')
    
    let text = `${icon} **${title}**\n\n`
    text += `📅 ${timestamp}\n`
    
    if (environment) {
        text += `🌍 Environment: **${environment}**\n`
    }
    
    text += `\n${message}`

    return sendMessage({
        botToken,
        chatId,
        text,
        messageThreadId,
        parseMode: parseMode || 'Markdown',
        disableNotification
    })
}

module.exports = {
    sendMessage,
    sendErrorAlert,
    sendStartupNotification,
    sendCustomNotification,
    buildMessageText,
    determineMessageThread
}