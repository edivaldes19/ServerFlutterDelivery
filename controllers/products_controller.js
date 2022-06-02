const Product = require('../models/product')
const storage = require('../utils/cloud_storage')
const asyncForEach = require('../utils/async_foreach')
module.exports = {
    findByCategory(req, res) {
        const id_category = req.params.id_category
        Product.findByCategory(id_category, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al mostrar todas las categorías.',
                    error: err
                })
            }
            return res.status(201).json(data)
        })
    },
    findByNameAndCategory(req, res) {
        const id_category = req.params.id_category
        const name = req.params.name
        Product.findByNameAndCategory(name, id_category, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al mostrar todas las categorías.',
                    error: err
                })
            }
            return res.status(201).json(data)
        })
    },
    create(req, res) {
        const product = JSON.parse(req.body.product)
        const files = req.files
        let inserts = 0
        if (files.length === 0) {
            return res.status(501).json({
                success: false,
                message: 'Error el producto no tiene imágenes.',
            })
        } else {
            Product.create(product, (err, id_product) => {
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Error al agregar el producto.',
                        error: err
                    })
                }
                product.id = id_product
                const start = async () => {
                    await asyncForEach(files, async (file) => {
                        const path = `image_${Date.now()}`
                        const url = await storage(file, path)
                        if (url != undefined && url != null) {
                            switch (inserts) {
                                case 0:
                                    product.image1 = url
                                    break;
                                case 1:
                                    product.image2 = url
                                    break;
                                case 2:
                                    product.image3 = url
                                    break;
                            }
                        }
                        Product.update(product, (err, data) => {
                            if (err) {
                                return res.status(501).json({
                                    success: false,
                                    message: 'Error al actualizar el producto.',
                                    error: err
                                })
                            }
                            inserts += 1
                            if (inserts == files.length) {
                                return res.status(201).json({
                                    success: true,
                                    message: 'Producto agregado exitosamente.',
                                    data: data
                                })
                            }
                        })
                    })
                }
                start()
            })
        }
    }
}