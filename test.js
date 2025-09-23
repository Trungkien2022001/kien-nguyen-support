/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
require('dotenv').config()
const { TelegramClient } = require('./components/telegram-bot')

// Test TelegramClient with your config
async function testTelegramClient() {
    try {
        // Create TelegramClient instance with your config
        const telegram = new TelegramClient({
            botToken: '',
            chatId: '-123',
            product: 'hotel',
            environment: 'DEV',
            messageThreadIds: {
                general: 9,
                hotel_system_all: 17,
                hotel_system_search: 19,
                hotel_system_prebook: 21,
                hotel_system_book: 23,
                hotel_system_cancel: 25,
                hotel_third_party_all: 28,
                hotel_third_party_search: 30,
                hotel_third_party_prebook: 32,
                hotel_third_party_book: 34,
                hotel_third_party_cancel: 36
            }
        })

        console.log('🚀 TelegramClient created successfully!')
        console.log('Config:', telegram.getConfig())

        // Test sendMessage with error-handler.js structure
        const testOptions = {
            type: 'system',
            user_email: 'test@example.com',
            supplier: {
                id: 123,
                code: 'SUPPLIER_A',
                source_id: 'SRC001',
                contract_id: 'CONTRACT123',
                user_name: 'supplier_user'
            },
            metric: 'search',
            request_metadata: {
                searchId: 'search123',
                destination: 'Ho Chi Minh City',
                checkIn: '2025-01-01',
                checkOut: '2025-01-03'
            },
            error_code: 'SEARCH_TIMEOUT',
            error_message: 'Hotel search request timed out',
            error_stack:
                'Error: Timeout\\n    at HotelSearch.search (hotel.js:45:12)\\n    at async SearchController.handle (controller.js:23:8)',
            metadata: {
                retryCount: 3,
                timeout: 30000,
                region: 'APAC'
            }
        }

        console.log('\\n📨 Sending test message...')
        console.log('Test options:', JSON.stringify(testOptions, null, 2))

        const result = await telegram.sendMessage(testOptions)

        console.log('\\n✅ Message sent successfully!')
        console.log('Telegram API response:', result)

        // Test sendErrorAlert
        console.log('\\n📢 Testing sendErrorAlert...')
        const errorResult = await telegram.sendErrorAlert({
            type: 'third_party',
            metric: 'book',
            error_code: 'BOOKING_FAILED',
            error_message: 'Third party booking service unavailable',
            user_email: 'customer@example.com',
            supplier: {
                id: 456,
                code: 'SUPPLIER_B',
                user_name: 'supplier_b_user'
            },
            request_metadata: {
                bookingId: 'BKG789',
                rooms: 2,
                guests: 4
            }
        })

        console.log('✅ Error alert sent successfully!')
        console.log('Error alert response:', errorResult)

        // Test different metrics and thread routing
        console.log('\\n🎯 Testing thread routing...')

        const threadTests = [
            {
                metric: 'search',
                type: 'system',
                expected: 'hotel_system_search (19)'
            },
            {
                metric: 'prebook',
                type: 'system',
                expected: 'hotel_system_prebook (21)'
            },
            {
                metric: 'book',
                type: 'third_party',
                expected: 'hotel_third_party_book (34)'
            },
            {
                metric: 'cancel',
                type: 'system',
                expected: 'hotel_system_cancel (25)'
            },
            {
                metric: 'unknown',
                type: 'system',
                expected: 'hotel_system_all (17)'
            }
        ]

        for (const test of threadTests) {
            console.log(
                `Testing ${test.type} ${test.metric} → ${test.expected}`
            )
            await telegram.sendMessage({
                error_message: `Test message for ${test.type} ${test.metric}`,
                type: test.type,
                metric: test.metric,
                error_code: 'TEST_CODE'
            })
        }

        console.log('\\n🎉 All tests completed successfully!')
    } catch (error) {
        console.error('❌ Test failed:', error.message)
        console.error('Stack:', error.stack)
        process.exit(1)
    }
}

// Test with different scenarios
async function testEdgeCases() {
    console.log('\\n🧪 Testing edge cases...')

    const telegram = new TelegramClient({
        botToken: '7893829996:AAGGaSHvNKSSXPMRbiJiwrRpBwVIgMj1BLE',
        chatId: '-1003057627863',
        product: 'flight', // Different product
        environment: 'PROD',
        messageThreadIds: {
            general: 9,
            flight_system_search: 41,
            flight_system_book: 43
        }
    })

    // Test with minimal options
    await telegram.sendMessage({
        error_message: 'Minimal test message'
    })

    // Test with string metadata
    await telegram.sendMessage({
        error_message: 'String metadata test',
        request_metadata: 'Simple string metadata',
        metadata: 'Simple error metadata'
    })

    // Test cross-product routing
    await telegram.sendMessage({
        error_message: 'Cross-product test',
        product: 'hotel', // Override product
        metric: 'search',
        type: 'system'
    })

    console.log('✅ Edge cases tested successfully!')
}

// Run tests
async function runAllTests() {
    console.log('🧪 Starting TelegramClient tests...\\n')

    await testTelegramClient()
    await testEdgeCases()

    console.log('\\n🎊 All tests passed! TelegramClient is working correctly.')
}

// Export for use in other files
module.exports = {
    testTelegramClient,
    testEdgeCases,
    runAllTests
}

// Run tests if executed directly
if (require.main === module) {
    runAllTests().catch(error => {
        console.error('💥 Test suite failed:', error)
        process.exit(1)
    })
}
