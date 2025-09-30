# Kien Nguyen Support

A comprehensive multi-channel alert system and utilities package for logging, notifications, and webhook management with enhanced formatting and smart routing.

## Installation

```bash
npm install kien-nguyen-support
```

## 🆕 Version 2.2.0 Features

- **� MultiChannelAlert**: Send alerts to multiple channels simultaneously (Telegram, Slack, Mattermost, Email, etc.)
- **🎯 Logger-Style API**: Clean constructor pattern with `.error()`, `.info()`, `.warn()`, `.success()` methods
- **�🔍 Smart ID Extraction**: Automatically extract and display IDs in copyable code blocks
- **📝 Enhanced Formatting**: Rich formatting with emojis, proper JSON display, and truncated stack traces
- **⚙️ Conditional Channels**: Initialize only channels with available configurations
- **🔄 Dynamic Management**: Add/remove channels at runtime with graceful error handling

## ⚡ Performance & Optimization

- **Zero Dependencies**: No external runtime dependencies - uses only Node.js built-ins
- **85% Smaller Package**: Reduced from ~585KB to ~85KB by replacing axios & moment.js
- **Native HTTP Client**: Custom implementation with axios-compatible API
- **Custom DateTime Utils**: Native Date formatting without external libraries
- **Fast Installation**: No dependency resolution or security vulnerabilities
- **Production Ready**: Lightweight, secure, and maintainable

## 4 Core Features

- 📝 **Third-Party Log**: Save HTTP request/response logs and curl commands
- 🚨 **Multi-Channel Alerts**: Send notifications to Telegram, Slack, Mattermost, Email and more
- 🔗 **Telegram Webhook**: Production webhook management with fallback
- 🎯 **Smart Routing**: Automatic thread/channel routing based on service and environment

## Quick Start

```javascript
const { 
    MultiChannelAlert, 
    TelegramAlert, 
    SlackAlert, 
    saveProviderLog, 
    createTelegramWebhookClient 
} = require('kien-nguyen-support')

// Feature 1: Multi-Channel Alerts (NEW in v2.0.0)
const multiAlert = new MultiChannelAlert({
    channels: [
        {
            type: 'telegram',
            config: {
                botToken: process.env.TELEGRAM_BOT_TOKEN,
                chatId: process.env.TELEGRAM_CHAT_ID,
                service: 'hotel'
            }
        },
        {
            type: 'slack',
            config: {
                webhookUrl: process.env.SLACK_WEBHOOK_URL,
                service: 'hotel'
            }
        }
    ],
    environment: 'PRODUCTION'
})

// Send to all channels at once
await multiAlert.error({
    user_id: '123',
    booking_id: 'BK456',
    error_code: 'PAYMENT_FAILED',
    message: 'Payment processing failed'
})

// Feature 2: Individual Alert Channels
const telegram = new TelegramAlert({
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID,
    service: 'hotel'
})
await telegram.error({ error_message: 'Hello from Telegram!' })

// Feature 3: Third-Party Logging
await saveProviderLog({
    action: 'search',
    req: requestData,
    res: responseData,
    code: 'EXPEDIA',
    name: 'search-hotels'
})

// Feature 4: Telegram Webhook
const webhook = createTelegramWebhookClient({ /* config */ })
await webhook.setWebhook()
```

## Feature 1: Multi-Channel Alerts 🚀

Send alerts to multiple platforms simultaneously with a single command.

### MultiChannelAlert Class (NEW)

```javascript
const { MultiChannelAlert } = require('kien-nguyen-support')

// Initialize with multiple channels
const multiAlert = new MultiChannelAlert({
    channels: [
        {
            type: 'telegram',
            config: {
                botToken: 'your-bot-token',
                chatId: 'your-chat-id',
                service: 'hotel'
            }
        },
        {
            type: 'mattermost',
            config: {
                url: 'https://mattermost.example.com',
                token: 'access-token',
                chatId: 'channel-id',
                service: 'hotel'
            }
        },
        {
            type: 'slack',
            config: {
                webhookUrl: 'https://hooks.slack.com/...',
                service: 'hotel'
            }
        },
        {
            type: 'email',
            config: {
                host: 'smtp.gmail.com',
                port: 587,
                auth: {
                    user: 'alerts@company.com',
                    pass: 'app-password'
                },
                from: 'alerts@company.com',
                to: 'team@company.com',
                service: 'hotel'
            }
        }
    ],
    service: 'hotel',
    environment: 'PRODUCTION',
    failSilently: true  // Continue if some channels fail
})

// Send alerts using logger-style methods
await multiAlert.error({
    user_id: '123',
    booking_id: 'BK456',
    error_code: 'PAYMENT_FAILED',
    message: 'Payment processing failed',
    amount: 150,
    currency: 'USD'
})

await multiAlert.info({
    deployment: 'v2.0.0',
    status: 'success',
    message: 'Deployment completed successfully'
})

await multiAlert.warn({
    cpu_usage: '85%',
    memory_usage: '78%',
    message: 'High resource usage detected'
})

await multiAlert.success({
    payment_id: 'PAY123',
    amount: 150,
    message: 'Payment processed successfully'
})
```

### Conditional Channel Initialization

Only initialize channels that have available configuration:

```javascript
const channels = []

// Add Telegram if configured
if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    channels.push({
        type: 'telegram',
        config: {
            botToken: process.env.TELEGRAM_BOT_TOKEN,
            chatId: process.env.TELEGRAM_CHAT_ID,
            service: 'hotel'
        }
    })
}

// Add Slack if configured
if (process.env.SLACK_WEBHOOK_URL) {
    channels.push({
        type: 'slack',
        config: {
            webhookUrl: process.env.SLACK_WEBHOOK_URL,
            service: 'hotel'
        }
    })
}

// Add Mattermost if configured
if (process.env.MATTERMOST_URL && process.env.MATTERMOST_TOKEN) {
    channels.push({
        type: 'mattermost',
        config: {
            url: process.env.MATTERMOST_URL,
            token: process.env.MATTERMOST_TOKEN,
            chatId: process.env.MATTERMOST_CHAT_ID,
            service: 'hotel'
        }
    })
}

const multiAlert = new MultiChannelAlert({
    channels,
    service: 'hotel',
    environment: 'PRODUCTION'
})

// This will only send to channels that were successfully initialized
const result = await multiAlert.error({ message: 'Test error' })
console.log(`Sent to ${result.summary.successful}/${result.summary.total} channels`)
```

### Individual Alert Classes

You can also use individual alert classes directly:

#### 1. TelegramAlert

**Setup Requirements:**
1. Create a Telegram Bot:
   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Send `/newbot` and follow instructions
   - Get your `botToken`

2. Get Chat ID:
   - Add your bot to a group/channel
   - Send a message to the group
   - Visit `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find `chat.id` in the response

```javascript
const { TelegramAlert } = require('kien-nguyen-support')

const telegram = new TelegramAlert({
    botToken: 'your-bot-token',        // From @BotFather
    chatId: 'your-chat-id',           // From getUpdates API
    service: 'hotel',                 // For thread routing
    environment: 'PRODUCTION',        // Environment context
    messageThreadIds: {               // Optional: thread routing
        'hotel.error.all': 30,
        'hotel.info.all': 31,
        general: 9
    }
})

await telegram.error({ message: 'Error occurred' })
```

#### 2. SlackAlert

**Setup Requirements:**
1. Create a Slack App:
   - Go to [api.slack.com/apps](https://api.slack.com/apps)
   - Click "Create New App"
   - Choose "From scratch"

2. Enable Incoming Webhooks:
   - Go to "Incoming Webhooks" in your app settings
   - Toggle "Activate Incoming Webhooks" to On
   - Click "Add New Webhook to Workspace"
   - Select channel and copy webhook URL

```javascript
const { SlackAlert } = require('kien-nguyen-support')

const slack = new SlackAlert({
    webhookUrl: 'https://hooks.slack.com/services/...',  // From Slack App
    service: 'hotel',                                    // For channel routing
    environment: 'PRODUCTION',                           // Environment context
    channels: {                                          // Optional: channel routing
        'hotel.error.all': '#hotel-errors',
        'hotel.info.all': '#hotel-info',
        general: '#general'
    }
})

await slack.error({ message: 'Error occurred' })
```

#### 3. MattermostAlert

**Setup Requirements:**
1. Create Personal Access Token:
   - Go to Mattermost → Account Settings → Security
   - Click "Create New Token"
   - Give it a description and copy the token

2. Get Channel ID:
   - Go to channel → View Info → Copy channel ID
   - Or use channel name (e.g., "town-square")

```javascript
const { MattermostAlert } = require('kien-nguyen-support')

const mattermost = new MattermostAlert({
    url: 'https://your-mattermost.com',      // Mattermost server URL
    token: 'your-access-token',              // Personal access token
    chatId: 'channel-id-or-name',           // Channel ID or name
    service: 'hotel',                        // For channel routing
    environment: 'PRODUCTION'                // Environment context
})

await mattermost.error({ message: 'Error occurred' })
```

#### 4. EmailAlert

**Setup Requirements:**
1. SMTP Configuration (Gmail example):
   - Enable 2FA on Gmail
   - Generate App Password: Account → Security → App passwords
   - Use app password (not your regular password)

```javascript
const { EmailAlert } = require('kien-nguyen-support')

const email = new EmailAlert({
    host: 'smtp.gmail.com',              // SMTP host
    port: 587,                           // SMTP port
    secure: false,                       // Use TLS
    auth: {
        user: 'your-email@gmail.com',    // Your email
        pass: 'your-app-password'        // Gmail app password (not regular password)
    },
    from: 'alerts@company.com',          // From address
    to: 'team@company.com',              // To address(es)
    service: 'hotel',                    // For subject line
    environment: 'PRODUCTION'            // Environment context
})

await email.error({ message: 'Error occurred' })
```

#### 5. DiscordAlert

**Setup Requirements:**
1. Create Discord Webhook:
   - Go to Discord channel → Settings → Integrations
   - Click "Create Webhook"
   - Copy webhook URL

```javascript
const { DiscordAlert } = require('kien-nguyen-support')

const discord = new DiscordAlert({
    webhookUrl: 'https://discord.com/api/webhooks/...',  // Discord webhook URL
    service: 'hotel',                                     // For embed title
    environment: 'PRODUCTION'                            // Environment context
})

await discord.error({ message: 'Error occurred' })
```

#### 6. ZaloAlert

**Setup Requirements:**
1. Create Zalo OA (Official Account):
   - Go to [developers.zalo.me](https://developers.zalo.me)
   - Create Official Account
   - Get access token from OA settings

2. Get User ID:
   - User must follow your OA
   - Use Zalo API to get follower user IDs

```javascript
const { ZaloAlert } = require('kien-nguyen-support')

const zalo = new ZaloAlert({
    accessToken: 'your-oa-access-token',     // OA access token
    userId: 'user-id',                       // Zalo user ID
    service: 'hotel',                        // For message context
    environment: 'PRODUCTION'                // Environment context
})

await zalo.error({ message: 'Error occurred' })
```

#### 7. MessengerAlert

**Setup Requirements:**
1. Create Facebook App:
   - Go to [developers.facebook.com](https://developers.facebook.com)
   - Create new app → Business
   - Add Messenger product

2. Get Page Access Token:
   - Go to Messenger → Settings
   - Generate page access token
   - Get recipient PSID from webhook events

```javascript
const { MessengerAlert } = require('kien-nguyen-support')

const messenger = new MessengerAlert({
    pageAccessToken: 'your-page-access-token',   // Facebook page access token
    recipientId: 'user-psid',                    // User's PSID
    service: 'hotel',                            // For message context
    environment: 'PRODUCTION'                    // Environment context
})

await messenger.error({ message: 'Error occurred' })
```

#### 8. N8nAlert

**Setup Requirements:**
1. Create N8n Webhook:
   - In N8n workflow, add "Webhook" node
   - Set HTTP Method to POST
   - Copy the webhook URL

```javascript
const { N8nAlert } = require('kien-nguyen-support')

const n8n = new N8nAlert({
    webhookUrl: 'https://your-n8n.com/webhook/...',     // N8n webhook URL
    service: 'hotel',                                    // For workflow context
    environment: 'PRODUCTION'                           // Environment context
})

await n8n.error({ message: 'Error occurred' })
```

## Feature 2: Third-Party Log (HTTP Request Logging)

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

## Feature 3: Telegram Bot (Legacy - Backward Compatibility)

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

## Feature 4: Telegram Webhook (Production Setup)

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

### Pattern 1: Multi-Channel Alert System (Recommended)

Create a shared multi-channel client for your entire project:

```javascript
// config/alert-client.js
const { MultiChannelAlert } = require('kien-nguyen-support')

// Initialize channels based on available environment variables
const channels = []

if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    channels.push({
        type: 'telegram',
        config: {
            botToken: process.env.TELEGRAM_BOT_TOKEN,
            chatId: process.env.TELEGRAM_CHAT_ID,
            service: 'hotel'
        }
    })
}

if (process.env.SLACK_WEBHOOK_URL) {
    channels.push({
        type: 'slack',
        config: {
            webhookUrl: process.env.SLACK_WEBHOOK_URL,
            service: 'hotel'
        }
    })
}

if (process.env.MATTERMOST_URL && process.env.MATTERMOST_TOKEN) {
    channels.push({
        type: 'mattermost',
        config: {
            url: process.env.MATTERMOST_URL,
            token: process.env.MATTERMOST_TOKEN,
            chatId: process.env.MATTERMOST_CHAT_ID,
            service: 'hotel'
        }
    })
}

const alertClient = new MultiChannelAlert({
    channels,
    service: 'hotel',
    environment: process.env.NODE_ENV || 'STAGING',
    failSilently: true
})

module.exports = alertClient

// services/hotel-service.js
const alertClient = require('../config/alert-client')

async function bookHotel(hotelData) {
    try {
        const booking = await processHotelBooking(hotelData)
        
        // Success alert to all channels
        await alertClient.success({
            booking_id: booking.id,
            user_email: hotelData.userEmail,
            amount: booking.amount,
            currency: booking.currency,
            message: `Hotel booking successful: ${booking.id}`
        })
        
        return booking
    } catch (error) {
        // Error alert to all channels
        await alertClient.error({
            error_code: 'BOOKING_FAILED',
            message: error.message,
            user_email: hotelData.userEmail,
            booking_data: hotelData,
            error_stack: error.stack
        })
        
        throw error
    }
}
```

### Pattern 2: Service-Specific Alert Clients

```javascript
// services/flight-service.js
const { TelegramAlert, SlackAlert } = require('kien-nguyen-support')

// Flight-specific Telegram alerts
const flightTelegram = new TelegramAlert({
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.FLIGHT_CHAT_ID,
    service: 'flight',
    environment: 'PRODUCTION',
    messageThreadIds: {
        'flight.error.all': 31,
        'flight.info.all': 33,
        general: 9
    }
})

// Flight-specific Slack alerts
const flightSlack = new SlackAlert({
    webhookUrl: process.env.FLIGHT_SLACK_WEBHOOK,
    service: 'flight',
    channels: {
        'flight.error.all': '#flight-errors',
        'flight.info.all': '#flight-info'
    }
})

async function searchFlights(searchData) {
    try {
        await flightTelegram.info({
            action: 'search_start',
            message: 'Flight search initiated',
            search_data: searchData
        })
        
        const results = await performFlightSearch(searchData)
        
        await flightSlack.success({
            action: 'search_complete',
            message: `Found ${results.length} flights`,
            search_id: searchData.search_id,
            results_count: results.length
        })
        
        return results
    } catch (error) {
        // Send error to both Telegram and Slack
        await Promise.allSettled([
            flightTelegram.error({
                error_code: 'SEARCH_FAILED',
                message: error.message,
                search_data: searchData
            }),
            flightSlack.error({
                error_code: 'SEARCH_FAILED',
                message: error.message,
                search_data: searchData
            })
        ])
        
        throw error
    }
}
```

## 🆕 Enhanced Multi-Channel Message Format

With version 2.0.0, all alert channels now include:

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

### Multi-Channel Alerts

#### `new MultiChannelAlert(config)`
Create a multi-channel alert instance.

**Config Parameters:**
- `channels` (Array, required): Array of channel configurations
- `service` (string, optional): Default service name ('hotel', 'flight', 'tour', 'transfer')
- `environment` (string, optional): Default environment ('DEV', 'STAGING', 'PRODUCTION')
- `failSilently` (boolean, optional): Don't throw errors if some channels fail (default: true)

**Channel Configuration:**
```javascript
{
    type: 'telegram',           // Channel type (required)
    config: {                   // Channel-specific config (required)
        // Channel-specific parameters
        botToken: 'token',
        chatId: 'chat-id',
        service: 'hotel',       // Inherits from main config if not provided
        environment: 'PROD'     // Inherits from main config if not provided
    }
}
```

#### Logger Methods
```javascript
// Error alert (red/urgent styling)
await multiAlert.error(data)

// Info alert (blue/informational styling)
await multiAlert.info(data)

// Warning alert (yellow/caution styling)
await multiAlert.warn(data)

// Success alert (green/positive styling)
await multiAlert.success(data)
```

#### Management Methods
```javascript
// Get channel information
multiAlert.getChannels()          // Array of channel info
multiAlert.getChannelCount()      // Number of channels
multiAlert.hasChannel('telegram') // Check if type exists

// Dynamic management
multiAlert.addChannel(config)     // Add new channel
multiAlert.removeChannel('slack') // Remove by type
```

#### Response Format
```javascript
{
    success: true,              // True if at least 1 channel succeeded
    results: [                  // Array of individual results
        {
            type: 'telegram',
            success: true,
            result: { /* telegram response */ }
        },
        {
            type: 'slack',
            success: false,
            error: 'Webhook URL invalid'
        }
    ],
    errors: [                   // Array of failed channels
        {
            type: 'slack',
            success: false,
            error: 'Webhook URL invalid'
        }
    ],
    summary: {                  // Summary statistics
        total: 2,
        successful: 1,
        failed: 1
    }
}
```

### Individual Alert Classes

#### `new TelegramAlert(config)`
**Required Config:**
- `botToken` (string): Telegram bot token from @BotFather
- `chatId` (string): Chat/channel ID where messages will be sent

**Optional Config:**
- `service` (string): Service name for routing ('hotel', 'flight', etc.)
- `environment` (string): Environment context ('DEV', 'STAGING', 'PRODUCTION')
- `messageThreadIds` (Object): Thread routing configuration
- `beauty` (boolean): Enable rich formatting (default: true)
- `timeout` (number): Request timeout in ms (default: 10000)

#### `new SlackAlert(config)`
**Required Config:**
- `webhookUrl` (string): Slack webhook URL from app configuration

**Optional Config:**
- `channel` (string): Override channel from webhook
- `service` (string): Service name for routing
- `environment` (string): Environment context
- `channels` (Object): Channel routing configuration
- `beauty` (boolean): Enable rich formatting (default: true)

#### `new MattermostAlert(config)`
**Required Config:**
- `url` (string): Mattermost server URL
- `token` (string): Personal access token
- `chatId` (string): Channel ID or name

**Optional Config:**
- `service` (string): Service name for routing
- `environment` (string): Environment context

#### `new EmailAlert(config)`
**Required Config:**
- `host` (string): SMTP server host
- `port` (number): SMTP server port
- `auth.user` (string): SMTP username
- `auth.pass` (string): SMTP password/app password
- `from` (string): From email address
- `to` (string|Array): Recipient email address(es)

**Optional Config:**
- `secure` (boolean): Use SSL/TLS (default: false for port 587)
- `service` (string): Service name for subject line
- `environment` (string): Environment context

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

## Multi-Channel Support

### Supported Alert Channels (v2.0.0)

- **TelegramAlert**: Send alerts to Telegram chats/channels with thread routing
- **SlackAlert**: Send alerts to Slack channels with rich formatting
- **MattermostAlert**: Send alerts to Mattermost channels
- **EmailAlert**: Send HTML/text email alerts via SMTP
- **DiscordAlert**: Send alerts to Discord channels via webhooks
- **ZaloAlert**: Send alerts via Zalo Official Account
- **MessengerAlert**: Send alerts via Facebook Messenger
- **N8nAlert**: Trigger N8n workflows with alert data
- **WhatsAppAlert**: Send alerts via WhatsApp Business API
- **LineAlert**: Send alerts via Line Notify API
- **ViberAlert**: Send alerts via Viber Bot API
- **SkypeAlert**: Send alerts via Skype Bot Framework
- **WeChatAlert**: Send alerts via WeChat Work webhook
- **RocketChatAlert**: Send alerts to Rocket.Chat channels
- **FirebaseAlert**: Send push notifications via Firebase Cloud Messaging
- **MultiChannelAlert**: Send to multiple channels simultaneously

### Service Types
- **hotel**: Hotel bookings and searches
- **flight**: Flight bookings, PNR generation, e-tickets
- **tour**: Tour packages and bookings  
- **transfer**: Airport transfers and transportation

### Alert Types (Logger Methods)
- **error()**: Error alerts with red/urgent styling
- **info()**: Informational alerts with blue styling
- **warn()**: Warning alerts with yellow/caution styling
- **success()**: Success alerts with green/positive styling

### Environment Types
- **DEV**: Development environment
- **STAGING**: Staging/testing environment
- **PRODUCTION**: Production environment

## Version History

- **v2.0.0** (2025-09-29): Multi-channel alert system, logger-style API, conditional channels
- **v1.1.1** (2025): Enhanced Telegram formatting, smart ID extraction
- **v1.0.0** (2025): Initial release with Telegram bot and logging

## Best Practices

### 1. Use MultiChannelAlert for New Projects
```javascript
// ✅ Recommended - Multi-channel approach
const { MultiChannelAlert } = require('kien-nguyen-support')
const alert = new MultiChannelAlert({ channels: [...] })
await alert.error(data)

// ❌ Avoid - Manual individual calls
await telegramAlert.error(data)
await slackAlert.error(data)
await emailAlert.error(data)
```

### 2. Conditional Channel Setup
```javascript
// ✅ Only initialize channels with available config
const channels = []
if (process.env.TELEGRAM_BOT_TOKEN) channels.push({...})
if (process.env.SLACK_WEBHOOK_URL) channels.push({...})

// ❌ Don't hardcode all channels
const channels = [telegram, slack, email] // Some might fail
```

### 3. Use Environment Variables
```javascript
// ✅ Use environment-specific configurations
const alert = new MultiChannelAlert({
    channels: [...],
    environment: process.env.NODE_ENV || 'STAGING',
    failSilently: process.env.NODE_ENV === 'production'
})
```

### 4. Handle Errors Gracefully
```javascript
// ✅ Check results and handle failures
const result = await multiAlert.error(data)
if (result.summary.failed > 0) {
    console.warn(`${result.summary.failed} channels failed to send alert`)
}

// ✅ Use failSilently in production
const alert = new MultiChannelAlert({
    failSilently: true  // Don't break app if alerts fail
})
```

## Troubleshooting

### Common Issues

**1. "Unable to resolve path to module" error:**
```bash
# Make sure package is installed
npm install kien-nguyen-support

# Check import path
const { MultiChannelAlert } = require('kien-nguyen-support')
```

**2. Telegram "Unauthorized" error:**
- Check bot token is correct
- Ensure bot is added to the chat/channel
- Verify chat ID format (numbers for groups, @channel for channels)

**3. Slack "Invalid webhook URL" error:**
- Regenerate webhook URL from Slack app settings
- Ensure webhook is activated for correct channel

**4. Email SMTP errors:**
- Use app passwords for Gmail (not regular password)
- Check firewall/network allows SMTP traffic
- Verify port (587 for TLS, 465 for SSL)

**5. MultiChannelAlert some channels failing:**
- Enable `failSilently: true` to continue on errors
- Check individual channel configurations
- Review error details in response.errors array

### Getting Help

- 📖 Check examples in `/examples` directory
- 🐛 Report bugs: [GitHub Issues](https://github.com/Trungkien2022001/kien-nguyen-support/issues)
- 📧 Email: nguyenkien2022001@gmail.com

## License

ISC

## Author

nguyenkien2022001@gmail.com

## Repository

https://github.com/Trungkien2022001/kien-nguyen-support