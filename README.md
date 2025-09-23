# Kien Nguyen Support

A comprehensive utilities package for logging, Telegram alerts, and webhook management.

## Installation

```bash
npm install kien-nguyen-support
```

## Features

- 📝 **Provider Logging**: Save API request/response logs and curl commands
- 🚨 **Telegram Alerts**: Send error alerts and notifications to Telegram
- 🔗 **Webhook Management**: Setup and manage Telegram webhooks with polling fallback
- 🏗️ **Multi-Product Support**: Support for hotel, flight, tour, and transfer products
- 📱 **Smart Thread Routing**: Automatic message routing to appropriate Telegram threads

## Quick Start

```javascript
const support = require('kien-nguyen-support')

// or import specific modules
const { saveProviderLog, sendErrorAlert, initializeTelegram } = require('kien-nguyen-support')
```

## Logging

### Save Provider Logs

```javascript
// Save API request/response logs
await support.saveProviderLog({
    action: 'search',
    req: requestData,
    res: responseData,
    code: 'EXPEDIA',
    name: 'search-hotels'
})

// Save curl commands
await support.saveProviderCurl({
    name: 'search-hotels',
    request: requestObject,
    code: 'EXPEDIA',
    action: 'search'
})
```

## Telegram Alerts

### Send Error Alerts

```javascript
// Hotel error alert
await support.sendErrorAlert({
    botToken: 'your-bot-token',
    chatId: 'your-chat-id',
    messageThreadIds: config.message_thread_id,
    product: 'hotel',
    environment: 'PROD',
    type: 'third_party',
    errorCode: 'BOOKING_FAILED',
    errorMessage: 'Failed to book hotel room',
    metric: 'offer_book',
    user: 'user@example.com',
    supplierCode: 'EXPEDIA'
})

// Flight error alert
await support.sendErrorAlert({
    botToken: 'your-bot-token',
    chatId: 'your-chat-id',
    messageThreadIds: config.message_thread_id,
    product: 'flight',
    environment: 'PROD',
    type: 'system',
    errorCode: 'PNR_GENERATION_FAILED',
    errorMessage: 'Failed to generate PNR',
    metric: 'generate_pnr',
    user: 'user@example.com'
})
```

### Send Custom Notifications

```javascript
// Startup notification
await support.sendStartupNotification({
    botToken: 'your-bot-token',
    chatId: 'your-chat-id',
    environment: 'PROD',
    serviceName: 'Hotel API',
    version: '2.1.0'
})

// Custom notification
await support.sendCustomNotification({
    botToken: 'your-bot-token',
    chatId: 'your-chat-id',
    title: 'Deployment Complete',
    message: 'New version deployed successfully',
    icon: '🚀',
    environment: 'PROD'
})
```

## Webhook Management

### Initialize Telegram

```javascript
// Auto webhook with polling fallback
const result = await support.initializeTelegram({
    botToken: 'your-bot-token',
    webhookUrl: 'https://your-domain.com/webhook',
    onUpdate: (update) => {
        console.log('Received update:', update)
    }
})

// Force polling mode
const result = await support.initializeTelegram({
    botToken: 'your-bot-token',
    usePolling: true,
    onUpdate: async (update) => {
        // Handle telegram update
        if (update.message) {
            console.log('New message:', update.message.text)
        }
    }
})
```

### Manual Webhook Setup

```javascript
// Set webhook
await support.setWebhook({
    botToken: 'your-bot-token',
    webhookUrl: 'https://your-domain.com/webhook',
    allowedUpdates: ['message', 'callback_query'],
    maxConnections: 100
})

// Delete webhook
await support.deleteWebhook({
    botToken: 'your-bot-token',
    dropPendingUpdates: true
})

// Get webhook info
const info = await support.getWebhookInfo({
    botToken: 'your-bot-token'
})
```

### Manual Polling

```javascript
// Start polling
const polling = support.startPolling({
    botToken: 'your-bot-token',
    onUpdate: async (update) => {
        // Handle update
        console.log('Update received:', update)
    },
    onError: (error) => {
        console.error('Polling error:', error)
    },
    interval: 30000, // 30 seconds
    timeout: 10000   // 10 seconds
})

// Stop polling when needed
polling.stop()
```

## Multi-Product Support

The package supports multiple products with automatic thread routing:

### Supported Products
- **hotel**: Hotel bookings and searches
- **flight**: Flight bookings, PNR generation, e-tickets
- **tour**: Tour packages and bookings  
- **transfer**: Airport transfers and transportation

### Supported Metrics

**Hotel**: `offer_search`, `search_by_region`, `search_by_id`, `prebook`, `offer_book`, `book`, `cancel`

**Flight**: `search`, `confirm_tax`, `generate_pnr`, `generate_eticket`, `retrieve_pnr`, `retrieve`, `cancel`

**Tour**: `search`, `book`, `cancel`

**Transfer**: `search`, `book`, `cancel`

## Configuration

### Telegram Thread Configuration

```javascript
const config = {
    telegramAlert: {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        chatId: process.env.TELEGRAM_CHAT_ID,
        message_thread_id: {
            general: 1,
            
            // Hotel threads
            hotel_system_search: 11,
            hotel_system_book: 13,
            hotel_third_party_search: 21,
            hotel_third_party_book: 23,
            
            // Flight threads  
            flight_system_search: 31,
            flight_system_generate_pnr: 33,
            flight_third_party_search: 41,
            flight_third_party_generate_pnr: 43,
            
            // Tour threads
            tour_system_search: 51,
            tour_system_book: 52,
            
            // Transfer threads
            transfer_system_search: 71,
            transfer_system_book: 72
            
            // ... more thread IDs
        }
    }
}
```

## Constants

Access predefined constants:

```javascript
const { constants } = require('kien-nguyen-support')

// Products
constants.TELEGRAM.PRODUCTS.HOTEL     // 'hotel'
constants.TELEGRAM.PRODUCTS.FLIGHT    // 'flight'

// Error types
constants.TELEGRAM.ERROR_TYPES.THIRD_PARTY  // 'third_party'
constants.TELEGRAM.ERROR_TYPES.SYSTEM       // 'system'

// Metrics
constants.TELEGRAM.METRICS.HOTEL.OFFER_SEARCH    // 'offer_search'
constants.TELEGRAM.METRICS.FLIGHT.GENERATE_PNR   // 'generate_pnr'

// File extensions
constants.FILE_EXTENSIONS.JSON  // 'json'
constants.FILE_EXTENSIONS.XML   // 'xml'
```

## API Reference

### Logging Functions

#### `saveProviderLog(options)`
Save API request/response logs to files.

**Parameters:**
- `action` (string): Action name
- `req` (Object): Request data
- `res` (Object): Response data  
- `code` (string): Provider/supplier code
- `name` (string): Operation name

#### `saveProviderCurl(options)`
Save curl command to file.

**Parameters:**
- `name` (string): Operation name
- `request` (Object): Request object with method, url, headers, body
- `code` (string): Provider/supplier code
- `action` (string, optional): Action name

### Telegram Functions

#### `sendErrorAlert(options)`
Send error alert to Telegram with automatic thread routing.

**Parameters:**
- `botToken` (string): Telegram bot token
- `chatId` (string): Chat ID
- `messageThreadIds` (Object): Thread ID configuration
- `product` (string, optional): Product type (hotel/flight/tour/transfer)
- `environment` (string): Environment (PROD/STAGING/DEV)
- `type` (string): Error type (system/third_party)
- `errorCode` (string): Error code
- `errorMessage` (string): Error message
- `metric` (string): Metric name
- `user` (string, optional): User email
- `supplierCode` (string, optional): Supplier code
- `supplier` (Object, optional): Supplier object
- `requestMetadata` (Object, optional): Request metadata
- `errorStack` (string, optional): Error stack trace
- `disableNotification` (boolean, optional): Disable notification

#### `sendStartupNotification(options)`
Send service startup notification.

**Parameters:**
- `botToken` (string): Telegram bot token
- `chatId` (string): Chat ID
- `environment` (string): Environment
- `serviceName` (string, optional): Service name
- `version` (string, optional): Service version
- `customMessage` (string, optional): Custom message
- `disableNotification` (boolean, optional): Disable notification

#### `initializeTelegram(options)`
Initialize Telegram with webhook or polling.

**Parameters:**
- `botToken` (string): Telegram bot token
- `webhookUrl` (string, optional): Webhook URL
- `usePolling` (boolean, optional): Force polling mode
- `onUpdate` (Function, optional): Update handler function
- `allowedUpdates` (Array, optional): Allowed update types
- `dropPendingUpdates` (boolean, optional): Drop pending updates

## License

ISC

## Author

nguyenkien2022001@gmail.com

## Repository

https://github.com/Trungkien2022001/kien-nguyen-support