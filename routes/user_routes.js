const usersController = require('../controllers/users_controller')
module.exports = (app, upload) => {
    app.post('/api/users/register', usersController.register)
    app.post('/api/users/registerWithImage', upload.array('image', 1), usersController.registerWithImage)
    app.post('/api/users/login', usersController.login)
}