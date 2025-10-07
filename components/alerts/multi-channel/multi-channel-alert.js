/* eslint-disable no-return-await */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
const SlackAlert = require('../slack/slack-client')
const DiscordAlert = require('../discord/discord-client')
const MessengerAlert = require('../messenger/messenger-client')
const MattermostAlert = require('../mattermost/mattermost-client')
const N8nAlert = require('../n8n/n8n-client')
const TelegramAlert = require('../telegram/telegram-bot')
const ZaloAlert = require('../zalo/zalo-client')
const EmailAlert = require('../email/email-client')
const WhatsAppAlert = require('../whatsapp/whatsapp-client')
const LineAlert = require('../line/line-client')
const ViberAlert = require('../viber/viber-client')
const SkypeAlert = require('../skype/skype-client')
const WeChatAlert = require('../wechat/wechat-client')
const RocketChatAlert = require('../rocketchat/rocketchat-client')
const FirebaseAlert = require('../firebase/firebase-client')

/**
 * MultiChannelAlert - Send alerts to multiple channels simultaneously
 * 
 * @class MultiChannelAlert
 * @description Manages and sends alerts to multiple configured alert channels
 * 
 * @example
 * const multiAlert = new MultiChannelAlert({
 *   channels: [
 *     {
 *       type: 'telegram',
 *       config: {
 *         botToken: 'bot-token',
 *         chatId: 'chat-id',
 *         service: 'hotel',
 *         environment: 'PRODUCTION'
 *       }
 *     },
 *     {
 *       type: 'mattermost',
 *       config: {
 *         url: 'https://mattermost.example.com',
 *         token: 'access-token',
 *         chatId: 'channel-id',
 *         service: 'hotel',
 *         environment: 'PRODUCTION'
 *       }
 *     }
 *   ],
 *   service: 'hotel',
 *   environment: 'PRODUCTION',
 *   healthCheck: true  // Send hello message to all channels after initialization
 * })
 * 
 * // Or manually trigger health check later
 * const healthResult = await multiAlert.runHealthCheck()
 * console.log(`Health Check: ${healthResult.summary.successful}/${healthResult.summary.total} channels healthy`)
 * 
 * // Send error to all configured channels
 * await multiAlert.error({
 *   user_id: '123',
 *   booking_id: 'BK456',
 *   error_code: 'PAYMENT_FAILED',
 *   message: 'Payment processing failed'
 * })
 */
class MultiChannelAlert {
    /**
     * Create a MultiChannelAlert instance
     * @param {Object} config Configuration object
     * @param {Array} config.channels Array of channel configurations
     * @param {string} config.service Service name (hotel, flight, etc.)
     * @param {string} config.environment Environment (STAGING, PRODUCTION, etc.)
     * @param {boolean} config.failSilently If true, don't throw errors when some channels fail
     * @param {boolean} config.beauty Global beauty setting for all channels
     * @param {Array} config.specific Global specific field configurations
     * @param {boolean} config.strictMode If true, only log keys defined in specific array
     * @param {boolean} config.healthCheck If true, send hello message to all channels after initialization
     */
    constructor(config) {
        const {
            channels = [],
            service = 'hotel',
            environment = 'STAGING',
            failSilently = true,
            beauty = true,
            specific = [],
            strictMode = false,
            healthCheck = false
        } = config

        this.channels = []
        this.service = service
        this.environment = environment
        this.failSilently = failSilently
        
        // Global settings
        this.globalBeauty = beauty
        this.globalSpecific = specific
        this.strictMode = strictMode
        this.healthCheck = healthCheck

        // Initialize all configured alert channels
        this._initializeChannels(channels)

        // Send hello message if healthCheck is enabled
        if (this.healthCheck) {
            this._sendHealthCheckMessage()
        }
    }

    /**
     * Initialize alert channels from configuration with inheritance
     * @private
     */
    _initializeChannels(channelConfigs) {
        const alertClasses = {
            slack: SlackAlert,
            discord: DiscordAlert,
            messenger: MessengerAlert,
            mattermost: MattermostAlert,
            n8n: N8nAlert,
            telegram: TelegramAlert,
            zalo: ZaloAlert,
            email: EmailAlert,
            whatsapp: WhatsAppAlert,
            line: LineAlert,
            viber: ViberAlert,
            skype: SkypeAlert,
            wechat: WeChatAlert,
            rocketchat: RocketChatAlert,
            firebase: FirebaseAlert
        }

        channelConfigs.forEach((channelConfig, index) => {
            try {
                const { type, config: alertConfig } = channelConfig

                if (!type) {
                    console.warn(`MultiChannelAlert: Channel at index ${index} missing 'type' property`)
                    
                    return
                }

                const AlertClass = alertClasses[type.toLowerCase()]

                if (!AlertClass) {
                    console.warn(`MultiChannelAlert: Unknown alert type '${type}' at index ${index}`)
                    
                    return
                }

                // Apply inheritance: channel config > global config > default values
                const finalConfig = this._applyConfigInheritance(alertConfig || {})

                const alertInstance = new AlertClass(finalConfig)

                this.channels.push({
                    type: type.toLowerCase(),
                    instance: alertInstance,
                    config: finalConfig
                })

                // console.log(`MultiChannelAlert: Initialized ${type} channel`)
            } catch (error) {
                // console.error(`MultiChannelAlert: Failed to initialize channel at index ${index}:`, error.message)
                if (!this.failSilently) {
                    throw error
                }
            }
        })

        // console.log(`MultiChannelAlert: Successfully initialized ${this.channels.length} channels`)
    }

    /**
     * Send health check message to all channels for testing connectivity
     * @private
     */
    async _sendHealthCheckMessage() {
        const timestamp = new Date().toISOString()
        const healthCheckData = {
            message: '✅ MultiChannelAlert Health Check',
            status: 'HEALTHY',
            service: this.service,
            environment: this.environment,
            channels_count: this.channels.length,
            timestamp,
            health_check: true
        }

        try {
            const result = await this._sendToAllChannels('info', healthCheckData)

            return result
        } catch (error) {
            if (!this.failSilently) {
                throw error
            }

            return null
        }
    }

    /**
     * Apply configuration inheritance: channel > global > default
     * @param {Object} channelConfig Channel-specific configuration
     * @returns {Object} Final configuration with inheritance applied
     * @private
     */
    _applyConfigInheritance(channelConfig) {
        // Base configuration with global settings
        const finalConfig = {
            service: this.service,
            environment: this.environment,
            beauty: this.globalBeauty,
            specific: this.globalSpecific,
            ...channelConfig // Channel config overrides global
        }

        return finalConfig
    }

    /**
     * Filter data object based on specific field configuration
     * @param {Object} data Original data object
     * @param {Array} specific Array of allowed fields or field configurations
     * @returns {Object} Filtered data object
     * @private
     */

    /**
     * Send alert to all configured channels
     * @private
     */
    async _sendToAllChannels(method, data) {
        const results = []
        const errors = []

        // Send alerts to all channels in parallel
        const promises = this.channels.map(async (channel) => {
            try {
                // Filter data based on channel's specific configuration or global specific
                const channelSpecific = channel.config.specific || this.globalSpecific
                const filteredData = this._filterDataBySpecific(data, channelSpecific)
                
                const result = await channel.instance[method](filteredData)
                results.push({
                    type: channel.type,
                    success: true,
                    result
                })

                return result
            } catch (error) {
                const errorInfo = {
                    type: channel.type,
                    success: false,
                    error: error.message
                }
                errors.push(errorInfo)
                results.push(errorInfo)

                console.error(`MultiChannelAlert: Failed to send ${method} to ${channel.type}:`, error.message)

                if (!this.failSilently) {
                    throw error
                }

                return null
            }
        })

        await Promise.allSettled(promises)

        // Log summary
        const successCount = results.filter(r => r.success).length
        const failureCount = errors.length

        console.log(`MultiChannelAlert.${method}: ${successCount} successful, ${failureCount} failed`)

        if (errors.length > 0 && !this.failSilently) {
            throw new Error(`MultiChannelAlert: ${errors.length} channels failed to send ${method}`)
        }

        return {
            success: successCount > 0,
            results,
            errors,
            summary: {
                total: this.channels.length,
                successful: successCount,
                failed: failureCount
            }
        }
    }

    /**
     * Filter data object based on specific field configuration
     * @param {Object} data Original data object
     * @param {Array} specific Array of allowed fields or field configurations
     * @returns {Object} Filtered data object
     * @private
     */
    _filterDataBySpecific(data, specific) {
        // If no specific configuration or strictMode disabled, return all data
        if (!specific || specific.length === 0 || !this.strictMode) {
            return data
        }

        const allowedFields = specific.map(item => 
            typeof item === 'string' ? item : (item.key || item.field)  // Support both key and field properties
        )

        const filteredData = {}
        
        allowedFields.forEach(field => {
            if (field && Object.prototype.hasOwnProperty.call(data, field)) {
                filteredData[field] = data[field]
            }
        })

        return filteredData
    }

    /**
     * Send error alert to all channels
     * @param {Object} data Alert data object
     */
    async error(data) {
        return await this._sendToAllChannels('error', data)
    }

    /**
     * Send info alert to all channels
     * @param {Object} data Alert data object
     */
    async info(data) {
        return await this._sendToAllChannels('info', data)
    }

    /**
     * Send warning alert to all channels
     * @param {Object} data Alert data object
     */
    async warn(data) {
        return await this._sendToAllChannels('warn', data)
    }

    /**
     * Send success alert to all channels
     * @param {Object} data Alert data object
     */
    async success(data) {
        return await this._sendToAllChannels('success', data)
    }

    /**
     * Manually trigger health check for all channels
     * @returns {Object} Health check results with channel status
     */
    async runHealthCheck() {
        return await this._sendHealthCheckMessage()
    }

    /**
     * Get information about configured channels
     */
    getChannels() {
        return this.channels.map(channel => ({
            type: channel.type,
            service: channel.config.service,
            environment: channel.config.environment
        }))
    }

    /**
     * Get channel count
     */
    getChannelCount() {
        return this.channels.length
    }

    /**
     * Check if a specific channel type is configured
     */
    hasChannel(type) {
        return this.channels.some(channel => channel.type === type.toLowerCase())
    }

    /**
     * Add a new channel dynamically
     */
    addChannel(channelConfig) {
        this._initializeChannels([channelConfig])

        return this.channels.length
    }

    /**
     * Remove a channel by type
     */
    removeChannel(type) {
        const initialCount = this.channels.length
        this.channels = this.channels.filter(channel => channel.type !== type.toLowerCase())
        const removedCount = initialCount - this.channels.length

        if (removedCount > 0) {
            console.log(`MultiChannelAlert: Removed ${removedCount} ${type} channel(s)`)
        }

        return removedCount
    }
}

module.exports = { MultiChannelAlert }