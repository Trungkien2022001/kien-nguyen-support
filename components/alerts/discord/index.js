const DiscordAlert = require('./discord-client')
const { sendMessage, error, info, warn, success } = require('./alert')

module.exports = {
    DiscordAlert,
    sendMessage,
    error,
    info,
    warn,
    success
}
