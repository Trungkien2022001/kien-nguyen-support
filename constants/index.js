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
        MESSAGE_THREAD_IDS: {
            GENERAL: 'general',
            // Hotel threads
            HOTEL_SYSTEM_ALL: 'hotel_system_all',
            HOTEL_SYSTEM_SEARCH: 'hotel_system_search',
            HOTEL_SYSTEM_PREBOOK: 'hotel_system_prebook',
            HOTEL_SYSTEM_BOOK: 'hotel_system_book',
            HOTEL_SYSTEM_CANCEL: 'hotel_system_cancel',
            HOTEL_THIRD_PARTY_ALL: 'hotel_third_party_all',
            HOTEL_THIRD_PARTY_SEARCH: 'hotel_third_party_search',
            HOTEL_THIRD_PARTY_PREBOOK: 'hotel_third_party_prebook',
            HOTEL_THIRD_PARTY_BOOK: 'hotel_third_party_book',
            HOTEL_THIRD_PARTY_CANCEL: 'hotel_third_party_cancel',
            // Flight threads
            FLIGHT_SYSTEM_ALL: 'flight_system_all',
            FLIGHT_SYSTEM_SEARCH: 'flight_system_search',
            FLIGHT_SYSTEM_CONFIRM_TAX: 'flight_system_confirm_tax',
            FLIGHT_SYSTEM_GENERATE_PNR: 'flight_system_generate_pnr',
            FLIGHT_SYSTEM_GENERATE_ETICKET: 'flight_system_generate_eticket',
            FLIGHT_SYSTEM_RETRIEVE_PNR: 'flight_system_retrieve_pnr',
            FLIGHT_SYSTEM_RETRIEVE: 'flight_system_retrieve',
            FLIGHT_SYSTEM_CANCEL: 'flight_system_cancel',
            FLIGHT_THIRD_PARTY_ALL: 'flight_third_party_all',
            FLIGHT_THIRD_PARTY_SEARCH: 'flight_third_party_search',
            FLIGHT_THIRD_PARTY_CONFIRM_TAX: 'flight_third_party_confirm_tax',
            FLIGHT_THIRD_PARTY_GENERATE_PNR: 'flight_third_party_generate_pnr',
            FLIGHT_THIRD_PARTY_GENERATE_ETICKET: 'flight_third_party_generate_eticket',
            FLIGHT_THIRD_PARTY_RETRIEVE_PNR: 'flight_third_party_retrieve_pnr',
            FLIGHT_THIRD_PARTY_RETRIEVE: 'flight_third_party_retrieve',
            FLIGHT_THIRD_PARTY_CANCEL: 'flight_third_party_cancel',
            // Tour threads
            TOUR_SYSTEM_ALL: 'tour_system_all',
            TOUR_SYSTEM_SEARCH: 'tour_system_search',
            TOUR_SYSTEM_BOOK: 'tour_system_book',
            TOUR_SYSTEM_CANCEL: 'tour_system_cancel',
            TOUR_THIRD_PARTY_ALL: 'tour_third_party_all',
            TOUR_THIRD_PARTY_SEARCH: 'tour_third_party_search',
            TOUR_THIRD_PARTY_BOOK: 'tour_third_party_book',
            TOUR_THIRD_PARTY_CANCEL: 'tour_third_party_cancel',
            // Transfer threads
            TRANSFER_SYSTEM_ALL: 'transfer_system_all',
            TRANSFER_SYSTEM_SEARCH: 'transfer_system_search',
            TRANSFER_SYSTEM_BOOK: 'transfer_system_book',
            TRANSFER_SYSTEM_CANCEL: 'transfer_system_cancel',
            TRANSFER_THIRD_PARTY_ALL: 'transfer_third_party_all',
            TRANSFER_THIRD_PARTY_SEARCH: 'transfer_third_party_search',
            TRANSFER_THIRD_PARTY_BOOK: 'transfer_third_party_book',
            TRANSFER_THIRD_PARTY_CANCEL: 'transfer_third_party_cancel'
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
        METRICS: {
            // Hotel metrics
            HOTEL: {
                OFFER_SEARCH: 'offer_search',
                SEARCH_BY_REGION: 'search_by_region',
                SEARCH_BY_ID: 'search_by_id',
                SEARCHALL: 'searchall',
                SEARCH: 'search',
                OFFER_PREBOOK: 'offer_prebook',
                PREBOOK: 'prebook',
                OFFER_BOOK: 'offer_book',
                BOOK: 'book',
                BOOKING: 'booking',
                OFFER_CANCEL: 'offer_cancel',
                CANCEL: 'cancel'
            },
            // Flight metrics
            FLIGHT: {
                SEARCH: 'search',
                CONFIRM_TAX: 'confirm_tax',
                CONFIRM_TAXES: 'confirm_taxes',
                GENERATE_PNR: 'generate_pnr',
                GENERATE_ETICKET: 'generate_eticket',
                RETRIEVE_PNR: 'retrieve_pnr',
                RETRIEVE: 'retrieve',
                CANCEL: 'cancel'
            },
            // Tour metrics
            TOUR: {
                SEARCH: 'search',
                BOOK: 'book',
                BOOKING: 'booking',
                CANCEL: 'cancel'
            },
            // Transfer metrics
            TRANSFER: {
                SEARCH: 'search',
                BOOK: 'book',
                BOOKING: 'booking',
                CANCEL: 'cancel'
            }
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