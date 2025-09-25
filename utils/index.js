const parser = require('./parser')
const printer = require('./printer')

module.exports = {
    ...parser,
    ...printer
}
