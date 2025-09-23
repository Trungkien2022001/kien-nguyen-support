const alert = require('./alert')
const webhook = require('./webhook')

module.exports = {
    // Alert functions
    sendMessage: alert.sendMessage,
    sendErrorAlert: alert.sendErrorAlert,
    sendStartupNotification: alert.sendStartupNotification,
    sendCustomNotification: alert.sendCustomNotification,
    buildMessageText: alert.buildMessageText,
    determineMessageThread: alert.determineMessageThread,
    
    // Webhook functions
    setWebhook: webhook.setWebhook,
    deleteWebhook: webhook.deleteWebhook,
    getWebhookInfo: webhook.getWebhookInfo,
    getUpdates: webhook.getUpdates,
    initializeTelegram: webhook.initializeTelegram,
    startPolling: webhook.startPolling
}