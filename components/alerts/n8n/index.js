const N8nAlert = require('./n8n-client')

module.exports = {
    N8nAlert,
    createClient: config => new N8nAlert(config)
}
