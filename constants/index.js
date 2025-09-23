module.exports = {
    BASE_DIR: '__api-logs__',
    CURL_BASE_DIR: '__api-logs-curl__',
    OLD_LOGS_DIR: 'api-logs-old',
    LOG_FILE_PREFIX: 'api-logs-',
    DATE_FORMAT: 'YYYYMMDD',
    DATETIME_FORMAT: 'YYYYMMDD_HHmmss',
    TIME_FORMAT: 'HHmmss',
    FILE_EXTENSIONS: {
        JSON: 'json',
        XML: 'xml',
        TXT: 'txt'
    },
    REQUEST_SUFFIX: 'REQUEST',
    RESPONSE_SUFFIX: 'RESPONSE',
    CURL_SUFFIX: 'REQUEST_CURL',
    HTTP_METHODS: {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        DELETE: 'DELETE'
    },
    TELEGRAM: {
        API_BASE_URL: 'https://api.telegram.org/bot',
        PRODUCTS: {
            HOTEL: 'hotel',
            FLIGHT: 'flight',
            TOUR: 'tour',
            TRANSFER: 'transfer'
        },
        ERROR_TYPES: {
            VALIDATION: 'validation',
            SYSTEM: 'system',
            BUSINESS: 'business',
            NOT_FOUND: 'not_found',
            THIRD_PARTY: 'third_party',
            AUTHENTICATION: 'authentication',
            AUTHORIZATION: 'authorization',
            CONFIGURATION: 'configuration',
            UNEXPECTED: 'unexpected'
        },
        POLLING: {
            LOCK_KEY: 'telegram:polling:lock',
            LOCK_TTL: 90000,
            INTERVAL: 30000,
            ERROR_INTERVAL: 60000,
            TIMEOUT: 10000
        }
    }
}
