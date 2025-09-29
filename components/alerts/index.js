// Multi-channel alert components
const { SlackAlert } = require('./slack')
const { DiscordAlert } = require('./discord')
const { MessengerAlert } = require('./messenger')
const { MattermostAlert } = require('./mattermost')
const { N8nAlert } = require('./n8n')
const { TelegramAlert } = require('./telegram')
const { ZaloAlert } = require('./zalo')
const { EmailAlert } = require('./email')
const { MultiChannelAlert } = require('./multi-channel')

module.exports = {
    SlackAlert,
    DiscordAlert,
    MessengerAlert,
    MattermostAlert,
    N8nAlert,
    TelegramAlert,
    ZaloAlert,
    EmailAlert,
    MultiChannelAlert
}
