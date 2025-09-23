function tryParseJson(text) {
    let json
    try {
        json = JSON.parse(text)
    } catch (e) {
        return text
    }

    return json
}


module.exports = {
    tryParseJson
}