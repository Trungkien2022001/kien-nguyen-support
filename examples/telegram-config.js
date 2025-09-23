// Example Telegram configuration for multi-product support
// Copy this structure to your main config.js

const telegramConfig = {
    telegramAlert: {
        botToken: process.env.TELEGRAM_BOT_TOKEN || 'your-bot-token',
        chatId: process.env.TELEGRAM_CHAT_ID || 'your-chat-id',
        supportChatId: process.env.TELEGRAM_SUPPORT_CHAT_ID || 'your-support-chat-id',
        
        // Message thread IDs for different products and operations
        // These thread IDs should match your actual Telegram group forum threads
        message_thread_id: {
            // General
            general: 1,
            
            // Hotel System Threads
            hotel_system_all: 10,
            hotel_system_search: 11,
            hotel_system_prebook: 12,
            hotel_system_book: 13,
            hotel_system_cancel: 14,
            
            // Hotel Third Party Threads
            hotel_third_party_all: 20,
            hotel_third_party_search: 21,
            hotel_third_party_prebook: 22,
            hotel_third_party_book: 23,
            hotel_third_party_cancel: 24,
            
            // Flight System Threads
            flight_system_all: 30,
            flight_system_search: 31,
            flight_system_confirm_tax: 32,
            flight_system_generate_pnr: 33,
            flight_system_generate_eticket: 34,
            flight_system_retrieve_pnr: 35,
            flight_system_retrieve: 36,
            flight_system_cancel: 37,
            
            // Flight Third Party Threads
            flight_third_party_all: 40,
            flight_third_party_search: 41,
            flight_third_party_confirm_tax: 42,
            flight_third_party_generate_pnr: 43,
            flight_third_party_generate_eticket: 44,
            flight_third_party_retrieve_pnr: 45,
            flight_third_party_retrieve: 46,
            flight_third_party_cancel: 47,
            
            // Tour System Threads
            tour_system_all: 50,
            tour_system_search: 51,
            tour_system_book: 52,
            tour_system_cancel: 53,
            
            // Tour Third Party Threads
            tour_third_party_all: 60,
            tour_third_party_search: 61,
            tour_third_party_book: 62,
            tour_third_party_cancel: 63,
            
            // Transfer System Threads
            transfer_system_all: 70,
            transfer_system_search: 71,
            transfer_system_book: 72,
            transfer_system_cancel: 73,
            
            // Transfer Third Party Threads
            transfer_third_party_all: 80,
            transfer_third_party_search: 81,
            transfer_third_party_book: 82,
            transfer_third_party_cancel: 83
        }
    }
}

// Usage examples:

const { sendErrorAlert } = require('kien-nguyen-support/components/telegram')

// Hotel error example
async function sendHotelError() {
    await sendErrorAlert({
        botToken: telegramConfig.telegramAlert.botToken,
        chatId: telegramConfig.telegramAlert.chatId,
        messageThreadIds: telegramConfig.telegramAlert.message_thread_id,
        product: 'hotel', // Will route to hotel threads
        environment: 'PROD',
        type: 'third_party',
        errorCode: 'BOOKING_FAILED',
        errorMessage: 'Failed to book hotel room',
        metric: 'offer_book', // Will route to hotel_third_party_book thread
        user: 'user@example.com',
        supplierCode: 'EXPEDIA'
    })
}

// Flight error example  
async function sendFlightError() {
    await sendErrorAlert({
        botToken: telegramConfig.telegramAlert.botToken,
        chatId: telegramConfig.telegramAlert.chatId,
        messageThreadIds: telegramConfig.telegramAlert.message_thread_id,
        product: 'flight', // Will route to flight threads
        environment: 'PROD',
        type: 'system',
        errorCode: 'PNR_GENERATION_FAILED',
        errorMessage: 'Failed to generate PNR',
        metric: 'generate_pnr', // Will route to flight_system_generate_pnr thread
        user: 'user@example.com'
    })
}

// Tour error example
async function sendTourError() {
    await sendErrorAlert({
        botToken: telegramConfig.telegramAlert.botToken,
        chatId: telegramConfig.telegramAlert.chatId,
        messageThreadIds: telegramConfig.telegramAlert.message_thread_id,
        product: 'tour', // Will route to tour threads
        environment: 'STAGING',
        type: 'third_party',
        errorCode: 'SEARCH_TIMEOUT',
        errorMessage: 'Tour search request timed out',
        metric: 'search', // Will route to tour_third_party_search thread
        user: 'user@example.com',
        supplierCode: 'VIATOR'
    })
}

// Transfer error example
async function sendTransferError() {
    await sendErrorAlert({
        botToken: telegramConfig.telegramAlert.botToken,
        chatId: telegramConfig.telegramAlert.chatId,
        messageThreadIds: telegramConfig.telegramAlert.message_thread_id,
        product: 'transfer', // Will route to transfer threads
        environment: 'PROD',
        type: 'system',
        errorCode: 'BOOKING_VALIDATION_FAILED',
        errorMessage: 'Transfer booking validation failed',
        metric: 'book', // Will route to transfer_system_book thread
        user: 'user@example.com'
    })
}

// Backward compatibility - without product parameter defaults to hotel
async function sendLegacyError() {
    await sendErrorAlert({
        botToken: telegramConfig.telegramAlert.botToken,
        chatId: telegramConfig.telegramAlert.chatId,
        messageThreadIds: telegramConfig.telegramAlert.message_thread_id,
        // No product specified - will default to hotel
        environment: 'PROD',
        type: 'third_party',
        errorCode: 'LEGACY_ERROR',
        errorMessage: 'Legacy error without product',
        metric: 'search', // Will route to hotel_third_party_search thread
        user: 'user@example.com'
    })
}

module.exports = {
    telegramConfig,
    sendHotelError,
    sendFlightError,
    sendTourError,
    sendTransferError,
    sendLegacyError
}