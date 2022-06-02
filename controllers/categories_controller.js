const Category = require('../models/category')
module.exports = {
    create(req, res) {
        const category = req.body
        Category.create(category, (err, id) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al agregar la categoría.',
                    error: err
                })
            }
            return res.status(201).json({
                success: true,
                message: 'Categoría agregada exitosamente.',
                data: `${id}`
            })
        })
    },
    getAll(req, res) {
        Category.getAll((err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al mostrar todas las categorías.',
                    error: err
                })
            }
            return res.status(201).json(data)
        })
    }
}