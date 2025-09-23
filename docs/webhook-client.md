# Telegram Webhook Client Guide

## Quick Start

```javascript
const { createTelegramWebhookClient } = require('kien-nguyen-support');

// Create webhook client
const webhookClient = createTelegramWebhookClient({
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    webhookUrl: 'https://myapp.com/webhook',
    secretToken: 'my-secret-token',
});

// Auto-setup based on config
await webhookClient.autoInitialize();
```

## Key Features

### 🎯 **Pre-configured Settings**
- Auto-fill botToken, webhookUrl, allowedUpdates in all calls
- Smart defaults for webhook/polling parameters
- Environment-based configuration

### 🔄 **Easy Mode Switching**
```javascript
// Switch to webhook mode
await webhookClient.switchToWebhook('https://new-url.com/webhook');

// Switch to polling mode
await webhookClient.switchToPolling();

// Auto-initialize based on config
await webhookClient.autoInitialize();
```

### 📊 **Status Monitoring**
```javascript
// Check webhook status
const status = await webhookClient.checkWebhookStatus();
// { isActive: true, url: 'https://...', pendingUpdates: 0 }

// Get detailed info
const info = await webhookClient.getWebhookInfo();
```

### 🚀 **Simplified API Calls**
```javascript
// Set webhook (auto-filled config)
await webhookClient.setWebhook();

// Set with custom URL
await webhookClient.setWebhook({ webhookUrl: 'https://custom.com/webhook' });

// Delete webhook
await webhookClient.deleteWebhook();

// Start polling with handler
await webhookClient.startPolling(async (update) => {
    // Handle update
});
```

## Usage Patterns

### Production Webhook Setup
```javascript
const webhookClient = createTelegramWebhookClient({
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    webhookUrl: `${process.env.APP_URL}/telegram-webhook`,
    secretToken: process.env.WEBHOOK_SECRET_TOKEN,
    maxConnections: 40,
    dropPendingUpdates: false,
});

// Auto-setup on app start
await webhookClient.autoInitialize();
```

### Development Polling Setup
```javascript
const webhookClient = createTelegramWebhookClient({
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    // No webhookUrl = polling mode
    pollInterval: 1000,
    pollLimit: 10,
});

// Auto-setup will use polling
await webhookClient.autoInitialize();

// Start polling
await webhookClient.startPolling(async (update) => {
    console.log('Dev update:', update);
});
```

### Environment-Based Setup
```javascript
const config = {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
};

if (process.env.NODE_ENV === 'production') {
    config.webhookUrl = process.env.WEBHOOK_URL;
    config.secretToken = process.env.WEBHOOK_SECRET_TOKEN;
} else {
    // Development polling
    config.pollInterval = 2000;
}

const webhookClient = createTelegramWebhookClient(config);
await webhookClient.autoInitialize();
```

## API Reference

### Configuration Options
- `botToken` - Telegram bot token (required)
- `webhookUrl` - Webhook URL (optional, for webhook mode)
- `allowedUpdates` - Array of update types (default: message, callback_query, inline_query)
- `maxConnections` - Max webhook connections (default: 40)
- `dropPendingUpdates` - Drop pending updates (default: false)
- `secretToken` - Webhook secret token (optional)
- `timeout` - Request timeout (default: 10000)
- `pollInterval` - Polling interval in ms (default: 1000)
- `pollLimit` - Polling limit (default: 100)

### Methods
- `setWebhook(options?)` - Set webhook with auto-filled config
- `deleteWebhook(options?)` - Delete webhook
- `getWebhookInfo(options?)` - Get webhook information
- `getUpdates(options?)` - Get updates for polling
- `startPolling(handler, options?)` - Start polling with update handler
- `enableWebhook(url?)` - Enable webhook mode
- `disableWebhook()` - Disable webhook mode
- `checkWebhookStatus()` - Get simplified status info
- `autoInitialize()` - Auto-setup based on config
- `switchToWebhook(url?)` - Switch to webhook mode
- `switchToPolling()` - Switch to polling mode
- `getConfig()` - Get current configuration