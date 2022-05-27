const mysql = require('mysql')
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'flutter_delivery',
    database: 'db_delivery'
})
db.connect(function (err) {
    if (err) throw err
    console.log('CONNECTED TO THE DATABASE')
})
module.exports = db