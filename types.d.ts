declare module 'kien-nguyen-support' {
  // Common Types
  export type ServiceType = 'hotel' | 'flight' | 'tour' | 'transfer' | any;
  export type EnvironmentType = 'DEV' | 'STAGING' | 'PRODUCTION';
  export type AlertChannelType = 'telegram' | 'slack' | 'mattermost' | 'email' | 'discord' | 'zalo' | 'messenger' | 'n8n';

  // Alert Data Interface
  export interface AlertData {
    message?: string;
    error_message?: string;
    error_code?: string;
    error_stack?: string;
    user_id?: string;
    user_email?: string;
    booking_id?: string;
    search_id?: string;
    trace_id?: string;
    log_id?: string;
    request_id?: string;
    supplier?: {
      code?: string;
      id?: number | string;
      source_id?: string;
      contract_id?: string;
      user_name?: string;
    };
    request_metadata?: any;
    metadata?: any;
    environment?: EnvironmentType;
    service?: ServiceType;
    [key: string]: any;
  }

  // Base Alert Config
  export interface BaseAlertConfig {
    service?: ServiceType;
    environment?: EnvironmentType;
    beauty?: boolean;
    timeout?: number;
    specific?: Array<{
      key: string;
      label: string;
      priority?: number;
    }>;
  }

  // Multi-Channel Alert Types
  export interface MultiChannelAlertConfig {
    channels: ChannelConfig[];
    service?: ServiceType;
    environment?: EnvironmentType;
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
  export interface TelegramAlertConfig extends BaseAlertConfig {
    botToken: string;
    chatId: string;
    disableNotification?: boolean;
    messageThreadIds?: Record<string, number>;
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
  export interface SlackAlertConfig extends BaseAlertConfig {
    webhookUrl: string;
    channel?: string;
    channels?: Record<string, string>;
    action?: string;
  }

  export class SlackAlert {
    constructor(config: SlackAlertConfig);
    error(data: AlertData): Promise<any>;
    info(data: AlertData): Promise<any>;
    warn(data: AlertData): Promise<any>;
    success(data: AlertData): Promise<any>;
  }

  // Mattermost Alert
  export interface MattermostAlertConfig extends BaseAlertConfig {
    url: string;
    token: string;
    chatId: string;
  }

  export class MattermostAlert {
    constructor(config: MattermostAlertConfig);
    error(data: AlertData): Promise<any>;
    info(data: AlertData): Promise<any>;
    warn(data: AlertData): Promise<any>;
    success(data: AlertData): Promise<any>;
  }

  // Email Alert
  export interface EmailAlertConfig extends BaseAlertConfig {
    host: string;
    port: number;
    secure?: boolean;
    auth: {
      user: string;
      pass: string;
    };
    from: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
  }

  export class EmailAlert {
    constructor(config: EmailAlertConfig);
    error(data: AlertData): Promise<any>;
    info(data: AlertData): Promise<any>;
    warn(data: AlertData): Promise<any>;
    success(data: AlertData): Promise<any>;
  }

  // Discord Alert
  export interface DiscordAlertConfig extends BaseAlertConfig {
    webhookUrl: string;
    username?: string;
    avatar?: string;
  }

  export class DiscordAlert {
    constructor(config: DiscordAlertConfig);
    error(data: AlertData): Promise<any>;
    info(data: AlertData): Promise<any>;
    warn(data: AlertData): Promise<any>;
    success(data: AlertData): Promise<any>;
  }

  // Zalo Alert
  export interface ZaloAlertConfig extends BaseAlertConfig {
    accessToken: string;
    userId: string;
  }

  export class ZaloAlert {
    constructor(config: ZaloAlertConfig);
    error(data: AlertData): Promise<any>;
    info(data: AlertData): Promise<any>;
    warn(data: AlertData): Promise<any>;
    success(data: AlertData): Promise<any>;
  }

  // Messenger Alert
  export interface MessengerAlertConfig extends BaseAlertConfig {
    pageAccessToken: string;
    recipientId: string;
  }

  export class MessengerAlert {
    constructor(config: MessengerAlertConfig);
    error(data: AlertData): Promise<any>;
    info(data: AlertData): Promise<any>;
    warn(data: AlertData): Promise<any>;
    success(data: AlertData): Promise<any>;
  }

  // N8n Alert
  export interface N8nAlertConfig extends BaseAlertConfig {
    webhookUrl: string;
    headers?: Record<string, string>;
  }

  export class N8nAlert {
    constructor(config: N8nAlertConfig);
    error(data: AlertData): Promise<any>;
    info(data: AlertData): Promise<any>;
    warn(data: AlertData): Promise<any>;
    success(data: AlertData): Promise<any>;
  }

  // Legacy Telegram Client (Backward Compatibility)
  export interface TelegramClientConfig {
    botToken: string;
    chatId: string;
    product?: string;
    environment?: string;
    messageThreadIds?: Record<string, number>;
    disableNotification?: boolean;
    timeout?: number;
  }

  export interface SendMessageOptions {
    error_message: string;
    type?: 'system' | 'third_party';
    metric?: string;
    user_email?: string;
    supplier?: {
      code?: string;
      id?: number | string;
      source_id?: string;
      contract_id?: string;
      user_name?: string;
    };
    request_metadata?: any;
    error_code?: string;
    error_stack?: string;
    metadata?: any;
    environment?: string;
    product?: string;
  }

  export class TelegramClient {
    constructor(config: TelegramClientConfig);
    sendMessage(options: SendMessageOptions): Promise<any>;
    sendErrorAlert(options: SendMessageOptions): Promise<any>;
    sendStartupNotification(options?: Partial<SendMessageOptions>): Promise<any>;
    sendCustomNotification(options: SendMessageOptions): Promise<any>;
    getConfig(): TelegramClientConfig;
  }

  // Logging Functions
  export interface SaveProviderLogOptions {
    action: string;
    req: any;
    res: any;
    code: string;
    name: string;
    random?: boolean;
    time?: number;
  }

  export interface SaveProviderCurlOptions {
    name: string;
    request: {
      method: string;
      url: string;
      headers?: Record<string, string>;
      body?: any;
    };
    code: string;
    action?: string;
    random?: boolean;
    time?: number;
  }

  export function saveProviderLog(options: SaveProviderLogOptions): void;
  export function saveProviderCurl(options: SaveProviderCurlOptions): void;

  // Webhook Client
  export interface TelegramWebhookConfig {
    botToken: string;
    webhookUrl: string;
    secretToken?: string;
    allowedUpdates?: string[];
    maxConnections?: number;
    timeout?: number;
  }

  export interface TelegramWebhookClient {
    setWebhook(): Promise<any>;
    getWebhookInfo(): Promise<any>;
    deleteWebhook(): Promise<any>;
    verifyRequest(secretToken: string): boolean;
    parseUpdate(body: any): any;
  }

  export function createTelegramWebhookClient(config: TelegramWebhookConfig): TelegramWebhookClient;

  // Utility Functions
  export function createTelegramClient(config: TelegramClientConfig): TelegramClient;
}