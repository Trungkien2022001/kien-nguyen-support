# MultiChannelAlert 🚀

MultiChannelAlert cho phép bạn gửi alerts đến nhiều channels cùng lúc với một lệnh duy nhất.

## 📋 **Tính năng chính**

- ✅ **Multi-channel support**: Gửi alert đến nhiều platforms cùng lúc
- ✅ **Conditional channels**: Chỉ khởi tạo channels nào có config
- ✅ **Dynamic management**: Thêm/xóa channels trong runtime  
- ✅ **Error handling**: Graceful failure với failSilently option
- ✅ **Logger-style methods**: `.error()`, `.info()`, `.warn()`, `.success()`
- ✅ **Parallel processing**: Gửi đến tất cả channels đồng thời

## 🎯 **Supported Channels**

- **Telegram** (`telegram`)
- **Mattermost** (`mattermost`)  
- **Slack** (`slack`)
- **Discord** (`discord`)
- **Email** (`email`)
- **Zalo** (`zalo`)
- **Messenger** (`messenger`)
- **N8n** (`n8n`)

## 🚀 **Quick Start**

### Basic Usage

```javascript
const { MultiChannelAlert } = require('./components/alerts')

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
    }
  ],
  service: 'hotel',
  environment: 'PRODUCTION'
})

// Gửi error đến tất cả channels
const result = await multiAlert.error({
  user_id: '123',
  booking_id: 'BK456',
  error_code: 'PAYMENT_FAILED',
  message: 'Payment processing failed'
})

console.log(result.summary)
// { total: 2, successful: 2, failed: 0 }
```

### Conditional Channels

```javascript
const channels = []

// Chỉ thêm channel nào có config
if (process.env.TELEGRAM_BOT_TOKEN) {
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

const multiAlert = new MultiChannelAlert({
  channels,
  service: 'hotel'
})
```

## 📖 **API Reference**

### Constructor Options

```javascript
new MultiChannelAlert({
  channels: [],           // Array of channel configurations
  service: 'hotel',       // Service name for routing
  environment: 'STAGING', // Environment context
  failSilently: true      // Don't throw if some channels fail
})
```

### Channel Configuration

```javascript
{
  type: 'telegram',       // Channel type (required)
  config: {               // Channel-specific config (required)
    // Channel-specific parameters
    botToken: 'token',
    chatId: 'chat-id',
    service: 'hotel',     // Will inherit from main config if not provided
    environment: 'PROD'   // Will inherit from main config if not provided
  }
}
```

### Logger Methods

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

### Management Methods

```javascript
// Get channel information
multiAlert.getChannels()          // Array of channel info
multiAlert.getChannelCount()      // Number of channels
multiAlert.hasChannel('telegram') // Check if type exists

// Dynamic management
multiAlert.addChannel(config)     // Add new channel
multiAlert.removeChannel('slack') // Remove by type
```

## 📊 **Response Format**

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

## ⚙️ **Configuration Examples**

### All Channels Example

```javascript
const multiAlert = new MultiChannelAlert({
  channels: [
    {
      type: 'telegram',
      config: {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        chatId: process.env.TELEGRAM_CHAT_ID
      }
    },
    {
      type: 'slack',
      config: {
        webhookUrl: process.env.SLACK_WEBHOOK_URL
      }
    },
    {
      type: 'mattermost',
      config: {
        url: process.env.MATTERMOST_URL,
        token: process.env.MATTERMOST_TOKEN,
        chatId: process.env.MATTERMOST_CHAT_ID
      }
    },
    {
      type: 'email',
      config: {
        host: process.env.SMTP_HOST,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        from: 'alerts@company.com',
        to: 'team@company.com'
      }
    }
  ],
  service: 'hotel',
  environment: 'PRODUCTION',
  failSilently: true
})
```

## 🔄 **Error Handling**

### Fail Silently (Recommended)

```javascript
const multiAlert = new MultiChannelAlert({
  channels: [...],
  failSilently: true  // Default behavior
})

const result = await multiAlert.error(data)
// Continues even if some channels fail
// Check result.summary for success/failure details
```

### Fail Fast

```javascript
const multiAlert = new MultiChannelAlert({
  channels: [...],
  failSilently: false
})

try {
  await multiAlert.error(data)
} catch (error) {
  // Throws if any channel fails
  console.error('Some channels failed:', error.message)
}
```

## 💡 **Best Practices**

1. **Use conditional initialization** - Chỉ add channels có config
2. **Enable failSilently** - Để tránh break app nếu 1 channel fail  
3. **Check response summary** - Để biết channels nào success/fail
4. **Use environment variables** - Để manage credentials safely
5. **Set appropriate service** - Để routing đúng channels/threads

## 📁 **File Structure**

```
components/alerts/multi-channel/
├── index.js                    # Export MultiChannelAlert
├── multi-channel-alert.js      # Main implementation
└── README.md                   # This documentation

examples/
├── multi-channel-alert-example.js     # Full demo
└── multi-channel-usage-examples.js    # Usage patterns
```