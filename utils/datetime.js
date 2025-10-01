/**
 * DateTime utility functions to replace moment.js
 */

/**
 * Pad number with leading zeros
 * @param {number} num - Number to pad
 * @param {number} length - Target length
 * @returns {string} Padded string
 */
function pad(num, length = 2) {
    return String(num).padStart(length, '0')
}

/**
 * Format date to YYYYMMDD
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatDate(date = new Date()) {
    const year = date.getFullYear()
    const month = pad(date.getMonth() + 1)
    const day = pad(date.getDate())

    return `${year}${month}${day}`
}

/**
 * Format datetime to YYYYMMDD_HHmmss
 * @param {Date} date - Date object
 * @returns {string} Formatted datetime string
 */
function formatDateTime(date = new Date()) {
    const dateStr = formatDate(date)
    const hours = pad(date.getHours())
    const minutes = pad(date.getMinutes())
    const seconds = pad(date.getSeconds())

    return `${dateStr}_${hours}${minutes}${seconds}`
}

/**
 * Format time to HHmmss
 * @param {Date} date - Date object
 * @returns {string} Formatted time string
 */
function formatTime(date = new Date()) {
    const hours = pad(date.getHours())
    const minutes = pad(date.getMinutes())
    const seconds = pad(date.getSeconds())

    return `${hours}${minutes}${seconds}`
}

/**
 * Get current timestamp in milliseconds
 * @returns {number} Current timestamp
 */
function now() {
    return Date.now()
}

/**
 * Create a new Date object
 * @param {...any} args - Date constructor arguments
 * @returns {Date} New Date object
 */
function createDate(...args) {
    return new Date(...args)
}

module.exports = {
    pad,
    formatDate,
    formatDateTime,
    formatTime,
    now,
    createDate
}
