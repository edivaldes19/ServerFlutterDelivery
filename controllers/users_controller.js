const User = require('../models/user')
const Rol = require('../models/rol')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const storage = require('../utils/cloud_storage')
module.exports = {
    // findDeliveryMen(req, res) {
    //     User.findDeliveryMen((err, data) => {
    //         if (err) {
    //             return res.status(501).json({
    //                 success: false,
    //                 message: 'Error al listar los repartidores.',
    //                 error: err
    //             })
    //         }
    //         return res.status(201).json(data)
    //     })
    // },
    login(req, res) {
        const email = req.body.email
        const password = req.body.password
        User.findByEmail(email, async (err, myUser) => {
            console.log('Error ', err)
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al iniciar sesión.',
                    error: err
                })
            }
            if (!myUser) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario inexistente.'
                })
            }
            const isPasswordValid = await bcrypt.compare(password, myUser.password)
            if (isPasswordValid) {
                const token = jwt.sign({ id: myUser.id, email: myUser.email }, keys.secretOrKey, {})
                const data = {
                    id: `${myUser.id}`,
                    email: myUser.email,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`,
                    roles: JSON.parse(myUser.roles),
                    created_at: myUser.created_at,
                    updated_at: myUser.updated_at
                }
                return res.status(201).json({
                    success: true,
                    message: `Bienvenido(a) ${myUser.name}.`,
                    data: data
                })
            }
            else {
                return res.status(401).json({
                    success: false,
                    message: 'Contraseña incorrecta.'
                })
            }
        })
    },
    register(req, res) {
        const user = req.body
        User.register(user, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al registrar el usuario',
                    error: err
                })
            }
            return res.status(201).json({
                success: true,
                message: `Bienvenido(a) ${data.name}.`,
                data: data
            })
        })
    },
    async registerWithImage(req, res) {
        const user = JSON.parse(req.body.user)
        const files = req.files
        if (files.length > 0) {
            const path = `image_${Date.now()}`
            const url = await storage(files[0], path)
            if (url != undefined && url != null) {
                user.image = url
            }
        }
        User.register(user, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al registrar el usuario.',
                    error: err
                })
            }
            user.id = `${data}`
            const token = jwt.sign({ id: user.id, email: user.email }, keys.secretOrKey, {})
            user.session_token = `JWT ${token}`
            Rol.create(user.id, 3, (err, data) => {
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Error al registrar el rol del usuario.',
                        error: err
                    })
                }
                return res.status(201).json({
                    success: true,
                    message: 'Usuario registrado exitosamente.',
                    data: user
                })
            })
        })
    },
    async updateProfileWithImage(req, res) {
        const user = JSON.parse(req.body.user)
        const files = req.files
        if (files.length > 0) {
            const path = `image_${Date.now()}`
            const url = await storage(files[0], path)
            if (url != undefined && url != null) {
                user.image = url
            }
        }
        User.updateProfileWithImage(user, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al actualizar el perfil.',
                    error: err
                })
            }
            User.findById(data, (err, myData) => {
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Error al actualizar el perfil.',
                        error: err
                    })
                }
                myData.session_token = user.session_token
                myData.roles = JSON.parse(myData.roles)
                return res.status(201).json({
                    success: true,
                    message: 'Perfil actualizado exitosamente.',
                    data: myData
                })
            })
        })
    },
    async updateProfileWithoutImage(req, res) {
        const user = req.body
        User.updateProfileWithoutImage(user, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al actualizar el perfil.',
                    error: err
                })
            }
            User.findById(data, (err, myData) => {
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Error al actualizar el perfil.',
                        error: err
                    })
                }
                myData.session_token = user.session_token
                myData.roles = JSON.parse(myData.roles)
                return res.status(201).json({
                    success: true,
                    message: 'Perfil actualizado exitosamente.',
                    data: myData
                })
            })
        })
    }
    // async updateNotificationToken(req, res) {
    //     const id = req.body.id
    //     const token = req.body.token
    //     User.updateNotificationToken(id, token, (err, id_user) => {
    //         if (err) {
    //             return res.status(501).json({
    //                 success: false,
    //                 message: 'Hubo un error actualizando el token de notificaciones del usuario',
    //                 error: err
    //             })
    //         }
    //         return res.status(201).json({
    //             success: true,
    //             message: 'El token se actualizo correctamente',
    //             data: id_user
    //         })
    //     })
    // },
}