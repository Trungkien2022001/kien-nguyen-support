// Kien Nguyen Support Package
// A comprehensive utilities package for logging, telegram alerts, and webhook management

// Import all components
const logs = require('./components/logs')
const telegram = require('./components/telegram')
const constants = require('./constants')

// Package metadata
const packageInfo = {
    name: 'kien-nguyen-support',
    version: '1.0.0',
    description: 'Utilities package for logging, telegram alerts, and webhook management',
    author: 'nguyenkien2022001@gmail.com'
}

// Main exports
module.exports = {
    // Package info
    ...packageInfo,
    
    // Constants
    constants,
    
    // Logging functions
    logs: {
        saveProviderLog: logs.saveProviderLog,
        saveProviderCurl: logs.saveProviderCurl
    },
    
    // Telegram functions
    telegram: {
        // Alert functions
        sendMessage: telegram.sendMessage,
        sendErrorAlert: telegram.sendErrorAlert,
        sendStartupNotification: telegram.sendStartupNotification,
        sendCustomNotification: telegram.sendCustomNotification,
        buildMessageText: telegram.buildMessageText,
        determineMessageThread: telegram.determineMessageThread,
        
        // Webhook functions
        setWebhook: telegram.setWebhook,
        deleteWebhook: telegram.deleteWebhook,
        getWebhookInfo: telegram.getWebhookInfo,
        getUpdates: telegram.getUpdates,
        initializeTelegram: telegram.initializeTelegram,
        startPolling: telegram.startPolling
    },
    
    // Direct exports for convenience (most commonly used functions)
    saveProviderLog: logs.saveProviderLog,
    saveProviderCurl: logs.saveProviderCurl,
    sendMessage: telegram.sendMessage,
    sendErrorAlert: telegram.sendErrorAlert,
    sendStartupNotification: telegram.sendStartupNotification,
    initializeTelegram: telegram.initializeTelegram,
    setWebhook: telegram.setWebhook,
    deleteWebhook: telegram.deleteWebhook,
    startPolling: telegram.startPolling
}

// Support both CommonJS and ES6 imports
module.exports.default = module.exports