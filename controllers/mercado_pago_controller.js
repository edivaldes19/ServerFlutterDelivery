const mercadopago = require('mercadopago')
const Order = require('../models/order')
const OrderHasProducts = require('../models/order_has_products')
const PushNotificationsController = require('../controllers/push_notifications_controller')
const User = require('../models/user')
mercadopago.configure({
    sandbox: true,
    access_token: 'TEST-5263644221994596-060417-e9f9f99ff938f871abf7365adaf16de4-506130766'
})
module.exports = {
    async createPayment(req, res) {
        let payment = req.body
        console.log('PAYMENT', payment)
        const payment_data = {
            token: payment.token,
            issuer_id: payment.issuer_id,
            payment_method_id: payment.payment_method_id,
            transaction_amount: payment.transaction_amount,
            installments: payment.installments,
            payer: {
                email: payment.payer.email
                // identification: {
                //     type: payment.payer.identification.type,
                //     number: payment.payer.identification.number
                // },
            }
        }
        const data = await mercadopago.payment.create(payment_data).catch((err) => {
            console.log('MERCADO PAGO ERROR', err)
            return res.status(501).json({
                success: false,
                message: 'Error al efectuar el pago.',
                error: err
            })
        })
        if (data.body !== null && data.body !== undefined) {
            const order = payment.order
            Order.create(order, async (err, id) => {
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Error al agregar la orden',
                        error: err
                    })
                }
                for (const product of order.products) {
                    OrderHasProducts.create(id, product.id, product.quantity, (err, id_data) => {
                        if (err) {
                            return res.status(501).json({
                                success: false,
                                message: 'Error al agregarle productos a la orden.',
                                error: err
                            })
                        }
                    })
                }
                User.findAdmins((err, users) => {
                    if (users !== undefined && users !== null) {
                        if (users.length > 0) {
                            let tokens = []
                            users.forEach(u => {
                                tokens.push(u.notification_token)
                            })
                            console.log('TOKENS', tokens)
                            PushNotificationsController.sendNotificationMultipleDevices(tokens, {
                                title: 'Orden realizada',
                                body: 'Un cliente ha realizado una orden.',
                                id_notification: '2'
                            })
                        }
                    }
                })
                return res.status(201).json({
                    success: true,
                    message: 'Orden agregada exitosamente.',
                    data: data.response
                })
            })
        }
    }
}