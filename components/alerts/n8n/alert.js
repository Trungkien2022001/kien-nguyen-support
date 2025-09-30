const { httpClient } = require('../../../utils')

/**
 * Get alert severity based on type
 * @param {string} type - Alert type
 * @returns {string} Severity level
 */
function getAlertSeverity(type) {
    switch (type) {
        case 'error':
            return 'high'
        case 'warn':
        case 'warning':
            return 'medium'
        case 'info':
            return 'low'
        case 'success':
            return 'info'
        default:
            return 'medium'
    }
}

/**
 * Build n8n message with beauty formatting options
 * @param {Object} data - Data object with dynamic properties
 * @param {boolean} beauty - Enable structured formatting
 * @param {Array} specific - Specific field configurations
 * @param {string} type - Alert type
 * @param {string} environment - Environment
 * @returns {Object} Formatted n8n message payload
 */
function buildN8nMessage(
    data,
    beauty = true,
    specific = [],
    type = 'error',
    environment = 'STAGING'
) {
    if (!beauty) {
        // Simple flat format
        const flatData = {
            timestamp: new Date().toISOString(),
            environment,
            type
        }

        // Auto-display all object properties
        Object.keys(data).forEach(key => {
            if (data[key] != null) {
                flatData[key] = data[key]
            }
        })

        return flatData
    }

    // Rich structured format for n8n workflow processing
    const payload = {
        alert: {
            timestamp: new Date().toISOString(),
            environment,
            severity: getAlertSeverity(type),
            type,
            status: 'active'
        },
        data: {}
    }

    // Handle specific field configurations first
    if (specific && specific.length > 0) {
        specific.forEach(fieldConfig => {
            const value = data[fieldConfig.key]
            if (value != null) {
                const label = fieldConfig.label || fieldConfig.key
                payload.data[label] = value
            }
        })
    }

    // Auto-display remaining object properties
    Object.keys(data).forEach(key => {
        // Skip if already handled in specific fields
        const isSpecific =
            specific && specific.some(fieldConfig => fieldConfig.key === key)
        if (!isSpecific && data[key] != null) {
            payload.data[key] = data[key]
        }
    })

    // Add structured fields for common data
    if (data.message || data.error_message) {
        payload.alert.message = data.message || data.error_message
    }

    if (data.error_code) {
        payload.alert.error_code = data.error_code
    }

    return payload
}

/**
 * Build n8n payload
 * @param {Object} data - Data to send
 * @param {Object} options - n8n config
 * @returns {Object} n8n payload
 */
function buildN8nPayload(data, options) {
    const {
        beauty = true,
        specific = [],
        type = 'error',
        environment = 'STAGING'
    } = options

    return buildN8nMessage(data, beauty, specific, type, environment)
}

/**
 * Send n8n webhook message
 * @param {Object} data - Data to send
 * @param {Object} options - Send options
 */
async function sendMessage(data, options = {}) {
    // Merge with instance config
    const config = { ...this.config, ...options }

    try {
        const payload = buildN8nPayload(data, config)

        // Add custom headers if specified
        const headers = {
            'Content-Type': 'application/json',
            ...config.headers
        }

        // Add authentication if specified
        if (config.apiKey) {
            headers.Authorization = `Bearer ${config.apiKey}`
        }

        if (config.basicAuth) {
            const auth = Buffer.from(
                `${config.basicAuth.username}:${config.basicAuth.password}`
            ).toString('base64')
            headers.Authorization = `Basic ${auth}`
        }

        const response = await httpClient.post(config.webhookUrl, payload, {
            timeout: config.timeout || 10000,
            headers
        })

        return response.data
    } catch (err) {
        throw new Error(`Failed to send n8n message: ${err.message}`)
    }
}

/**
 * Send error alert
 * @param {Object} data - Error data
 * @param {Object} options - Send options
 * @returns {Promise<Object>} n8n sending result
 */
async function error(data, options = {}) {
    return sendMessage.call(this, data, { ...options, type: 'error' })
}

/**
 * Send info alert
 * @param {Object} data - Info data
 * @param {Object} options - Send options
 * @returns {Promise<Object>} n8n sending result
 */
async function info(data, options = {}) {
    return sendMessage.call(this, data, { ...options, type: 'info' })
}

/**
 * Send warning alert
 * @param {Object} data - Warning data
 * @param {Object} options - Send options
 * @returns {Promise<Object>} n8n sending result
 */
async function warn(data, options = {}) {
    return sendMessage.call(this, data, { ...options, type: 'warn' })
}

/**
 * Send success alert
 * @param {Object} data - Success data
 * @param {Object} options - Send options
 * @returns {Promise<Object>} n8n sending result
 */
async function success(data, options = {}) {
    return sendMessage.call(this, data, { ...options, type: 'success' })
}

/**
 * Trigger n8n workflow execution (if using n8n API instead of webhook)
 * @param {Object} data - Alert data
 * @param {Object} options - Alert options
 */
async function triggerWorkflow(data, options = {}) {
    // Merge with instance config
    const config = { ...this.config, ...options }

    if (!config.workflowId) {
        throw new Error('workflowId is required for workflow execution')
    }

    try {
        const payload = buildN8nPayload(data, config)

        const headers = {
            'Content-Type': 'application/json'
        }

        if (config.apiKey) {
            headers.Authorization = `Bearer ${config.apiKey}`
        }

        const url = `${config.n8nUrl}/api/v1/workflows/${config.workflowId}/execute`

        const response = await httpClient.post(
            url,
            { data: payload },
            {
                timeout: config.timeout || 10000,
                headers
            }
        )

        return response.data
    } catch (err) {
        throw new Error(`Failed to trigger n8n workflow: ${err.message}`)
    }
}

module.exports = {
    buildN8nMessage,
    buildN8nPayload,
    sendMessage,
    error,
    info,
    warn,
    success,
    triggerWorkflow
}
