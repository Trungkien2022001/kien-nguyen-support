// Kien Nguyen Support Package
// A comprehensive utilities package for logging, telegram alerts, and webhook management

// Import all components
const {
    saveProviderLog,
    saveProviderCurl
} = require('./components/third-party-logs/log')
const { TelegramClient } = require('./components/telegram-bot')
const { createTelegramWebhookClient } = require('./components/telegram-webhook')

// Alert components - Import all from alerts index
const {
    SlackAlert,
    DiscordAlert,
    MessengerAlert,
    MattermostAlert,
    N8nAlert,
    TelegramAlert,
    ZaloAlert,
    EmailAlert,
    MultiChannelAlert,
    WhatsAppAlert,
    LineAlert,
    ViberAlert
} = require('./components/alerts')

// Main exports
module.exports = {
    // 🚀 MAIN FACTORY EXPORTS - This is what most people will use
    TelegramClient,
    createTelegramWebhookClient,

    // 📢 MULTICHANNEL ALERT CLIENTS
    MultiChannelAlert,
    SlackAlert,
    DiscordAlert,
    MessengerAlert,
    MattermostAlert,
    N8nAlert,
    TelegramAlert,
    ZaloAlert,
    EmailAlert,
    WhatsAppAlert,
    LineAlert,
    ViberAlert,

    // Logging utilities
    saveProviderLog,
    saveProviderCurl
}

// Support both CommonJS and ES6 imports
module.exports.default = module.exports
