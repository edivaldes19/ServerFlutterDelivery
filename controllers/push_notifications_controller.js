const https = require('https')
module.exports = {
    sendNotification(token, data) {
        const notification = JSON.stringify({
            'to': token,
            'data': {
                'click_action': 'FLUTTER_NOTIFICATION_CLICK',
                'title': data.title,
                'body': data.body,
                'id_notification': data.id_notification,
            },
            'notification': {
                'click_action': 'FLUTTER_NOTIFICATION_CLICK',
                'title': data.title,
                'body': data.body,
                'id_notification': data.id_notification,
            },
            'priority': 'high',
            'ttl': '4500s'
        })
        const options = {
            hostname: 'fcm.googleapis.com',
            path: '/fcm/send',
            method: 'POST',
            port: 443,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAA3ZntxQk:APA91bF8zi0280th_baNGPcBWSyzwSnj1ZUCKV2Z0wzdAQ18puZuop1I-7S3BG-FUWDI8UbfUasiOWdDxH6BRogw8h1_WglDZB6hHLwHQ7Fs7xRWfKjRZuu26yFnP6_erndnJUTP1vmd',
            }
        }
        const req = https.request(options, (res) => {
            console.log('STATUS CODE FIREBASE', res.statusCode)
            res.on('data', (d) => {
                process.stdout.write(d)
            })
        })
        req.on('error', (error) => {
            console.log('FIREBASE MESSAGING ERROR', error)
        })
        req.write(notification)
        req.end()
    },
    sendNotificationMultipleDevices(tokens, data) {
        const notification = JSON.stringify({
            'registration_ids': tokens,
            'data': {
                'click_action': 'FLUTTER_NOTIFICATION_CLICK',
                'title': data.title,
                'body': data.body,
                'id_notification': data.id_notification,
            },
            'notification': {
                'click_action': 'FLUTTER_NOTIFICATION_CLICK',
                'title': data.title,
                'body': data.body,
                'id_notification': data.id_notification,
            },
            'priority': 'high',
            'ttl': '4500s'
        })
        const options = {
            hostname: 'fcm.googleapis.com',
            path: '/fcm/send',
            method: 'POST',
            port: 443,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAA3ZntxQk:APA91bF8zi0280th_baNGPcBWSyzwSnj1ZUCKV2Z0wzdAQ18puZuop1I-7S3BG-FUWDI8UbfUasiOWdDxH6BRogw8h1_WglDZB6hHLwHQ7Fs7xRWfKjRZuu26yFnP6_erndnJUTP1vmd',
            }
        }
        const req = https.request(options, (res) => {
            console.log('STATUS CODE FIREBASE', res.statusCode)
            res.on('data', (d) => {
                process.stdout.write(d)
            })
        })
        req.on('error', (error) => {
            console.log('FIREBASE MESSAGING ERROR', error)
        })
        req.write(notification)
        req.end()
    }
}