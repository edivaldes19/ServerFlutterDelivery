const Order = require('../models/order')
const OrderHasProducts = require('../models/order_has_products')
const User = require('../models/user')
const PushNotificationsController = require('../controllers/push_notifications_controller')
module.exports = {
    findByStatus(req, res) {
        const status = req.params.status
        Order.findByStatus(status, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al mostrar las ordenes.',
                    error: err
                })
            }
            for (const d of data) {
                d.address = JSON.parse(d.address)
                d.client = JSON.parse(d.client)
                d.delivery = JSON.parse(d.delivery)
                d.products = JSON.parse(d.products)
            }
            return res.status(201).json(data)
        })
    },
    findByDeliveryAndStatus(req, res) {
        const id_delivery = req.params.id_delivery
        const status = req.params.status
        Order.findByDeliveryAndStatus(id_delivery, status, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al mostrar las ordenes.',
                    error: err
                })
            }
            for (const d of data) {
                d.address = JSON.parse(d.address)
                d.client = JSON.parse(d.client)
                d.delivery = JSON.parse(d.delivery)
                d.products = JSON.parse(d.products)
            }
            return res.status(201).json(data)
        })
    },
    findByClientAndStatus(req, res) {
        const id_client = req.params.id_client
        const status = req.params.status
        Order.findByClientAndStatus(id_client, status, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al mostrar las ordenes.',
                    error: err
                })
            }
            for (const d of data) {
                d.address = JSON.parse(d.address)
                d.client = JSON.parse(d.client)
                d.delivery = JSON.parse(d.delivery)
                d.products = JSON.parse(d.products)
            }
            return res.status(201).json(data)
        })
    },
    create(req, res) {
        const order = req.body
        Order.create(order, (err, id) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al agregar la orden.',
                    error: err
                })
            }
            for (const product of order.products) {
                OrderHasProducts.create(id, product.id, product.quantity, (err, id_data) => {
                    if (err) {
                        return res.status(501).json({
                            success: false,
                            message: 'Error al agregar productos a la orden.',
                            error: err
                        })
                    }
                })
            }
            return res.status(201).json({
                success: true,
                message: 'Orden creada exitosamente.',
                data: `${id}`
            })
        })
    },
    updateToReady(req, res) {
        const order = req.body
        Order.updateToReady(order.id, order.id_delivery, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al actualizar la orden.',
                    error: err
                })
            }
            User.findById(order.id_delivery, (err, delivery) => {
                if (delivery !== undefined && delivery !== null) {
                    console.log('NOTIFICATION TOKEN', delivery.notification_token)
                    PushNotificationsController.sendNotification(delivery.notification_token, {
                        title: `Hola ${delivery.name}`,
                        body: `Te han asignado un pedido para entregar.`,
                        id_notification: '1'
                    })
                }
            })
            return res.status(201).json({
                success: true,
                message: 'Orden actualizada exitosamente.',
                data: `${id_order}`
            })
        })
    },
    updateToOnTheWay(req, res) {
        const order = req.body
        Order.updateToOnTheWay(order.id, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al actualizar la orden.',
                    error: err
                })
            }
            return res.status(201).json({
                success: true,
                message: 'Orden actualizada exitosamente.',
                data: `${id_order}`
            })
        })
    },
    updateToDelivered(req, res) {
        const order = req.body
        Order.updateToDelivered(order.id, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al actualizar la orden.',
                    error: err
                })
            }
            return res.status(201).json({
                success: true,
                message: 'Orden actualizada exitosamente.',
                data: `${id_order}`
            })
        })
    },
    updateLatLng(req, res) {
        const order = req.body
        Order.updateLatLng(order, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al actualizar la orden.',
                    error: err
                })
            }
            return res.status(201).json({
                success: true,
                message: 'Orden actualizada exitosamente.',
                data: `${id_order}`
            })
        })
    }
}