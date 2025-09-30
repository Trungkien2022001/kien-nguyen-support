const http = require('http')
const https = require('https')
const { URL } = require('url')

/**
 * Native HTTP client to replace axios
 * Provides a simple interface similar to axios
 */

/**
 * Make HTTP request using native Node.js modules
 * @param {Object} options - Request options
 * @param {string} options.method - HTTP method (GET, POST, etc.)
 * @param {string} options.url - Request URL
 * @param {Object} options.headers - Request headers
 * @param {string|Object} options.data - Request body data
 * @param {number} options.timeout - Request timeout in ms
 * @returns {Promise} Promise resolving to response object
 */
function request(options = {}) {
    return new Promise((resolve, reject) => {
        const {
            method = 'GET',
            url,
            headers = {},
            data,
            timeout = 10000
        } = options

        if (!url) {
            reject(new Error('URL is required'))

            return
        }

        const parsedUrl = new URL(url)
        const isHttps = parsedUrl.protocol === 'https:'
        const httpModule = isHttps ? https : http

        // Prepare request body
        let body = ''
        if (data) {
            if (typeof data === 'object') {
                body = JSON.stringify(data)
                headers['Content-Type'] =
                    headers['Content-Type'] || 'application/json'
            } else {
                body = String(data)
            }
            headers['Content-Length'] = Buffer.byteLength(body)
        }

        const requestOptions = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (isHttps ? 443 : 80),
            path: parsedUrl.pathname + parsedUrl.search,
            method: method.toUpperCase(),
            headers,
            timeout
        }

        const req = httpModule.request(requestOptions, res => {
            let responseData = ''

            res.on('data', chunk => {
                responseData += chunk
            })

            res.on('end', () => {
                let parsedData
                try {
                    // Try to parse as JSON
                    parsedData = JSON.parse(responseData)
                } catch (error) {
                    // If not JSON, keep as string
                    parsedData = responseData
                }

                const response = {
                    data: parsedData,
                    status: res.statusCode,
                    statusText: res.statusMessage,
                    headers: res.headers,
                    config: options
                }

                // Check for HTTP error status codes
                if (res.statusCode >= 400) {
                    const error = new Error(
                        `Request failed with status ${res.statusCode}`
                    )
                    error.response = response
                    reject(error)
                } else {
                    resolve(response)
                }
            })
        })

        req.on('error', error => {
            reject(error)
        })

        req.on('timeout', () => {
            req.destroy()
            reject(new Error(`Request timeout after ${timeout}ms`))
        })

        // Write body data if present
        if (body) {
            req.write(body)
        }

        req.end()
    })
}

/**
 * GET request
 * @param {string} url - Request URL
 * @param {Object} config - Request configuration
 * @returns {Promise} Promise resolving to response object
 */
function get(url, config = {}) {
    return request({
        method: 'GET',
        url,
        ...config
    })
}

/**
 * POST request
 * @param {string} url - Request URL
 * @param {Object|string} data - Request body data
 * @param {Object} config - Request configuration
 * @returns {Promise} Promise resolving to response object
 */
function post(url, data, config = {}) {
    return request({
        method: 'POST',
        url,
        data,
        ...config
    })
}

/**
 * PUT request
 * @param {string} url - Request URL
 * @param {Object|string} data - Request body data
 * @param {Object} config - Request configuration
 * @returns {Promise} Promise resolving to response object
 */
function put(url, data, config = {}) {
    return request({
        method: 'PUT',
        url,
        data,
        ...config
    })
}

/**
 * DELETE request
 * @param {string} url - Request URL
 * @param {Object} config - Request configuration
 * @returns {Promise} Promise resolving to response object
 */
function deleteRequest(url, config = {}) {
    return request({
        method: 'DELETE',
        url,
        ...config
    })
}

/**
 * PATCH request
 * @param {string} url - Request URL
 * @param {Object|string} data - Request body data
 * @param {Object} config - Request configuration
 * @returns {Promise} Promise resolving to response object
 */
function patch(url, data, config = {}) {
    return request({
        method: 'PATCH',
        url,
        data,
        ...config
    })
}

// Export with axios-compatible interface
const httpClient = {
    request,
    get,
    post,
    put,
    delete: deleteRequest,
    patch
}

module.exports = httpClient
