# Kien Nguyen Support

A comprehensive utilities package for logging, Telegram alerts, and webhook management with enhanced formatting and ID extraction.

## Installation

```bash
npm install kien-nguyen-support
```

## 🆕 Version 1.1.0 Features

- **🔍 Smart ID Extraction**: Automatically extract and display `trace_id`, `request_id`, `search_id`, `log_id` in copyable code blocks
- **📝 Enhanced Stack Formatting**: Error stacks limited to first 2 lines for cleaner display
- **🎨 Improved JSON Display**: Better formatting with proper indentation and safe parsing
- **📱 Rich Telegram Messages**: Enhanced Markdown formatting with emojis and structured layout

## 3 Core Features

- 📝 **Third-Party Log**: Save HTTP request/response logs and curl commands
- 🚨 **Telegram Bot**: Alert notifications with smart thread routing
- 🔗 **Telegram Webhook**: Production webhook management with fallback

## Quick Start

```javascript
const { TelegramClient, saveProviderLog, createTelegramWebhookClient } = require('kien-nguyen-support')

// Feature 1: Third-Party Logging
await saveProviderLog({
    action: 'search',
    req: requestData,
    res: responseData,
    code: 'EXPEDIA',
    name: 'search-hotels'
})

// Feature 2: Telegram Bot
const telegram = new TelegramClient({
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID,
    messageThreadIds: { /* thread config */ }
})
await telegram.sendErrorAlert({ error_message: 'Hello!' })

// Feature 3: Telegram Webhook
const webhook = createTelegramWebhookClient({ /* config */ })
await webhook.setWebhook()
```

## Feature 1: Third-Party Log (HTTP Request Logging)

Save API request/response logs and curl commands to organized files:

```javascript
const { saveProviderLog, saveProviderCurl } = require('kien-nguyen-support')

// Save request/response logs
await saveProviderLog({
    action: 'search',           // Action name
    req: requestData,           // Request object/string (JSON or XML)
    res: responseData,          // Response object/string (JSON or XML)
    code: 'EXPEDIA',           // Provider/supplier code
    name: 'search-hotels'      // Operation name
})

// Save curl command for debugging
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

**Files are automatically saved to:**
- Request/Response: `../logs/logs_YYYY-MM-DD/TIMESTAMP_CODE_NAME_ACTION_req.json`
- Curl commands: `../curl_logs/logs_YYYY-MM-DD/TIMESTAMP_CODE_NAME_ACTION_curl.txt`

## Feature 2: Telegram Bot (Alert & Messaging)

### TelegramClient Class (Recommended)

Pre-configured client with smart thread routing:

```javascript
const { TelegramClient } = require('kien-nguyen-support')

/**
 * Initialize TelegramClient
 * Required config:
 * - botToken: Telegram bot token
 * - chatId: Chat ID to send messages to
 * 
 * Optional config:
 * - product: Default product type (hotel, flight, tour, transfer)
 * - environment: Default environment (DEV, STAGING, PROD)
 * - messageThreadIds: Thread routing configuration
 * - disableNotification: Disable notifications (default: false)
 * - timeout: Request timeout in ms (default: 5000)
 */
const telegram = new TelegramClient({
    botToken: process.env.TELEGRAM_BOT_TOKEN,     // Required
    chatId: process.env.TELEGRAM_CHAT_ID,        // Required
    product: 'hotel',                            // Optional
    environment: 'PROD',                         // Optional
    messageThreadIds: {                          // Optional - for smart routing
        general: 9,
        hotel_system_search: 19,
        hotel_system_book: 23,
        hotel_third_party_search: 30,
        hotel_third_party_book: 34,
        flight_system_search: 41,
        // ... more thread IDs
    },
    disableNotification: false,                  // Optional
    timeout: 10000                              // Optional
})

/**
 * Send message - options parameter structure
 * Required: error_message
 * Optional: All other fields for metadata and routing
 */
await telegram.sendMessage({
    error_message: 'Hello World!'               // Required - message text
})

/**
 * Send error alert with auto thread routing and enhanced formatting
 * Thread routing: product_type_metric → general fallback
 * 
 * ✨ NEW: Automatic ID extraction and rich formatting!
 */
await telegram.sendErrorAlert({
    // Core error info
    error_message: 'Failed to book hotel',      // Required
    error_code: 'BOOKING_FAILED',               // Optional
    
    // Routing (auto-detects thread)
    type: 'third_party',                        // 'system' or 'third_party'
    metric: 'book',                            // For thread routing
    
    // Context (optional)
    user_email: 'user@example.com',
    supplier: {
        code: 'EXPEDIA',
        id: 123,
        source_id: 'EXP001'
    },
    
    // 🆕 Enhanced request metadata with ID extraction
    request_metadata: { 
        bookingId: 'ABC123',
        search_id: 'd8e2048ba1974f568a807532752e452f',  // Auto-extracted!
        trace_id: 'trace-12345',                        // Auto-extracted!
        log_id: '63b5c9faf56fc04fdf2509b3874cb6d4'       // Auto-extracted!
    },
    
    error_stack: error.stack,                   // 🆕 Auto-truncated to 2 lines
    metadata: { additional: 'data' }           // Any extra metadata
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

## Feature 3: Telegram Webhook (Production Setup)

Manage webhooks for production deployment:

```javascript
const { createTelegramWebhookClient } = require('kien-nguyen-support')

/**
 * Initialize webhook client
 * Required config:
 * - botToken: Telegram bot token
 * - webhookUrl: URL for webhook endpoint
 * 
 * Optional config:
 * - secretToken: Secret token for verification
 * - allowedUpdates: Array of update types to receive
 * - maxConnections: Max simultaneous connections
 * - timeout: Request timeout in ms
 */
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
console.log('Webhook status:', info.url)

// Delete webhook
await webhookClient.deleteWebhook()

// Verify incoming webhook requests
app.post('/telegram-webhook', (req, res) => {
    const secretToken = req.headers['x-telegram-bot-api-secret-token']
    
    if (!webhookClient.verifyRequest(secretToken)) {
        return res.status(401).send('Unauthorized')
    }
    
    const update = webhookClient.parseUpdate(req.body)
    if (update.message) {
        console.log('Received message:', update.message.text)
    }
    
    res.sendStatus(200)
})
```

## Smart Thread Routing

Configure automatic message routing to specific Telegram threads:

```javascript
const messageThreadIds = {
    // General fallback
    general: 9,
    
    // Hotel system
    hotel_system_search: 19,
    hotel_system_book: 23,
    
    // Hotel third-party
    hotel_third_party_search: 30,
    hotel_third_party_book: 34,
    
    // Flight system
    flight_system_search: 41,
    flight_system_book: 43,
    
    // Tour/Transfer
    tour_system_search: 51,
    transfer_system_book: 73
}
```

**Routing Logic**: `{product}_{type}_{metric}` → Falls back to `general`

Examples:
- `hotel` + `third_party` + `book` → `hotel_third_party_book` (34)
- `flight` + `system` + `search` → `flight_system_search` (41)
- Unknown combination → `general` (9)

## Usage Patterns

### Pattern 1: Pre-configured Client (Recommended)

Create a shared client for your entire project:

```javascript
// config/telegram-client.js
const { TelegramClient } = require('kien-nguyen-support')

const telegramClient = new TelegramClient({
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID,
    messageThreadIds: { /* your threads */ },
    environment: process.env.NODE_ENV || 'STAGING'
})

module.exports = telegramClient

// services/hotel-service.js
const telegram = require('../config/telegram-client')

async function bookHotel(hotelData) {
    try {
        const booking = await processHotelBooking(hotelData)
        await telegram.sendMessage({
            error_message: `✅ Hotel booking success: ${booking.id}`
        })
        return booking
    } catch (error) {
        await telegram.sendErrorAlert({
            type: 'third_party',
            error_code: 'BOOKING_FAILED',
            error_message: error.message,
            metric: 'book',
            user_email: hotelData.userEmail
        })
        throw error
    }
}
```

### Pattern 2: Service-Specific Clients

```javascript
// services/flight-service.js
const { TelegramClient } = require('kien-nguyen-support')

const flightTelegram = new TelegramClient({
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.FLIGHT_CHAT_ID, // Different chat
    product: 'flight',
    messageThreadIds: {
        flight_system_search: 31,
        flight_system_book: 33,
    },
    disableNotification: true,
})

async function searchFlights(searchData) {
    await flightTelegram.sendMessage({
        error_message: '🔍 Searching flights...'
    })
    // ... business logic
}
```

## 🆕 Enhanced Telegram Message Format

With version 1.1.0, Telegram messages now include:

### Smart ID Extraction
Automatically extracts and displays IDs in copyable code blocks:
```
🔍 **Search ID:**
```
d8e2048ba1974f568a807532752e452f
```

🔍 **Trace ID:**
```
trace-12345-abcdef
```

🔍 **Log ID:**
```
63b5c9faf56fc04fdf2509b3874cb6d4
```
```

### Rich Formatting with Emojis
- 🔧 **Environment**: `PRODUCTION`  
- 🔌 **Type**: `third_party`
- ❌ **Error Code**: `BOOKING_FAILED`
- 📝 **Message**: Error details in code blocks
- 👤 **User**: User information
- 🏢 **Supplier**: Supplier details  
- 📋 **Request Data**: Formatted JSON with proper indentation
- 🐛 **Stack Trace**: Limited to first 2 lines for readability

### Example Enhanced Message Output
```
🔧 Environment: `PRODUCTION`

🔌 Type: `third_party`
❌ Error Code: `BOOKING_FAILED`
📝 Message:
```
Failed to book hotel room
```

🔍 Search ID:
```
d8e2048ba1974f568a807532752e452f
```

📋 Request Data:
```json
{
  "adults": 2,
  "children": 0,
  "departure_date": "2025-09-29",
  "search_id": "d8e2048ba1974f568a807532752e452f"
}
```

🐛 Stack Trace:
```
BookingError: Room not available
    at bookRoom (/app/services/booking.js:145:12)
```
```

## API Reference

### Third-Party Logging

#### `saveProviderLog(options)`
Save HTTP request/response logs to organized files.

**Parameters:**
- `action` (string): Action name (e.g., 'search', 'book')
- `req` (Object|string): Request data (JSON object or XML string)
- `res` (Object|string): Response data (JSON object or XML string)
- `code` (string): Provider/supplier code (e.g., 'EXPEDIA')
- `name` (string): Operation name (e.g., 'search-hotels')

#### `saveProviderCurl(options)`
Save curl command to file for debugging.

**Parameters:**
- `name` (string): Operation name
- `request` (Object): Request object with method, url, headers, body
- `code` (string): Provider/supplier code
- `action` (string, optional): Action name

### TelegramClient Class

#### `new TelegramClient(config)`
Create a Telegram client instance.

**Config Parameters:**
- `botToken` (string, required): Telegram bot token
- `chatId` (string, required): Chat ID to send messages to
- `product` (string, optional): Default product type ('hotel', 'flight', 'tour', 'transfer')
- `environment` (string, optional): Default environment ('DEV', 'STAGING', 'PROD')
- `messageThreadIds` (Object, optional): Thread routing configuration
- `disableNotification` (boolean, optional): Disable notifications (default: false)
- `timeout` (number, optional): Request timeout in ms (default: 5000)

#### `telegram.sendMessage(options)`
Send message using error-handler.js style options parameter.

**Options Parameters:**
- `error_message` (string, required): Message text to send
- `type` (string, optional): Alert type ('system', 'third_party')
- `metric` (string, optional): Metric for thread routing
- All other fields are optional and used for metadata

#### `telegram.sendErrorAlert(options)`
Send error alert with automatic thread routing.

**Options Parameters:**
- `error_message` (string, required): Error message
- `error_code` (string, optional): Error code
- `type` (string, optional): 'system' or 'third_party' (default: 'system')
- `metric` (string, optional): Metric for thread routing (default: 'general')
- `user_email` (string, optional): User email
- `supplier` (Object, optional): Supplier info with code, id, etc.
- `request_metadata` (Object|string, optional): Request metadata
- `error_stack` (string, optional): Error stack trace (auto-truncated)
- `metadata` (Object|string, optional): Additional metadata

### Webhook Client

#### `createTelegramWebhookClient(config)`
Create a webhook client for production.

**Config Parameters:**
- `botToken` (string, required): Telegram bot token
- `webhookUrl` (string, required): Webhook URL
- `secretToken` (string, optional): Secret token for verification
- `allowedUpdates` (Array, optional): Update types to receive
- `maxConnections` (number, optional): Max connections
- `timeout` (number, optional): Request timeout

## Multi-Product Support

The package supports multiple products with automatic thread routing:

### Supported Products
- **hotel**: Hotel bookings and searches
- **flight**: Flight bookings, PNR generation, e-tickets
- **tour**: Tour packages and bookings  
- **transfer**: Airport transfers and transportation

### Supported Metrics

**Hotel**: `search`, `prebook`, `book`, `cancel`
**Flight**: `search`, `confirm_tax`, `generate_pnr`, `generate_eticket`, `cancel`
**Tour**: `search`, `book`, `cancel`
**Transfer**: `search`, `book`, `cancel`

## License

ISC

## Author

nguyenkien2022001@gmail.com

## Repository

https://github.com/Trungkien2022001/kien-nguyen-support