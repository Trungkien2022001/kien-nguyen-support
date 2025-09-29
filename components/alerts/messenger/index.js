const MessengerAlert = require('./messenger-client')

module.exports = {
    MessengerAlert,
    createClient: config => new MessengerAlert(config)
}
