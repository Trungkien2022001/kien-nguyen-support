declare module 'kien-nguyen-support' {
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
  export function createTelegramWebhookClient(config: any): any;
}