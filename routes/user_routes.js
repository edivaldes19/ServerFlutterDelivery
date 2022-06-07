const usersController = require('../controllers/users_controller')
const passport = require('passport')
module.exports = (app, upload) => {
    app.post('/api/users/register', usersController.register)
    app.post('/api/users/registerWithImage', upload.array('image', 1), usersController.registerWithImage)
    app.post('/api/users/login', usersController.login)
    app.get('/api/users/findDeliveryMen', passport.authenticate('jwt', { session: false }), usersController.findDeliveryMen)
    app.put('/api/users/updateProfileWithImage', passport.authenticate('jwt', { session: false }), upload.array('image', 1), usersController.updateProfileWithImage)
    app.put('/api/users/updateProfileWithoutImage', passport.authenticate('jwt', { session: false }), usersController.updateProfileWithoutImage)
    app.put('/api/users/updateNotificationToken', passport.authenticate('jwt', { session: false }), usersController.updateNotificationToken);
}