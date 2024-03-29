const db = require('../config/config')
const Rol = {}
Rol.create = (id_user, id_rol, result) => {
    const sql = `
    INSERT INTO
    user_has_roles(id_user, id_rol, created_at, updated_at)
VALUES
    (?, ?, ?, ?)
    `
    db.query(sql, [id_user, id_rol, new Date(), new Date()], (err, res) => {
        if (err) {
            console.log('ERROR', err)
            result(err, null)
        } else {
            console.log('ROL REGISTERED USER ID', res.insertId)
            result(null, res.insertId)
        }
    })
}
module.exports = Rol