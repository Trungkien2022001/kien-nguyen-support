/**
 * Data filtering utilities for alert components
 */

/**
 * Filter data object based on specific field configuration
 * @param {Object} data - Original data object to filter
 * @param {Array} specific - Array of allowed fields or field configurations
 * @param {boolean} strictMode - If true, filter data; if false, return original data
 * @returns {Object} Filtered data object or original data
 */
function filterDataBySpecific(data, specific, strictMode = false) {
    // If strictMode is disabled, return original data
    if (!strictMode) {
        return data
    }

    // If no specific configuration, return original data
    if (!specific || specific.length === 0) {
        return data
    }

    // Extract allowed field names from specific configuration
    const allowedFields = specific
        .map(item => {
            if (typeof item === 'string') {
                return item
            }

            if (typeof item === 'object' && item !== null) {
                // Support both 'field' and 'key' properties for backward compatibility
                return item.field || item.key
            }

            return null
        })
        .filter(field => field !== null)

    // If no valid fields found, return original data
    if (allowedFields.length === 0) {
        return data
    }

    // Create filtered object with only allowed fields
    const filteredData = {}

    allowedFields.forEach(field => {
        if (Object.prototype.hasOwnProperty.call(data, field)) {
            filteredData[field] = data[field]
        }
    })

    return filteredData
}

/**
 * Validate specific configuration array
 * @param {Array} specific - Specific configuration to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateSpecificConfig(specific) {
    if (!Array.isArray(specific)) {
        return false
    }

    return specific.every(item => {
        if (typeof item === 'string') {
            return true
        }

        if (typeof item === 'object' && item !== null) {
            return item.field || item.key
        }

        return false
    })
}

/**
 * Get field names from specific configuration
 * @param {Array} specific - Specific configuration array
 * @returns {Array} Array of field names
 */
function getFieldNamesFromSpecific(specific) {
    if (!Array.isArray(specific)) {
        return []
    }

    return specific
        .map(item => {
            if (typeof item === 'string') {
                return item
            }

            if (typeof item === 'object' && item !== null) {
                return item.field || item.key
            }

            return null
        })
        .filter(field => field !== null)
}

module.exports = {
    filterDataBySpecific,
    validateSpecificConfig,
    getFieldNamesFromSpecific
}
