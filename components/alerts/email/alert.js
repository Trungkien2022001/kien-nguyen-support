// const nodemailer = require('nodemailer')
// TODO: currentcy ignore nodemailer
const nodemailer = {}

/**
 * Build Email message with beauty formatting options
 * @param {Object} data - Data object to display
 * @param {boolean} beauty - Enable HTML formatting
 * @param {Array} specific - Specific field configurations
 * @returns {Object} Formatted email message
 */
function buildEmailMessage(data, beauty = true, specific = []) {
    const environment = data.environment || 'UNKNOWN'
    const subject = `🚨 ${environment} Alert: ${data.error_code ||
        data.message ||
        'System Notification'}`

    if (!beauty) {
        // Plain text format
        const lines = []

        if (specific && specific.length > 0) {
            specific.forEach(field => {
                const { key, title } = field
                const value = data[key]

                if (value !== undefined && value !== null) {
                    lines.push(`${title}: ${value}`)
                }
            })
        } else {
            // Auto-generate from all object keys
            Object.keys(data).forEach(key => {
                const value = data[key]

                if (
                    value !== undefined &&
                    value !== null &&
                    typeof value !== 'function'
                ) {
                    const title = key
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, l => l.toUpperCase())
                    const displayValue =
                        typeof value === 'object'
                            ? JSON.stringify(value, null, 2)
                            : value
                    lines.push(`${title}: ${displayValue}`)
                }
            })
        }

        return {
            subject,
            text: lines.join('\n')
        }
    }

    // HTML format
    let html = `
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: #f8f9fa; padding: 15px; border-left: 4px solid #dc3545; }
            .content { padding: 20px; }
            .field { margin: 10px 0; }
            .label { font-weight: bold; color: #495057; }
            .value { margin-left: 10px; font-family: monospace; background: #f8f9fa; padding: 2px 4px; border-radius: 3px; }
            .error-message { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin: 15px 0; }
            .stack-trace { background: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; border-radius: 5px; font-family: monospace; white-space: pre-wrap; }
            .object-section { background: #e7f3ff; border: 1px solid #b8daff; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="header">
            <h2>🚨 ${environment} Environment Alert</h2>
            <p>Alert generated at: ${new Date().toISOString()}</p>
        </div>
        
        <div class="content">
    `

    if (specific && specific.length > 0) {
        // Use specific field configurations
        specific.forEach(field => {
            const { key, title, emoji = '' } = field
            const value = data[key]

            if (value !== undefined && value !== null) {
                if (typeof value === 'object') {
                    html += `
                        <div class="object-section">
                            <strong>${emoji} ${title}:</strong><br>
                            <pre>${JSON.stringify(value, null, 2)}</pre>
                        </div>
                    `
                } else {
                    html += `
                        <div class="field">
                            <span class="label">${emoji} ${title}:</span>
                            <span class="value">${value}</span>
                        </div>
                    `
                }
            }
        })
    } else {
        // Auto-generate from all object keys
        Object.keys(data).forEach(key => {
            const value = data[key]

            if (
                value !== undefined &&
                value !== null &&
                typeof value !== 'function'
            ) {
                const title = key
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase())

                if (typeof value === 'object') {
                    html += `
                        <div class="object-section">
                            <strong>� ${title}:</strong><br>
                            <pre>${JSON.stringify(value, null, 2)}</pre>
                        </div>
                    `
                } else {
                    html += `
                        <div class="field">
                            <span class="label">📝 ${title}:</span>
                            <span class="value">${value}</span>
                        </div>
                    `
                }
            }
        })
    }

    html += `
        </div>
    </body>
    </html>
    `

    return {
        subject,
        html
    }
}

/**
 * Build Email payload
 * @param {Object} data - Data to send
 * @param {Object} options - Email config
 * @returns {Object} Email payload
 */
function buildEmailPayload(data, options) {
    const { beauty = true, specific = [], to, from } = options

    // Build message
    const emailData = buildEmailMessage(data, beauty, specific)

    return {
        from,
        to,
        subject: emailData.subject,
        ...emailData
    }
}

/**
 * Create nodemailer transporter
 */
function createTransporter(config) {
    if (config.smtpUrl) {
        // Use SMTP URL
        return nodemailer.createTransporter(config.smtpUrl)
    }

    // Use SMTP config object
    return nodemailer.createTransporter({
        host: config.host,
        port: config.port || 587,
        secure: config.secure || false,
        auth: {
            user: config.user,
            pass: config.password
        }
    })
}

/**
 * Send message to Email
 * @param {Object} data - Data to send
 * @param {Object} options - Send options (can override defaults)
 */
async function sendMessage(data, options = {}) {
    if (!data) {
        throw new Error('data is required')
    }

    // Merge with instance config
    const config = { ...this.config, ...options }

    try {
        const transporter = createTransporter(config)
        const mailOptions = buildEmailPayload(data, config)

        await transporter.sendMail(mailOptions)

        return { success: true }
    } catch (err) {
        throw new Error(`Failed to send email: ${err.message}`)
    }
}

/**
 * Send error alert
 * @param {Object} data - Error data
 * @param {Object} options - Send options
 */
async function error(data, options = {}) {
    return this.sendMessage(data, { ...options, type: 'error' })
}

/**
 * Send info alert
 * @param {Object} data - Info data
 * @param {Object} options - Send options
 */
async function info(data, options = {}) {
    return this.sendMessage(data, { ...options, type: 'info' })
}

/**
 * Send warning alert
 * @param {Object} data - Warning data
 * @param {Object} options - Send options
 */
async function warn(data, options = {}) {
    return this.sendMessage(data, { ...options, type: 'warning' })
}

/**
 * Send success alert
 * @param {Object} data - Success data
 * @param {Object} options - Send options
 */
async function success(data, options = {}) {
    return this.sendMessage(data, { ...options, type: 'success' })
}

module.exports = {
    buildEmailMessage,
    buildEmailPayload,
    createTransporter,
    sendMessage,
    error,
    info,
    warn,
    success
}
