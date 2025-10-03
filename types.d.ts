declare module '@kien2k1/multi-channel-alert' {
  /**
   * Common type definitions
   */

  /** Service types supported by the alert system */
  export type ServiceType = 'hotel' | 'flight' | 'tour' | 'transfer' | any;
  
  /** Environment types for deployment context */
  export type EnvironmentType = 'DEV' | 'STAGING' | 'PRODUCTION';
  
  /** Supported alert channel types */
  export type AlertChannelType = 'telegram' | 'slack' | 'mattermost' | 'email' | 'discord' | 'zalo' | 'messenger' | 'n8n' | 'whatsapp' | 'line' | 'viber' | 'skype' | 'wechat' | 'rocketchat' | 'firebase';

  /**
   * Standard alert data interface - flexible structure for all alert types
   */
  export interface AlertData {
    // /** Main alert message content */
    // message?: string;
    // /** Error message (alternative to message) */
    // error_message?: string;
    // /** Error code identifier */
    // error_code?: string;
    // /** Error stack trace */
    // error_stack?: string;
    // /** User identifier */
    // user_id?: string;
    // /** User email address */
    // user_email?: string;
    // /** Booking/reservation identifier */
    // booking_id?: string;
    // /** Search session identifier */
    // search_id?: string;
    // /** Distributed tracing identifier */
    // trace_id?: string;
    // /** Log entry identifier */
    // log_id?: string;
    // /** Request identifier */
    // request_id?: string;
    // /** Third-party supplier information */
    // supplier?: {
    //   /** Supplier code/name */
    //   code?: string;
    //   /** Supplier numeric ID */
    //   id?: number | string;
    //   /** Supplier source identifier */
    //   source_id?: string;
    //   /** Contract identifier with supplier */
    //   contract_id?: string;
    //   /** Supplier username/login */
    //   user_name?: string;
    // };
    // /** HTTP request metadata */
    // request_metadata?: any;
    // /** Additional metadata object */
    // metadata?: any;
    // /** Environment context */
    // environment?: EnvironmentType;
    // /** Service context */
    // service?: ServiceType;
    /** Additional dynamic properties */
    [key: string]: any;
  }

  /**
   * Base configuration interface for all alert components
   */
  export interface BaseAlertConfig {
    /** Service type identifier (hotel, flight, tour, transfer, etc.) */
    service?: ServiceType;
    /** Environment where alert is sent (DEV, STAGING, PRODUCTION) */
    environment?: EnvironmentType;
    /** Enable rich formatting with emojis and markdown (default: true) */
    beauty?: boolean;
    /** Request timeout in milliseconds (default: 5000-10000) */
    timeout?: number;
    /** Array of specific fields to display with custom formatting */
    specific?: Array<{
      /** Field name for Slack alerts (use 'key' for Slack, 'field' for others) */
      key?: string;
      /** Field name for Telegram/Mattermost alerts */
      field?: string;
      /** Display label for the field */
      label?: string;
      /** Display title for the field (alternative to label) */
      title?: string;
      /** Enable markdown formatting for this specific field */
      markdown?: boolean;
      /** Display priority (higher = shown first) */
      priority?: number;
    }>;
    /** Enable data filtering - only send fields defined in 'specific' array (default: false) */
    strictMode?: boolean;
  }

  /**
   * Configuration for MultiChannelAlert - broadcast to multiple channels simultaneously
   */
  export interface MultiChannelAlertConfig {
    /** Array of channel configurations (Telegram, Slack, Mattermost, etc.) */
    channels: ChannelConfig[];
    /** Global service type - inherited by all channels unless overridden */
    service?: ServiceType;
    /** Global environment - inherited by all channels unless overridden */
    environment?: EnvironmentType;
    /** Global beauty setting - inherited by all channels unless overridden */
    beauty?: boolean;
    /** Global specific fields configuration - inherited by all channels unless overridden */
    specific?: Array<{
      /** Field name for Slack alerts */
      key?: string;
      /** Field name for Telegram/Mattermost alerts */
      field?: string;
      /** Display label for the field */
      label?: string;
      /** Display title for the field */
      title?: string;
      /** Enable markdown formatting for this field */
      markdown?: boolean;
      /** Display priority (higher = shown first) */
      priority?: number;
    }>;
    /** Global strictMode - filter data based on specific fields (default: false) */
    strictMode?: boolean;
    /** Continue sending to other channels if some fail (default: true) */
    failSilently?: boolean;
  }

  export interface ChannelConfig {
    type: AlertChannelType;
    config: any;
  }

  export interface MultiChannelResult {
    success: boolean;
    results: Array<{
      type: AlertChannelType;
      success: boolean;
      result?: any;
      error?: string;
    }>;
    errors: Array<{
      type: AlertChannelType;
      success: false;
      error: string;
    }>;
    summary: {
      total: number;
      successful: number;
      failed: number;
    };
  }

  export class MultiChannelAlert {
    constructor(config: MultiChannelAlertConfig);
    error(data: AlertData): Promise<MultiChannelResult>;
    info(data: AlertData): Promise<MultiChannelResult>;
    warn(data: AlertData): Promise<MultiChannelResult>;
    success(data: AlertData): Promise<MultiChannelResult>;
    getChannels(): Array<{ type: AlertChannelType; service?: ServiceType; environment?: EnvironmentType }>;
    getChannelCount(): number;
    hasChannel(type: AlertChannelType): boolean;
    addChannel(config: ChannelConfig): number;
    removeChannel(type: AlertChannelType): number;
  }

  // Individual Alert Classes
  
  // Telegram Alert
    /**
   * Configuration for TelegramAlert - send messages to Telegram chat/channel
   */
  export interface TelegramAlertConfig extends BaseAlertConfig {
    /** Telegram bot token from @BotFather (required) */
    botToken: string;
    /** Telegram chat ID - get from bot getUpdates API (required) */
    chatId: string;
    /** Disable push notifications for messages (default: false) */
    disableNotification?: boolean;
    /** Nested object for thread routing: service.type.metric -> thread ID */
    messageThreadIds?: {
      [key: string]: number | {
        [key: string]: number | {
          [key: string]: number;
        };
      };
    };
    /** Action type for thread routing (default: 'all') */
    action?: string;
  }

  export class TelegramAlert {
    constructor(config: TelegramAlertConfig);
    error(data: AlertData): Promise<any>;
    info(data: AlertData): Promise<any>;
    warn(data: AlertData): Promise<any>;
    success(data: AlertData): Promise<any>;
  }

  // Slack Alert
    /**
   * Configuration for SlackAlert - send messages to Slack workspace
   */
  export interface SlackAlertConfig extends BaseAlertConfig {
    /** Slack incoming webhook URL (required) - get from Slack app settings */
    webhookUrl: string;
    /** Slack channel name (optional) - override webhook default channel */
    channel?: string;
    /** Bot username displayed in messages */
    username?: string;
    /** Bot emoji icon (e.g., ':robot_face:') */
    iconEmoji?: string;
    /** Bot avatar image URL */
    iconUrl?: string;
    /** Automatically unfurl links in messages (default: true) */
    unfurlLinks?: boolean;
    /** Automatically unfurl media in messages (default: true) */
    unfurlMedia?: boolean;
    /** Link channel/user names (default: true) */
    linkNames?: boolean;
    /** Slack message attachments array */
    attachments?: any[];
    /** Slack Block Kit components */
    blocks?: any[];
    /** Thread timestamp for replying to specific message */
    threadTs?: string;
    /** Broadcast thread reply to channel (default: false) */
    replyBroadcast?: boolean;
    /** Nested channels configuration for routing */
    channels?: any;
    /** Action type for channel routing (default: 'all') */
    action?: string;
  }

  export class SlackAlert {
    constructor(config: SlackAlertConfig);
    error(data: AlertData): Promise<any>;
    info(data: AlertData): Promise<any>;
    warn(data: AlertData): Promise<any>;
    success(data: AlertData): Promise<any>;
  }

  /**
   * Configuration for MattermostAlert - send messages to Mattermost server
   */
  export interface MattermostAlertConfig extends BaseAlertConfig {
    /** Mattermost API URL (e.g., 'https://mattermost.com/api/v4/posts') */
    url: string;
    /** Mattermost bot token or personal access token */
    token: string;
    /** Mattermost channel ID to send messages to */
    chatId: string;
  }

  export class MattermostAlert {
    constructor(config: MattermostAlertConfig);
    error(data: AlertData): Promise<any>;
    info(data: AlertData): Promise<any>;
    warn(data: AlertData): Promise<any>;
    success(data: AlertData): Promise<any>;
  }

  /**
   * Configuration for EmailAlert - send emails via SMTP
   */
  export interface EmailAlertConfig extends BaseAlertConfig {
    /** SMTP server hostname (e.g., 'smtp.gmail.com', 'smtp.outlook.com') */
    host: string;
    /** SMTP server port (587 for TLS, 465 for SSL, 25 for plain) */
    port: number;
    /** Use secure connection (TLS/SSL) - auto-detected if not specified */
    secure?: boolean;
    /** SMTP authentication credentials */
    auth: {
      /** SMTP username/email address */
      user: string;
      /** SMTP password or app-specific password */
      pass: string;
    };
    /** Sender email address */
    from: string;
    /** Recipient email address(es) - single email or array */
    to: string | string[];
    /** CC recipients (optional) - single email or array */
    cc?: string | string[];
    /** BCC recipients (optional) - single email or array */
    bcc?: string | string[];
  }

  export class EmailAlert {
    constructor(config: EmailAlertConfig);
    error(data: AlertData): Promise<any>;
    info(data: AlertData): Promise<any>;
    warn(data: AlertData): Promise<any>;
    success(data: AlertData): Promise<any>;
  }

  /**
   * Configuration for DiscordAlert - send messages to Discord channel
   */
  export interface DiscordAlertConfig extends BaseAlertConfig {
    /** Discord webhook URL (required) - get from Discord channel settings */
    webhookUrl: string;
    /** Bot username displayed in messages (optional) */
    username?: string;
    /** Bot avatar image URL (optional) */
    avatar?: string;
  }

  export class DiscordAlert {
    constructor(config: DiscordAlertConfig);
    error(data: AlertData): Promise<any>;
    info(data: AlertData): Promise<any>;
    warn(data: AlertData): Promise<any>;
    success(data: AlertData): Promise<any>;
  }

  /**
   * Configuration for ZaloAlert - send messages via Zalo API
   */
  export interface ZaloAlertConfig extends BaseAlertConfig {
    /** Zalo app access token (required) - get from Zalo developers */
    accessToken: string;
    /** Target Zalo user ID to send messages to */
    userId: string;
  }

  export class ZaloAlert {
    constructor(config: ZaloAlertConfig);
    error(data: AlertData): Promise<any>;
    info(data: AlertData): Promise<any>;
    warn(data: AlertData): Promise<any>;
    success(data: AlertData): Promise<any>;
  }

  /**
   * Configuration for MessengerAlert - send messages via Facebook Messenger
   */
  export interface MessengerAlertConfig extends BaseAlertConfig {
    /** Facebook page access token (required) - get from Facebook developers */
    pageAccessToken: string;
    /** Recipient user ID (PSID) to send messages to */
    recipientId: string;
  }

  export class MessengerAlert {
    constructor(config: MessengerAlertConfig);
    error(data: AlertData): Promise<any>;
    info(data: AlertData): Promise<any>;
    warn(data: AlertData): Promise<any>;
    success(data: AlertData): Promise<any>;
  }

  /**
   * Configuration for N8nAlert - send data to n8n webhook automation
   */
  export interface N8nAlertConfig extends BaseAlertConfig {
    /** n8n webhook URL (required) - get from n8n webhook trigger node */
    webhookUrl: string;
    /** Custom HTTP headers to send with request (optional) */
    headers?: Record<string, string>;
  }

  export class N8nAlert {
    constructor(config: N8nAlertConfig);
    error(data: AlertData): Promise<any>;
    info(data: AlertData): Promise<any>;
    warn(data: AlertData): Promise<any>;
    success(data: AlertData): Promise<any>;
  }

  /**
   * Configuration for WhatsAppAlert - send messages via WhatsApp Business API
   */
  export interface WhatsAppAlertConfig extends BaseAlertConfig {
    /** WhatsApp phone number ID (required) - get from Meta developers */
    phoneNumberId: string;
    /** WhatsApp Business API access token (required) */
    accessToken: string;
    /** Recipient phone number in international format (e.g., '+1234567890') */
    recipientPhone: string;
  }

  export class WhatsAppAlert {
    constructor(config: WhatsAppAlertConfig);
    error(data: AlertData): Promise<any>;
    info(data: AlertData): Promise<any>;
    warn(data: AlertData): Promise<any>;
    success(data: AlertData): Promise<any>;
  }

  /**
   * Configuration for LineAlert - send messages via LINE Messaging API
   */
  export interface LineAlertConfig extends BaseAlertConfig {
    /** LINE channel access token (required) - get from LINE developers console */
    accessToken: string;
  }

  export class LineAlert {
    constructor(config: LineAlertConfig);
    error(data: AlertData): Promise<any>;
    info(data: AlertData): Promise<any>;
    warn(data: AlertData): Promise<any>;
    success(data: AlertData): Promise<any>;
  }

  /**
   * Configuration for ViberAlert - send messages via Viber Bot API
   */
  export interface ViberAlertConfig extends BaseAlertConfig {
    /** Viber bot authentication token (required) - get from Viber admin panel */
    authToken: string;
    /** Sender ID for the bot messages */
    senderId: string;
    /** Bot display name (optional) */
    botName?: string;
    /** Bot avatar image URL (optional) */
    botAvatar?: string;
  }

  export class ViberAlert {
    constructor(config: ViberAlertConfig);
    error(data: AlertData): Promise<any>;
    info(data: AlertData): Promise<any>;
    warn(data: AlertData): Promise<any>;
    success(data: AlertData): Promise<any>;
  }

  /**
   * Configuration for SkypeAlert - send messages via Skype Bot Framework
   */
  export interface SkypeAlertConfig extends BaseAlertConfig {
    /** Skype bot ID (required) - get from Microsoft Bot Framework */
    botId: string;
    /** Skype bot password (required) - get from Microsoft Bot Framework */
    botPassword: string;
    /** Skype conversation ID to send messages to */
    conversationId: string;
  }

  export class SkypeAlert {
    constructor(config: SkypeAlertConfig);
    error(data: AlertData): Promise<any>;
    info(data: AlertData): Promise<any>;
    warn(data: AlertData): Promise<any>;
    success(data: AlertData): Promise<any>;
  }

  /**
   * Configuration for WeChatAlert - send messages via WeChat Work webhook
   */
  export interface WeChatAlertConfig extends BaseAlertConfig {
    /** WeChat Work webhook URL (required) - get from WeChat Work admin */
    webhookUrl: string;
  }

  export class WeChatAlert {
    constructor(config: WeChatAlertConfig);
    error(data: AlertData): Promise<any>;
    info(data: AlertData): Promise<any>;
    warn(data: AlertData): Promise<any>;
    success(data: AlertData): Promise<any>;
  }

  /**
   * Configuration for RocketChatAlert - send messages to Rocket.Chat server
   */
  export interface RocketChatAlertConfig extends BaseAlertConfig {
    /** Rocket.Chat webhook URL (required) - get from integrations settings */
    webhookUrl: string;
    /** Bot username displayed in messages (optional) */
    username?: string;
    /** Target channel name (optional) - override webhook default */
    channel?: string;
  }

  export class RocketChatAlert {
    constructor(config: RocketChatAlertConfig);
    error(data: AlertData): Promise<any>;
    info(data: AlertData): Promise<any>;
    warn(data: AlertData): Promise<any>;
    success(data: AlertData): Promise<any>;
  }

  /**
   * Configuration for FirebaseAlert - send push notifications via Firebase Cloud Messaging
   */
  export interface FirebaseAlertConfig extends BaseAlertConfig {
    /** Firebase server key (required) - get from Firebase console */
    serverKey: string;
    /** Device registration token to send push notification to */
    registrationToken: string;
  }

  export class FirebaseAlert {
    constructor(config: FirebaseAlertConfig);
    error(data: AlertData): Promise<any>;
    info(data: AlertData): Promise<any>;
    warn(data: AlertData): Promise<any>;
    success(data: AlertData): Promise<any>;
  }

  /**
   * Legacy Telegram Client Configuration (Backward Compatibility)
   */
  export interface TelegramClientConfig {
    /** Telegram bot token from @BotFather (required) */
    botToken: string;
    /** Telegram chat ID - get from bot getUpdates API (required) */
    chatId: string;
    /** Service type for message routing (optional) */
    service?: string;
    /** Environment context (optional) */
    environment?: string;
    /** Simple thread ID mapping (legacy format) */
    messageThreadIds?: Record<string, number>;
    /** Disable push notifications (default: false) */
    disableNotification?: boolean;
    /** Request timeout in milliseconds (default: 10000) */
    timeout?: number;
  }

  /**
   * Options for sending messages via TelegramClient (Legacy)
   */
  export interface SendMessageOptions {
    /** Main error message content (required) */
    error_message: string;
    /** Alert type for routing ('system' or 'third_party') */
    type?: 'system' | 'third_party';
    /** Metric identifier for thread routing */
    metric?: string;
    /** User email address */
    user_email?: string;
    /** Supplier information object */
    supplier?: {
      /** Supplier code/name */
      code?: string;
      /** Supplier numeric or string ID */
      id?: number | string;
      /** Supplier source identifier */
      source_id?: string;
      /** Contract ID with supplier */
      contract_id?: string;
      /** Supplier username */
      user_name?: string;
    };
    /** HTTP request metadata */
    request_metadata?: any;
    /** Error code identifier */
    error_code?: string;
    /** Error stack trace */
    error_stack?: string;
    /** Additional metadata */
    metadata?: any;
    /** Environment context */
    environment?: string;
    /** Service context */
    service?: string;
  }

  export class TelegramClient {
    constructor(config: TelegramClientConfig);
    sendMessage(options: SendMessageOptions): Promise<any>;
    sendErrorAlert(options: SendMessageOptions): Promise<any>;
    sendStartupNotification(options?: Partial<SendMessageOptions>): Promise<any>;
    sendCustomNotification(options: SendMessageOptions): Promise<any>;
    getConfig(): TelegramClientConfig;
  }

  /**
   * Options for saving provider log data
   */
  export interface SaveProviderLogOptions {
    /** Action/operation name being logged */
    action: string;
    /** HTTP request object */
    req: any;
    /** HTTP response object */
    res: any;
    /** Provider/supplier code identifier */
    code: string;
    /** Provider/supplier name */
    name: string;
    /** Generate random filename (default: false) */
    random?: boolean;
    /** Processing time in milliseconds */
    time?: number;
  }

  /**
   * Options for saving provider cURL command
   */
  export interface SaveProviderCurlOptions {
    /** Provider/supplier name */
    name: string;
    /** HTTP request details */
    request: {
      /** HTTP method (GET, POST, PUT, DELETE, etc.) */
      method: string;
      /** Request URL */
      url: string;
      /** HTTP headers object */
      headers?: Record<string, string>;
      /** Request body data */
      body?: any;
    };
    /** Provider/supplier code identifier */
    code: string;
    /** Action/operation name (optional) */
    action?: string;
    /** Generate random filename (default: false) */
    random?: boolean;
    /** Processing time in milliseconds */
    time?: number;
  }

  /**
   * Logging functions for provider request/response data
   */
  
  /** Save HTTP request/response log to file */
  export function saveProviderLog(options: SaveProviderLogOptions): void;
  
  /** Save cURL command equivalent of HTTP request */
  export function saveProviderCurl(options: SaveProviderCurlOptions): void;

  /**
   * Configuration for Telegram Webhook Client
   */
  export interface TelegramWebhookConfig {
    /** Telegram bot token from @BotFather (required) */
    botToken: string;
    /** HTTPS webhook URL to receive updates */
    webhookUrl: string;
    /** Secret token for webhook security (optional but recommended) */
    secretToken?: string;
    /** Array of update types to receive (optional) */
    allowedUpdates?: string[];
    /** Maximum connections for webhook (1-100, default: 40) */
    maxConnections?: number;
    /** Webhook timeout in seconds (default: 60) */
    timeout?: number;
  }

  /**
   * Telegram Webhook Client interface for managing webhooks
   */
  export interface TelegramWebhookClient {
    /** Set webhook URL with Telegram */
    setWebhook(): Promise<any>;
    /** Get current webhook information */
    getWebhookInfo(): Promise<any>;
    /** Delete/remove webhook */
    deleteWebhook(): Promise<any>;
    /** Verify incoming webhook request authenticity */
    verifyRequest(secretToken: string): boolean;
    /** Parse incoming webhook update */
    parseUpdate(body: any): any;
  }

  /** Create Telegram webhook client instance */
  export function createTelegramWebhookClient(config: TelegramWebhookConfig): TelegramWebhookClient;

  /**
   * Data filtering utilities for alert components
   */

  /**
   * Filter data object based on specific field configuration
   * @param data - Original data object to filter
   * @param specific - Array of allowed fields with their configurations
   * @param strictMode - If true, only include fields defined in specific array
   * @returns Filtered data object containing only allowed fields
   */
  export function filterDataBySpecific<T extends Record<string, any>>(
    data: T,
    specific: Array<{
      /** Field name for Slack alerts */
      key?: string;
      /** Field name for Telegram/Mattermost alerts */
      field?: string;
      [key: string]: any;
    }>,
    strictMode?: boolean
  ): Partial<T>;

  /**
   * Validate specific configuration array format
   * @param specific - Specific configuration to validate
   * @returns True if configuration is valid, false otherwise
   */
  export function validateSpecificConfig(
    specific: Array<{
      key?: string;
      field?: string;
      [key: string]: any;
    }>
  ): boolean;

  /**
   * Extract field names from specific configuration array
   * @param specific - Specific configuration array
   * @returns Array of field names (key or field properties)
   */
  export function getFieldNamesFromSpecific(
    specific: Array<{
      key?: string;
      field?: string;
      [key: string]: any;
    }>
  ): string[];

  // Utility Functions
  export function createTelegramClient(config: TelegramClientConfig): TelegramClient;

  /**
   * Usage Examples:
   * 
   * // Individual Alert with StrictMode
   * const telegramAlert = new TelegramAlert({
   *   botToken: 'your-bot-token',
   *   chatId: 'your-chat-id',
   *   specific: [
   *     { field: 'error', markdown: false },
   *     { field: 'message', markdown: true }
   *   ],
   *   strictMode: true // Only send error and message fields
   * });
   * 
   * // MultiChannelAlert with Global Configuration
   * const multiAlert = new MultiChannelAlert({
   *   service: 'hotel',
   *   beauty: true,
   *   specific: [{ field: 'error' }, { field: 'message' }],
   *   strictMode: true,
   *   channels: [
   *     {
   *       type: 'telegram',
   *       config: {
   *         botToken: 'bot-token',
   *         chatId: 'chat-id',
   *         // Channel overrides global specific
   *         specific: [
   *           { field: 'error', markdown: false },
   *           { field: 'message', markdown: true },
   *           { field: 'timestamp', markdown: false }
   *         ]
   *       }
   *     }
   *   ]
   * });
   * 
   * // Data Filtering
   * const alertData = {
   *   error: 'System error',
   *   message: 'Database failed',
   *   user_id: 'user123',     // Filtered out if not in specific
   *   metadata: { info: 'x' } // Filtered out if not in specific
   * };
   * 
   * await telegramAlert.error(alertData); // Only sends error + message
   */
}