const db = require('../config/config')
const Address = {}
Address.findByUser = (id_user, result) => {
    const sql = `
    SELECT
    CONVERT(id, char) AS id,
    name,
    address,
    reference,
    latitude,
    longitude,
    CONVERT(id_user, char) AS id_user
FROM
    address
WHERE
    id_user = ?;
    `
    db.query(sql, id_user, (err, data) => {
        if (err) {
            console.log('ERROR', err)
            result(err, null)
        } else {
            console.log('ADDRESS', data)
            result(null, data)
        }
    })
}
Address.create = (address, result) => {
    const sql = `
    INSERT INTO
    address(
        name,
        address,
        reference,
        latitude,
        longitude,
        id_user,
        created_at,
        updated_at
    )
VALUES
    (?, ?, ?, ?, ?, ?, ?, ?);
    `
    db.query(sql, [address.name, address.address, address.reference, address.latitude, address.longitude, address.id_user, new Date(), new Date()], (err, res) => {
        if (err) {
            console.log('ERROR', err)
            result(err, null)
        } else {
            console.log('ADDRESS ID', res.insertId)
            result(null, res.insertId)
        }
    })
}
module.exports = Address