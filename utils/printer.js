const { tryParseJson } = require('./parser')

function printJson(value) {
    const objValue = tryParseJson(value)
    if (typeof objValue === 'object') {
        return JSON.stringify(objValue, null, 2)
    }

    return value
}

/**
 * Format error stack to show only first 2 lines
 * @param {string} errorStack - Error stack trace
 * @returns {string} Formatted stack with only first 2 lines
 */
function printStack(errorStack) {
    if (!errorStack || typeof errorStack !== 'string') {
        return errorStack
    }

    const stackLines = errorStack.split('\n')
    if (stackLines.length <= 2) {
        return errorStack
    }

    return stackLines.slice(0, 2).join('\n')
}

module.exports = {
    printJson,
    printStack
}
