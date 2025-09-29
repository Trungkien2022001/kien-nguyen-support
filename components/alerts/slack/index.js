const SlackAlert = require('./slack-client')

module.exports = {
    SlackAlert,
    createClient: config => new SlackAlert(config)
}
