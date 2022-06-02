const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const logger = require('morgan')
const cors = require('cors')
const passport = require('passport')
const multer = require('multer')
const usersRoutes = require('./routes/user_routes')
const categoryRoutes = require('./routes/category_routes')
const productRoutes = require('./routes/product_routes')
const addressRoutes = require('./routes/address_routes')
const ordersRoutes = require('./routes/order_routes')
const port = process.env.PORT || 3000
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)
app.disable('x-powered-by')
app.set('port', port)
const upload = multer({ storage: multer.memoryStorage() })
usersRoutes(app, upload)
categoryRoutes(app)
productRoutes(app, upload)
addressRoutes(app)
ordersRoutes(app)
server.listen(3000, '192.168.0.50' || 'localhost', function () { console.log(`ACTIVE SERVER ${process.pid}...`) })
app.get('/', (req, res) => { res.send('Ruta raíz del servidor.') })
app.use((err, req, res, next) => {
    console.log(err)
    res.status(err.status || 500).send(err.stack)
})