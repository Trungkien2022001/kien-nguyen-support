# Quick Setup Guide - 3 Core Features

This package provides 3 main features:
1. **Third-Party Log** - HTTP request/response logging
2. **Telegram Bot** - Alert notifications and messaging
3. **Telegram Webhook** - Webhook management for production

## 1. Environment Configuration

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your actual configuration:

```env
# Telegram Bot Configuration  
TELEGRAM_BOT_TOKEN=7893829996:AAGGaSHvNKSSXPMRbiJiwrRpBwVIgMj1BLE
TELEGRAM_CHAT_ID=-1003057627863
TELEGRAM_SUPPORT_CHAT_ID=-4940551554

# Webhook Configuration (for production)
WEBHOOK_URL=https://your-app.com/telegram-webhook
WEBHOOK_SECRET_TOKEN=your-secret-token

# Environment
NODE_ENV=development
```

## 2. Third-Party Log (HTTP Request Logging)

Save API request/response logs and curl commands:

```javascript
const { saveProviderLog, saveProviderCurl } = require('kien-nguyen-support')

// Save request/response logs
await saveProviderLog({
    action: 'search',           // Action name
    req: requestData,           // Request object/string 
    res: responseData,          // Response object/string
    code: 'EXPEDIA',           // Provider code
    name: 'search-hotels'      // Operation name
})

// Save curl command
await saveProviderCurl({
    name: 'search-hotels',     // Operation name
    request: {                 // Request object
        method: 'POST',
        url: 'https://api.expedia.com/search',
        headers: { 'Content-Type': 'application/json' },
        body: { destination: 'Bangkok' }
    },
    code: 'EXPEDIA',          // Provider code
    action: 'search'          // Action name (optional)
})
```

**Output**: Files saved to `../logs/logs_YYYY-MM-DD/` and `../curl_logs/logs_YYYY-MM-DD/`

## 3. Telegram Bot (Alert & Messaging)

### Class-based Client (Recommended)

Create a pre-configured TelegramClient class instance:

```javascript
const { TelegramClient } = require('kien-nguyen-support')

// Initialize with required config
const telegram = new TelegramClient({
    botToken: process.env.TELEGRAM_BOT_TOKEN,     // Required
    chatId: process.env.TELEGRAM_CHAT_ID,        // Required
    product: 'hotel',                            // Default product
    environment: 'PROD',                         // Default environment
    messageThreadIds: {                          // Thread routing config
        general: 9,
        hotel_system_search: 19,
        hotel_system_book: 23,
        hotel_third_party_search: 30,
        hotel_third_party_book: 34,
        flight_system_search: 41,
        // ... more thread IDs
    },
    disableNotification: false,                  // Optional
    timeout: 10000                              // Optional (ms)
})

// Send simple message
await telegram.sendMessage({
    error_message: 'Hello World!'
})

// Send error alert (auto thread routing)
await telegram.sendErrorAlert({
    type: 'third_party',                        // 'system' or 'third_party'
    error_code: 'BOOKING_FAILED',               // Error code
    error_message: 'Failed to book hotel',      // Error message
    metric: 'book',                            // Metric for thread routing
    user_email: 'user@example.com',            // Optional
    supplier: {                                // Optional
        code: 'EXPEDIA',
        id: 123
    },
    request_metadata: { bookingId: 'ABC123' },  // Optional
    error_stack: error.stack                   // Optional
})
```

### Factory Function (Alternative)

```javascript
const { createTelegramClient } = require('kien-nguyen-support')

const telegramClient = createTelegramClient({
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID,
    messageThreadIds: { /* thread config */ }
})

await telegramClient.sendMessage({ error_message: 'Hello!' })
```

## 4. Telegram Webhook (Production Setup)

For production webhook management:

```javascript
const { createTelegramWebhookClient } = require('kien-nguyen-support')

// Initialize webhook client
const webhookClient = createTelegramWebhookClient({
    botToken: process.env.TELEGRAM_BOT_TOKEN,    // Required
    webhookUrl: process.env.WEBHOOK_URL,         // Required
    secretToken: process.env.WEBHOOK_SECRET_TOKEN, // Optional but recommended
    allowedUpdates: ['message', 'callback_query'], // Optional
    maxConnections: 100,                         // Optional
    timeout: 10000                              // Optional
})

// Set webhook
await webhookClient.setWebhook()

// Get webhook info
const info = await webhookClient.getWebhookInfo()
console.log('Webhook status:', info)

// Delete webhook
await webhookClient.deleteWebhook()

// Verify incoming webhook requests
app.post('/telegram-webhook', (req, res) => {
    const secretToken = req.headers['x-telegram-bot-api-secret-token']
    
    if (!webhookClient.verifyRequest(secretToken)) {
        return res.status(401).send('Unauthorized')
    }
    
    const update = webhookClient.parseUpdate(req.body)
    // Handle update...
    res.sendStatus(200)
})
```

## 5. Thread ID Configuration

Configure message thread IDs for automatic routing:

| Thread Key | Example ID | Purpose |
|-----------|------------|---------|
| `general` | 9 | General messages |
| `hotel_system_search` | 19 | Hotel system search |
| `hotel_system_book` | 23 | Hotel system booking |
| `hotel_third_party_search` | 30 | Hotel 3rd party search |
| `hotel_third_party_book` | 34 | Hotel 3rd party booking |
| `flight_system_search` | 41 | Flight system search |
| `flight_system_book` | 43 | Flight system booking |

**Thread Routing Logic**: `{product}_{type}_{metric}` → Falls back to `general`

## 6. Pre-configured Client (Recommended Pattern)

Create a shared client for your entire project:

```javascript
// config/telegram-client.js
const { TelegramClient } = require('kien-nguyen-support')

const telegramClient = new TelegramClient({
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID,
    messageThreadIds: { /* your config */ },
    environment: process.env.NODE_ENV || 'STAGING'
})

module.exports = telegramClient

// services/hotel-service.js  
const telegram = require('../config/telegram-client')

async function bookHotel(data) {
    try {
        const result = await processBooking(data)
        await telegram.sendMessage({ 
            error_message: `✅ Booking success: ${result.id}` 
        })
        return result
    } catch (error) {
        await telegram.sendErrorAlert({
            type: 'third_party',
            error_code: 'BOOKING_FAILED',
            error_message: error.message,
            metric: 'book',
            user_email: data.userEmail
        })
        throw error
    }
}
```

## 7. Test Your Setup

```bash
# Test basic functionality
node test.js

# Run examples
node examples/telegram-client-usage.js
node examples/webhook-client-usage.js
```

That's it! All 3 features are ready to use. 🚀