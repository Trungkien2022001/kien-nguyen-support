// Kien Nguyen Support Package
// A comprehensive utilities package for logging, telegram alerts, and webhook management

// Import all components
const {
    saveProviderLog,
    saveProviderCurl
} = require('./components/third-party-logs/log')
const { TelegramClient } = require('./components/telegram-bot')
const { createTelegramWebhookClient } = require('./components/telegram-webhook')

// Main exports
module.exports = {
    // 🚀 MAIN FACTORY EXPORTS - This is what most people will use
    TelegramClient,
    createTelegramWebhookClient,

    // Logging utilities
    saveProviderLog,
    saveProviderCurl
}

// Support both CommonJS and ES6 imports
module.exports.default = module.exports
