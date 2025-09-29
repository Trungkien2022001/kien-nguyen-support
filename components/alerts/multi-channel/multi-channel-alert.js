/* eslint-disable no-return-await */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
const {
    SlackAlert,
    DiscordAlert,
    MessengerAlert,
    MattermostAlert,
    N8nAlert,
    TelegramAlert,
    ZaloAlert,
    EmailAlert
} = require('../index')

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
 *     },
 *     {
 *       type: 'slack',
 *       config: {
 *         webhookUrl: 'https://hooks.slack.com/...',
 *         service: 'hotel',
 *         environment: 'PRODUCTION'
 *       }
 *     }
 *   ],
 *   service: 'hotel',
 *   environment: 'PRODUCTION'
 * })
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
     */
    constructor(config) {
        const {
            channels = [],
            service = 'hotel',
            environment = 'STAGING',
            failSilently = true
        } = config

        this.channels = []
        this.service = service
        this.environment = environment
        this.failSilently = failSilently

        // Initialize all configured alert channels
        this._initializeChannels(channels)
    }

    /**
     * Initialize alert channels from configuration
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
            email: EmailAlert
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

                // Merge service and environment if not provided in channel config
                const finalConfig = {
                    service: this.service,
                    environment: this.environment,
                    ...alertConfig
                }

                const alertInstance = new AlertClass(finalConfig)

                this.channels.push({
                    type: type.toLowerCase(),
                    instance: alertInstance,
                    config: finalConfig
                })

                console.log(`MultiChannelAlert: Initialized ${type} channel`)
            } catch (error) {
                console.error(`MultiChannelAlert: Failed to initialize channel at index ${index}:`, error.message)
                if (!this.failSilently) {
                    throw error
                }
            }
        })

        console.log(`MultiChannelAlert: Successfully initialized ${this.channels.length} channels`)
    }

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
                const result = await channel.instance[method](data)
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