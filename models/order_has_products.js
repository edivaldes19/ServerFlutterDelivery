const db = require('../config/config')
const OrderHasProducts = {}
OrderHasProducts.create = (id_order, id_product, quantity, result) => {
    const sql = `
    INSERT INTO
    order_has_products(
        id_order,
        id_product,
        quantity,
        created_at,
        updated_at
    )
VALUES
    (?, ?, ?, ?, ?);
    `
    db.query(sql, [id_order, id_product, quantity, new Date(), new Date(),], (err, res) => {
        if (err) {
            console.log('ERROR', err)
            result(err, null)
        } else {
            console.log('ORDER HAS PRODUCTS', res.insertId)
            result(null, res.insertId)
        }
    })
}
module.exports = OrderHasProducts