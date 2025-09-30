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
const { WhatsAppAlert } = require('./whatsapp')
const { LineAlert } = require('./line')
const { ViberAlert } = require('./viber')
const { SkypeAlert } = require('./skype')
const { WeChatAlert } = require('./wechat')
const { RocketChatAlert } = require('./rocketchat')
const { FirebaseAlert } = require('./firebase')

module.exports = {
    SlackAlert,
    DiscordAlert,
    MessengerAlert,
    MattermostAlert,
    N8nAlert,
    TelegramAlert,
    ZaloAlert,
    EmailAlert,
    MultiChannelAlert,
    WhatsAppAlert,
    LineAlert,
    ViberAlert,
    SkypeAlert,
    WeChatAlert,
    RocketChatAlert,
    FirebaseAlert
}
