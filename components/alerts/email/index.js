const EmailAlert = require('./email-client')
const { sendMessage, error, info, warn, success } = require('./alert')

module.exports = {
    EmailAlert,
    sendMessage,
    error,
    info,
    warn,
    success
}
