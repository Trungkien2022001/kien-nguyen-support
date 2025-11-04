# 🚨 MultiChannelAlert

<div align="center">
  <h2>🎯 The Ultimate Multi-Channel Alert & Notification System</h2>
  <p><strong>Send alerts to 15+ platforms simultaneously with zero dependencies!</strong></p>
  <p>📦 <strong>NPM Package:</strong> <a href="https://www.npmjs.com/package/@kien2k1/multi-channel-alert">@kien2k1/multi-channel-alert</a></p>
</div>

## 📱 Supported Platforms

<div align="center">
  <p>
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg" width="40" height="40" alt="Slack" title="Slack"/>
    &nbsp;&nbsp;
    <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" width="40" height="40" alt="Telegram" title="Telegram"/>
    &nbsp;&nbsp;
    <img src="https://www.mattermost.com/wp-content/uploads/2022/02/icon.png" width="40" height="40" alt="Mattermost" title="Mattermost"/>
    &nbsp;&nbsp;
    <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/discord-square-color-icon.png" width="40" height="40" alt="Discord" title="Discord"/>
    &nbsp;&nbsp;
    <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png" width="40" height="40" alt="Email" title="Email/Gmail"/>
    &nbsp;&nbsp;
    <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" width="40" height="40" alt="Messenger" title="Facebook Messenger"/>
    &nbsp;&nbsp;
    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" width="40" height="40" alt="WhatsApp" title="WhatsApp"/>
    &nbsp;&nbsp;
    <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" width="40" height="40" alt="GitHub" title="GitHub (via N8n)"/>
  </p>
  <p>
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/100px-Icon_of_Zalo.svg.png" width="40" height="40" alt="Zalo" title="Zalo"/>
    &nbsp;&nbsp;
    <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" width="40" height="40" alt="LINE" title="LINE"/>
    &nbsp;&nbsp;
    <img src="https://upload.wikimedia.org/wikipedia/commons/7/76/Viber.png?20210524155044" width="40" height="40" alt="Viber" title="Viber"/>
    &nbsp;&nbsp;
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Skype_logo_%282019%E2%80%93present%29.svg/1187px-Skype_logo_%282019%E2%80%93present%29.svg.png" width="40" height="40" alt="Skype" title="Skype"/>
    &nbsp;&nbsp;
    <img src="https://www.shareicon.net/data/128x128/2017/02/01/877517_media_512x512.png" width="40" height="40" alt="WeChat" title="WeChat"/>
    &nbsp;&nbsp;
    <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/RocketChat_Logo_1024x1024.png?20160424202046" width="40" height="40" alt="RocketChat" title="RocketChat"/>
    &nbsp;&nbsp;
    <img src="https://brandlogos.net/wp-content/uploads/2025/03/firebase_icon-logo_brandlogos.net_tcvck.png" width="40" height="40" alt="Firebase" title="Firebase"/>
    &nbsp;&nbsp;
    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/N8n_logo.png?20210707053626" width="40" height="40" alt="N8n" title="N8n Webhooks"/>
  </p>
</div>

---

A comprehensive **MultiChannelAlert system** and utilities package for logging, notifications, and webhook management with enhanced formatting and smart routing.

## Installation

```bash
npm install @kien2k1/multi-channel-alert
```

### 📦 Package Information
- **Package Name:** `@kien2k1/multi-channel-alert`
- **Version:** `1.0.7`
- **Size:** 59.8 kB (343.7 kB unpacked)
- **Dependencies:** Zero runtime dependencies
- **NPM Registry:** https://www.npmjs.com/package/@kien2k1/multi-channel-alert

## 🌟 Why MultiChannelAlert?

<div align="center">
  <table>
    <tr>
      <td align="center">
        <h3>🚀 Before</h3>
        <p>Multiple libraries, complex setup</p>
        <code>
          telegram-bot-api<br/>
          + @slack/web-api<br/>
          + discord.js<br/>
          + nodemailer<br/>
          + whatsapp-web.js<br/>
          = 50+ dependencies
        </code>
      </td>
      <td align="center">
        <h3>✨ After</h3>
        <p>One simple import, zero dependencies</p>
        <code>
          const { MultiChannelAlert }<br/>
          = require('@kien2k1/multi-channel-alert')<br/>
          <br/>
          // Send to 15+ platforms<br/>
          multiAlert.error('Alert!')<br/>
          = ZERO dependencies
        </code>
      </td>
    </tr>
  </table>
</div>

## 🚨 MultiChannelAlert - Core Features

<div align="center">
  <h3>🎯 ONE API → 15+ PLATFORMS</h3>
  <p><em>"Write once, alert everywhere!"</em></p>
</div>

### 🌟 Key Highlights

- **🚨 MultiChannelAlert**: Send alerts to **15+ platforms simultaneously** (Telegram, Slack, Mattermost, Discord, Email, WhatsApp, Zalo, LINE, Viber, Skype, WeChat, RocketChat, Firebase, N8n, Messenger)
- **🎯 Logger-Style API**: Clean constructor pattern with `.error()`, `.info()`, `.warn()`, `.success()` methods
- **🔍 Smart ID Extraction**: Automatically extract and display IDs in copyable code blocks
- **📝 Enhanced Formatting**: Rich formatting with emojis, proper JSON display, platform-specific markdown, and code blocks for curl commands
- **⚙️ Conditional Channels**: Initialize only channels with available configurations
- **🔄 Dynamic Management**: Add/remove channels at runtime with graceful error handling
- **🎛️ Individual StrictMode**: Filter data per channel with `strictMode` parameter for sensitive data protection
- **📊 Configuration Inheritance**: Channel-specific settings override global configurations
- **🎨 Cross-Platform Formatting**: Consistent rich formatting across Telegram (Markdown), Mattermost (Markdown), Slack (Blocks), Discord (Embeds)

## ⚡ Performance & Optimization

- **Zero Dependencies**: No external runtime dependencies - uses only Node.js built-ins
- **85% Smaller Package**: Reduced from ~585KB to ~85KB by replacing axios & moment.js
- **Native HTTP Client**: Custom implementation with axios-compatible API
- **Custom DateTime Utils**: Native Date formatting without external libraries
- **Fast Installation**: No dependency resolution or security vulnerabilities
- **Production Ready**: Lightweight, secure, and maintainable

## 📱 Live Demo Screenshots

### Demo with Telegram and Mattermost
Real-time alerts with rich formatting, ID extraction, and smart routing:

<div align="center" style="padding: 0 20px;">
  <img src="http://res.cloudinary.com/trungkien2022001/image/upload/v1759311010/upload/ccphpfenl4k5bdrgxw14.png" alt="Telegram Error Alert" width="350"/>
  <img src="http://res.cloudinary.com/trungkien2022001/image/upload/v1759310992/upload/y59vvrocvng90elwuipr.png" alt="Telegram System Alert" width="350"/>
  <br/>
  <img src="http://res.cloudinary.com/trungkien2022001/image/upload/v1759310923/upload/brcgfxw2pud8nzkybegt.png" alt="Mattermost Alert Demo" width="350"/>
</div>

*Live examples showing enhanced formatting, automatic ID extraction, and multi-channel broadcasting*


## 🎯 4 Core Features

- 🚨 **MultiChannelAlert System**: Send notifications to **15+ platforms** simultaneously - Telegram, Slack, Mattermost, Discord, Email, WhatsApp, Zalo, LINE, Viber, Skype, WeChat, RocketChat, Firebase, N8n, Messenger
- 📝 **Third-Party Log**: Save HTTP request/response logs and curl commands with provider-specific formatting
- 🔗 **Telegram Webhook**: Production webhook management with fallback and auto-recovery
- 🎯 **Smart Routing**: Automatic thread/channel routing based on service and environment using nested object access

## ⚡ 30-Second Demo

```javascript
// 🚨 ONE LINE → 15+ PLATFORMS
const multiAlert = new MultiChannelAlert({
    channels: [
        { type: 'telegram', config: { /* telegram config */ } },
        { type: 'slack', config: { /* slack config */ } },
        { type: 'discord', config: { /* discord config */ } },
        { type: 'email', config: { /* email config */ } },
        // ... add 11+ more platforms
    ]
})

// Send error alert to ALL channels simultaneously ⚡
multiAlert.error('Payment system down!', { 
    userId: 'U123456', 
    amount: 999.99 
})

// Result: 15+ notifications sent instantly! 🎉
```

<div align="center">
  <h4>🔥 <strong>15+ Platforms</strong> • <strong>Zero Dependencies</strong> • <strong>One Simple API</strong> 🔥</h4>
</div>

## 🎛️ Advanced Data Filtering & Formatting

### 📊 StrictMode Data Filtering

Control exactly which data fields are sent to each platform:

```javascript
const multiAlert = new MultiChannelAlert({
    channels: [
        {
            type: 'telegram',
            config: { 
                botToken: 'your-token',
                chatId: 'your-chat-id',
                strictMode: true  // Enable filtering for this channel
            }
        },
        {
            type: 'mattermost', 
            config: {
                apiUrl: 'your-api-url',
                token: 'your-token',
                channelId: 'your-channel-id'
                // No strictMode - will send all data
            }
        }
    ],
    specific: [
        { key: 'user', title: '👤 User', markdown: true },
        { key: 'method', title: '📨 Method', markdown: true },
        { key: 'status', title: '📊 Status', markdown: true },
        { key: 'error_code', title: '🔴 Error Code', markdown: true },
        { key: 'curl', title: '💻 cURL Command', markdown: true }
    ],
    strictMode: false  // Global setting (can be overridden per channel)
})

// Full data object
const alertData = {
    user: 'john_doe',
    method: 'POST',
    status: 500,
    error_code: 'DB_CONNECTION_FAILED',
    curl: 'curl -X POST https://api.example.com/users',
    internal_debug: 'This sensitive data',  // Won't be sent if strictMode=true
    server_logs: 'Internal server information'
}

// Telegram will only receive: user, method, status, error_code, curl
// Mattermost will receive all fields (including internal_debug, server_logs)
await multiAlert.error(alertData)
```

### 🎨 Enhanced Message Formatting

Rich formatting with platform-specific optimizations:

**Telegram Output:**
```
**👤 User:**
```
john_doe
```

**📨 Method:**
```
POST
```

**💻 cURL Command:**
```
curl -X POST https://api.example.com/users
```
```

**Mattermost Output:**
```
------------------------
[From Mattermost Bot Alert]
🚨 Environment: PRODUCTION
**👤 User:** `john_doe`
**📨 Method:** `POST`
**💻 cURL Command:**
```bash
curl -X POST https://api.example.com/users
```
------------------------
```

### 🔧 Individual Component StrictMode

Use individual alert components with their own filtering:

```javascript
// Individual components with their own strictMode
const telegramAlert = new TelegramAlert({
    botToken: 'your-token',
    chatId: 'your-chat-id',
    strictMode: true  // This component will filter data
})

const slackAlert = new SlackAlert({
    webhookUrl: 'your-webhook-url'
    // No strictMode - sends all data
})

// Same data, different filtering per component
const data = { user: 'john', secret: 'hidden', method: 'POST' }
const specific = [{ key: 'user', title: '👤 User' }, { key: 'method', title: '📨 Method' }]

await telegramAlert.error(data)  // Only sends: user, method (if specific is provided)
await slackAlert.error(data)     // Sends all: user, secret, method
```

## Quick Start

```javascript
const { 
    MultiChannelAlert, 
    TelegramAlert, 
    SlackAlert, 
    saveProviderLog, 
    createTelegramWebhookClient 
} = require('@kien2k1/multi-channel-alert')

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
const { MultiChannelAlert } = require('@kien2k1/multi-channel-alert')

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
    failSilently: true,  // Continue if some channels fail
    healthCheck: true,   // 🏥 NEW: Send hello message to test all channels
    healthCheckMessage: '🚀 Service Started - Health Check'  // 🆕 Custom health check message
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

#### 🎯 Configuration Inheritance & Data Filtering (NEW)

MultiChannelAlert now supports advanced configuration inheritance and data filtering:

```javascript
const multiAlert = new MultiChannelAlert({
    // Global configuration
    service: 'flight',
    environment: 'PRODUCTION',
    beauty: true,
    specific: [
        { field: 'error', markdown: false },
        { field: 'message', markdown: true }
    ],
    strictMode: true, // Enable data filtering
    
    channels: [
        {
            type: 'telegram',
            config: {
                botToken: 'bot-token',
                chatId: 'chat-id',
                // Channel overrides: add timestamp field
                specific: [
                    { field: 'error', markdown: false },
                    { field: 'message', markdown: true },
                    { field: 'timestamp', markdown: false }
                ]
            }
        },
        {
            type: 'slack',
            config: {
                webhookUrl: 'webhook-url'
                // Uses global specific: only error + message
            }
        }
    ]
})

// Test data with many fields
const alertData = {
    error: 'Flight API timeout',
    message: 'Booking system down',
    timestamp: '2024-01-01T10:00:00Z',
    userId: 'user123',           // Will be filtered out
    sessionId: 'session456',     // Will be filtered out
    metadata: { extra: 'info' }  // Will be filtered out
}

await multiAlert.error(alertData)
// ✅ Telegram receives: error, message, timestamp (3 fields)
// ✅ Slack receives: error, message (2 fields)
// ❌ Other fields filtered out due to strictMode: true
```

**Configuration Inheritance Rules:**
- **Channel config** overrides **Global config** overrides **Default values**
- `strictMode: true` → Only fields in `specific[]` are sent
- `strictMode: false` → All fields are sent regardless of `specific[]`
- Channel-level `specific[]` overrides global `specific[]`

**Benefits:**
- 🎯 **Selective Logging**: Only log relevant fields per channel
- 🔒 **Data Privacy**: Filter sensitive fields from certain channels  
- ⚡ **Performance**: Reduce message size by filtering unnecessary data
- 🎛️ **Flexibility**: Different field sets per channel type

### 🏥 Health Check Feature (NEW in v1.0.3)

Test all channels connectivity automatically or manually:

```javascript
// 🏥 Automatic health check on initialization with custom message
const multiAlert = new MultiChannelAlert({
    channels: [
        { type: 'telegram', config: { botToken: 'xxx', chatId: 'yyy' } },
        { type: 'slack', config: { webhookUrl: 'zzz' } }
    ],
    healthCheck: true,  // Send health check message to all channels
    healthCheckMessage: '🚀 Hotel Service Started - System Online'  // 🆕 Custom message
})

// Console output:
// 🏥 MultiChannelAlert: Sending health check message to all channels...
// ✅ Health Check: 2/2 channels responded successfully

// 🔧 Manual health check anytime
const healthResult = await multiAlert.runHealthCheck()
console.log(`Health: ${healthResult.summary.successful}/${healthResult.summary.total} channels healthy`)

// Health check message includes:
// - ✅ Status: HEALTHY
// - 🔧 Service & Environment info  
// - 📊 Channel count
// - ⏰ Timestamp
// - 🏥 Health check flag
```

**Benefits:**
- 🚀 **Instant Validation**: Test all channels work after setup
- 🔍 **Connectivity Check**: Verify tokens, webhooks, and network
- 📊 **Channel Status**: See which channels are healthy/failed
- 🛠️ **Troubleshooting**: Identify configuration issues quickly

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

#### 🎯 Individual Component StrictMode (NEW)

Each alert component now supports individual `strictMode` for data filtering:

```javascript
const { TelegramAlert, SlackAlert, MattermostAlert } = require('@kien2k1/multi-channel-alert')

// TelegramAlert with strictMode
const telegramAlert = new TelegramAlert({
    botToken: 'your-bot-token',
    chatId: 'your-chat-id',
    specific: [
        { field: 'error', markdown: false },
        { field: 'message', markdown: true }
    ],
    strictMode: true // Enable data filtering
})

// SlackAlert with strictMode  
const slackAlert = new SlackAlert({
    webhookUrl: 'your-webhook-url',
    specific: [
        { key: 'error', title: 'Error' },
        { key: 'user_id', title: 'User ID' }
    ],
    strictMode: true // Enable data filtering
})

// MattermostAlert with strictMode
const mattermostAlert = new MattermostAlert({
    apiUrl: 'your-mattermost-api-url',
    token: 'your-token',
    channelId: 'your-channel-id',
    specific: [
        { field: 'error' },
        { field: 'message' },
        { field: 'user_id' }
    ],
    strictMode: true // Enable data filtering
})

// Test data with many fields
const alertData = {
    error: 'System failure',
    message: 'Database error',
    user_id: 'user_123',
    session_id: 'session_456',    // Will be filtered out
    ip_address: '192.168.1.1',   // Will be filtered out
    metadata: { extra: 'info' }  // Will be filtered out
}

await telegramAlert.error(alertData)
// ✅ Sends only: error, message

await slackAlert.error(alertData)  
// ✅ Sends only: error, user_id

await mattermostAlert.error(alertData)
// ✅ Sends only: error, message, user_id
```

**Benefits of Individual StrictMode:**
- 🎯 **Selective Data**: Filter data without MultiChannelAlert
- 🔒 **Privacy Control**: Remove sensitive fields per component
- ⚡ **Performance**: Reduce message payload size
- 🎛️ **Flexibility**: Different filtering per alert type

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
const { TelegramAlert } = require('@kien2k1/multi-channel-alert')

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
const { SlackAlert } = require('@kien2k1/multi-channel-alert')

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
const { MattermostAlert } = require('@kien2k1/multi-channel-alert')

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
const { EmailAlert } = require('@kien2k1/multi-channel-alert')

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
const { DiscordAlert } = require('@kien2k1/multi-channel-alert')

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
const { ZaloAlert } = require('@kien2k1/multi-channel-alert')

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
const { MessengerAlert } = require('@kien2k1/multi-channel-alert')

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
const { N8nAlert } = require('@kien2k1/multi-channel-alert')

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
const { saveProviderLog, saveProviderCurl } = require('@kien2k1/multi-channel-alert')

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
const { TelegramClient } = require('@kien2k1/multi-channel-alert')

/**
 * Initialize TelegramClient
 * Required config:
 * - botToken: Telegram bot token
 * - chatId: Chat ID to send messages to
 * 
 * Optional config:
 * - service: Default service type (hotel, flight, tour, transfer)
 * - environment: Default environment (DEV, STAGING, PROD)
 * - messageThreadIds: Thread routing configuration (nested object structure)
 * - disableNotification: Disable notifications (default: false)
 * - timeout: Request timeout in ms (default: 5000)
 */
const telegram = new TelegramClient({
    botToken: process.env.TELEGRAM_BOT_TOKEN,     // Required
    chatId: process.env.TELEGRAM_CHAT_ID,        // Required
    service: 'hotel',                            // Optional
    environment: 'PROD',                         // Optional
    messageThreadIds: {                          // Optional - nested object structure
        general: 17,
        hotel: {
            system: {
                all: 17,
                search: 19,
                offer_search: 19,
                prebook: 21,
                book: 23,
                cancel: 25
            },
            third_party: {
                all: 28,
                search: 30,
                prebook: 32,
                book: 34,
                cancel: 36
            }
        },
        flight: {
            system: {
                search: 5038,
                'confirm-tax': 5039,
                'generate-pnr': 5042
            },
            third_party: {
                search: 3561,
                'confirm-tax': 5050
            }
        },
        flight: {
            system: {
                search: 5038,
                'confirm-tax': 5039,
                'generate-pnr': 5042
            },
            third_party: {
                search: 3561,
                'confirm-tax': 5050
            }
        }
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
 * Thread routing: service.type.metric → nested object access → general fallback
 * 
 * ✨ NEW: Automatic ID extraction and rich formatting!
 */
await telegram.sendErrorAlert({
    // Core error info
    error_message: 'Failed to book hotel',      // Required
    error_code: 'BOOKING_FAILED',               // Optional
    
    // Routing (auto-detects thread using nested object access)
    // Example: messageThreadIds.hotel.third_party.book = 34
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
const { createTelegramClient } = require('@kien2k1/multi-channel-alert')

const telegramClient = createTelegramClient({
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID,
    messageThreadIds: { /* thread config */ }
})

await telegramClient.sendMessage({ error_message: 'Hello!' })
```

})

### 🎯 Smart Thread Routing (v2.2.0)

The new nested object structure provides better organization and type safety:

```javascript
// Old underscore pattern (deprecated)
messageThreadIds: {
    'hotel_system_search': 19,
    'hotel_system_book': 23,
    'hotel_third_party_search': 30
}

// New nested object structure (recommended)
messageThreadIds: {
    general: 17,           // Global fallback
    hotel: {
        system: {
            all: 17,       // Service-specific fallback
            search: 19,    // Specific metric
            book: 23
        },
        third_party: {
            all: 28,
            search: 30,
            book: 34
        }
    },
    flight: {
        system: { search: 5038 },
        third_party: { search: 3561 }
    }
}
```

**Routing Priority:**
1. `messageThreadIds.{service}.{type}.{metric}` - Most specific
2. `messageThreadIds.{service}.{type}.all` - Service + type fallback  
3. `messageThreadIds.{service}.{type}.general` - Service + type general
4. `messageThreadIds.general` - Global fallback

**Example:** `service: 'hotel'`, `type: 'system'`, `metric: 'search'`
→ Looks for `messageThreadIds.hotel.system.search = 19`

## Feature 4: Telegram Webhook (Production Setup)

Manage webhooks for production deployment:

```javascript
const { createTelegramWebhookClient } = require('@kien2k1/multi-channel-alert')

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
const { MultiChannelAlert } = require('@kien2k1/multi-channel-alert')

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
const { TelegramAlert, SlackAlert } = require('@kien2k1/multi-channel-alert')

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

## 🔧 Troubleshooting & Best Practices

### ❌ Common Issues

#### "message text is empty" Error (Telegram)
**Cause:** StrictMode filtering resulted in empty data or missing required fields.

**Solution:**
```javascript
// ❌ Wrong: No matching fields in specific configuration
const specific = [
    { key: 'user_name', title: 'User' }  // But data has 'user', not 'user_name'
]
const data = { user: 'john', method: 'POST' }

// ✅ Correct: Match field keys exactly
const specific = [
    { key: 'user', title: '👤 User' },   // Matches data.user
    { key: 'method', title: '📨 Method' } // Matches data.method
]
```

#### No Data Filtering with StrictMode
**Cause:** `strictMode` is enabled but no `specific` configuration provided.

**Solution:**
```javascript
// ❌ Wrong: strictMode=true but no specific config
const alert = new TelegramAlert({
    botToken: 'token',
    chatId: 'chat',
    strictMode: true  // Will return original data if no specific config
})

// ✅ Correct: Provide specific configuration
const alert = new TelegramAlert({
    botToken: 'token', 
    chatId: 'chat',
    strictMode: true,
    specific: [
        { key: 'user', title: '👤 User' },
        { key: 'error_code', title: '🔴 Error' }
    ]
})
```

### 🎯 Best Practices

#### 1. **Field Naming Consistency**
```javascript
// ✅ Use consistent field names across your application
const standardFields = [
    { key: 'user', title: '👤 User' },
    { key: 'method', title: '📨 Method' },  
    { key: 'status', title: '📊 Status' },
    { key: 'error_code', title: '🔴 Error Code' },
    { key: 'curl', title: '💻 cURL Command' }
]
```

#### 2. **Sensitive Data Protection**
```javascript
// ✅ Use strictMode for production channels
const productionAlert = new MultiChannelAlert({
    channels: [
        {
            type: 'telegram',
            config: { 
                botToken: process.env.TELEGRAM_TOKEN,
                chatId: process.env.TELEGRAM_CHAT_ID,
                strictMode: true  // Filter sensitive data
            }
        }
    ],
    specific: [
        { key: 'user', title: '👤 User' },
        { key: 'error_code', title: '🔴 Error' }
        // Sensitive fields like passwords, tokens are automatically excluded
    ]
})
```

#### 3. **Platform-Specific Formatting**
```javascript
// ✅ Let the library handle platform-specific formatting
const data = {
    user: 'john_doe',
    metadata: { session_id: '123', ip: '192.168.1.1' },  // Object - auto JSON formatted
    curl: 'curl -X POST https://api.com',                 // Auto code block
    error_stack: 'Error\n  at function()\n  at ...'      // Auto truncated
}

// Library automatically formats:
// - Objects as JSON code blocks
// - Curl commands as bash code blocks  
// - Stack traces with truncation
// - Titles with emojis
```

#### 4. **Configuration Inheritance**
```javascript
// ✅ Use global config with channel overrides
const multiAlert = new MultiChannelAlert({
    channels: [
        {
            type: 'telegram',
            config: { 
                botToken: 'token',
                chatId: 'chat-id',
                specific: [  // Override global specific for this channel
                    { key: 'user', title: '👤 User' },
                    { key: 'error_code', title: '🔴 Error' }
                ]
            }
        },
        {
            type: 'slack',
            config: { 
                webhookUrl: 'webhook-url'
                // Uses global specific configuration
            }
        }
    ],
    specific: [  // Global configuration
        { key: 'user', title: '👤 User' },
        { key: 'method', title: '📨 Method' },
        { key: 'status', title: '📊 Status' }
    ],
    strictMode: true
})
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
- `healthCheck` (boolean, optional): Send health check message to all channels after initialization (default: false)
- `healthCheckMessage` (string, optional): Custom message for health check (default: '✅ MultiChannelAlert Health Check')

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

// Health check (test all channels connectivity)
await multiAlert.runHealthCheck()
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

- **v1.0.7** (2025-11-04): 
  - 🎯 **Custom Health Check Messages**: Added `healthCheckMessage` parameter to customize health check notifications
  - 🚀 **Flexible Configuration**: Default health check message can now be overridden with custom text (e.g., "🚀 Hotel Service Started - System Online")
  - 📚 **Enhanced Documentation**: Updated examples and TypeScript definitions for healthCheckMessage feature
  - 🛠️ **Better Startup Messages**: More meaningful health check messages for different services and environments

- **v1.0.6** (2025-10-27):
  - 🔧 **Telegram Alert Improvements**: Enhanced alert logic and message formatting in Telegram component
  - 📦 **Package Optimization**: Improved package structure and dependencies
  - 🐛 **Bug Fixes**: Various minor fixes and performance improvements

- **v1.0.5** (2025-10-07): 
  - 🏥 **Health Check Enhancement**: Improved field configuration and emoji display consistency
  - 🎨 **Mattermost Formatting Fix**: Fixed last line enlargement issue in health check messages
  - 🔧 **Field Management**: Enhanced `_ensureHealthCheckFields` method to update existing field configurations
  - 📊 **Smart Configuration**: Health check fields now properly override existing configurations with correct markdown settings
  - 🐛 **Bug Fixes**: Resolved emoji display inconsistencies across different platforms

- **v1.0.3** (2025-10-03): 
  - 🎨 **Mattermost Formatting**: Enhanced markdown support and code block formatting
  - 🔧 **Improvements**: Better console logging and error handling
  - 📝 **Code Quality**: Cleaner output and reduced verbose logging

- **v1.0.3** (2025-10-03): 
  - 🔧 **TypeScript Definitions**: Improved AlertData interface for better flexibility
  - 📝 **Documentation**: Updated package information and links
  - 🐛 **Bug Fixes**: Minor fixes and improvements

- **v1.0.1** (2025-10-02): 
  - 📦 **Package Updates**: Updated package name to `@kien2k1/multi-channel-alert`
  - 🔗 **Links**: Updated NPM registry links and documentation

- **v1.0.0** (2025-10-02): 
  - 🚀 **NEW PACKAGE**: Published as `@kien2k1/multi-channel-alert`
  - 🎯 **MultiChannelAlert System**: Send alerts to 15+ platforms simultaneously
  - 📱 **Supported Platforms**: Telegram, Slack, Mattermost, Discord, Email, WhatsApp, Zalo, LINE, Viber, Skype, WeChat, RocketChat, Firebase, N8n, Messenger
  - 🎛️ **Advanced Features**: StrictMode data filtering, individual component support
  - 🎨 **Rich Formatting**: Platform-specific markdown, emoji titles, code blocks
  - 📝 **Enhanced Documentation**: Comprehensive setup guides and troubleshooting
  - ⚡ **Zero Dependencies**: Lightweight package with no runtime dependencies
  - 🔧 **Legacy Features**: Third-party logging, Telegram webhook management

## Best Practices

### 1. Use MultiChannelAlert for New Projects
```javascript
// ✅ Recommended - Multi-channel approach
const { MultiChannelAlert } = require('@kien2k1/multi-channel-alert')
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
npm install @kien2k1/multi-channel-alert

# Check import path
const { MultiChannelAlert } = require('@kien2k1/multi-channel-alert')
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

## Links

- 📦 **NPM Package**: https://www.npmjs.com/package/@kien2k1/multi-channel-alert
- 🐙 **Source Code**: https://github.com/Trungkien2022001/kien-nguyen-support
- 🐛 **Report Issues**: https://github.com/Trungkien2022001/kien-nguyen-support/issues
- 📧 **Email Support**: nguyenkien2022001@gmail.com