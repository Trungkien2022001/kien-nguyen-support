/**
 * n8n alert client class with pre-configured settings
 *
 * INITIALIZATION REQUIREMENTS:
 * - webhookUrl (string, required): n8n webhook URL OR n8nUrl for API
 * - environment (string, optional): Default environment ('DEV', 'STAGING', 'PROD')
 * - beautyMessage (boolean, optional): Enable structured formatting (default: true)
 * - timeout (number, optional): Request timeout in milliseconds
 * - apiKey (string, optional): n8n API key for authentication
 * - basicAuth (object, optional): Basic auth credentials {username, password}
 * - headers (object, optional): Custom headers
 * - workflowId (string, optional): For direct workflow execution
 * - n8nUrl (string, optional): n8n instance URL for API calls
 *
 * @example
 * // Webhook approach (recommended)
 * const n8nAlert = new N8nAlert({
 *     webhookUrl: 'https://n8n.example.com/webhook/alerts',
 *     environment: 'PROD',
 *     beautyMessage: true,
 *     apiKey: 'your-api-key'
 * })
 *
 * // API workflow execution approach
 * const n8nAlert = new N8nAlert({
 *     n8nUrl: 'https://n8n.example.com',
 *     workflowId: 'workflow-uuid',
 *     apiKey: 'your-api-key',
 *     beautyMessage: true
 * })
 */

const {
    sendMessage,
    error,
    info,
    warn,
    success,
    triggerWorkflow
} = require('./alert')

class N8nAlert {
    /**
     * Create n8n alert client instance
     * @param {Object} config - n8n configuration
     * @param {string} config.webhookUrl - n8n webhook URL (for webhook approach)
     * @param {string} config.n8nUrl - n8n instance URL (for API approach)
     * @param {string} config.workflowId - Workflow ID (for API approach)
     * @param {string} config.environment - Default environment (DEV, STAGING, PROD)
     * @param {boolean} config.beautyMessage - Enable structured formatting (default: true)
     * @param {string} config.apiKey - n8n API key (optional)
     * @param {Object} config.basicAuth - Basic auth {username, password} (optional)
     * @param {Object} config.headers - Custom headers (optional)
     * @param {number} config.timeout - Default timeout (optional)
     */
    constructor(config) {
        const {
            webhookUrl,
            n8nUrl,
            workflowId,
            environment = 'STAGING',
            beautyMessage = true,
            apiKey,
            basicAuth,
            headers = {},
            timeout = 10000
        } = config

        if (!webhookUrl && !n8nUrl) {
            throw new Error('N8nAlert requires either webhookUrl or n8nUrl')
        }

        if (n8nUrl && !workflowId) {
            throw new Error(
                'workflowId is required when using n8nUrl (API approach)'
            )
        }

        this.config = {
            webhookUrl,
            n8nUrl,
            workflowId,
            environment,
            beautyMessage,
            apiKey,
            basicAuth,
            headers,
            timeout
        }

        // Bind methods to maintain context
        this.sendMessage = sendMessage.bind(this)
        this.error = error.bind(this)
        this.info = info.bind(this)
        this.warn = warn.bind(this)
        this.success = success.bind(this)
        this.triggerWorkflow = triggerWorkflow.bind(this)
    }

    /**
     * Get current configuration (without sensitive data)
     * @returns {Object} Current config
     */
    getConfig() {
        const { apiKey, basicAuth, ...safeConfig } = this.config

        return {
            ...safeConfig,
            apiKey: apiKey ? '[HIDDEN]' : null,
            basicAuth: basicAuth ? '[HIDDEN]' : null
        }
    }

    /**
     * Send webhook message (default method)
     */
    async send(options) {
        return this.sendMessage(options)
    }

    /**
     * Execute workflow directly via API
     */
    async execute(options) {
        return this.triggerWorkflow(options)
    }
}

module.exports = N8nAlert
