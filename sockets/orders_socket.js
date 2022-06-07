module.exports = (io) => {
    const namespace = io.of('/orders/delivery')
    namespace.on('connection', (socket) => {
        console.log('USER CONNECTED TO SOCKET IO /orders/delivery')
        socket.on('position', (data) => {
            console.log('CUSTOMER INFORMATION BY SOCKET IO', data)
            namespace.emit(`position/${data.id_order}`, { id_order: data.id_order, latitude: data.latitude, longitude: data.longitude })
        })
        socket.on('delivered', (data) => {
            console.log('DELIVERY INFORMATION BY SOCKET IO', data)
            namespace.emit(`delivered/${data.id_order}`, { id_order: data.id_order })
        })
        socket.on('disconnect', (data) => {
            console.log('USER DISCONNECTED FROM SOCKET IO')
        })
    })
}