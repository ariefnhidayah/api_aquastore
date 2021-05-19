const { Cart, Product, Seller, City, Province } = require('../../models')
const Validator = require('fastest-validator')
const validator = new Validator()

Seller.hasMany(Cart, {
    foreignKey: "seller_id",
})

Cart.belongsTo(Seller, {
    foreignKey: "seller_id"
})

Product.hasMany(Cart, {
    foreignKey: "product_id"
})

Cart.belongsTo(Product, {
    foreignKey: "product_id"
})

City.hasMany(Seller, {
    foreignKey: 'city_id'
})

Seller.belongsTo(City, {
    foreignKey: 'city_id'
})

Province.hasMany(Seller, {
    foreignKey: "province_id"
})

Seller.belongsTo(Province, {
    foreignKey: "province_id"
})

module.exports = {
    add: async (req, res) => {
        const schema = {
            product_id: "number|empty:false",
            quantity: "number|empty:false",
        }

        const validate = validator.validate(req.body, schema)
        if (validate.length > 0) {
            return res.status(400).json({
                status: "error",
                message: validate
            })
        } else {
            // check product
            const { product_id, quantity } = req.body
            const user = req.user.data
            const product = await Product.findOne({
                where: {
                    id: product_id,
                    status: 1
                },
            })
            if (product) {
                if (quantity <= product.stock) {
                    const cart = await Cart.findOne({
                        where: {
                            product_id,
                            user_id: user.id
                        }
                    })
                    if (cart) {
                        // update cart
                        const total_price = (Number(quantity) + Number(cart.quantity)) * product.price
                        const total_weight = (Number(quantity) + Number(cart.quantity)) * product.weight
                        const data_update = {
                            price: product.price,
                            quantity: (Number(quantity) + Number(cart.quantity)),
                            total_price,
                            total_weight
                        }
                        await cart.update(data_update)
                    } else {
                        // adding cart
                        const data_create = {
                            product_id,
                            user_id: user.id,
                            seller_id: product.seller_id,
                            price: product.price,
                            quantity,
                            total_price: Number(quantity) * Number(product.price),
                            total_weight: Number(quantity) * Number(product.weight)
                        }
                        await Cart.create(data_create)
                    }
                    const newCart = await Cart.findAll({
                        where: {
                            user_id: user.id,
                            product_id: product_id
                        },
                        attributes: ['quantity', 'product_id', 'seller_id'],
                        include: [
                            {
                                model: Seller,
                                attributes: ['store_name', 'courier', 'id'],
                                where: {
                                    status: 'active'
                                }
                            },
                            {
                                model: Product,
                                attributes: ['name', 'price', 'stock', 'seo_url', 'weight', 'thumbnail'],
                                where: {
                                    status: 1
                                }
                            }
                        ]
                    })
                    return res.json({
                        status: "success",
                        message: "Success!",
                        data: newCart[0]
                    })
                } else {
                    return res.status(400).json({
                        status: "error",
                        message: "Out of stock!"
                    })
                }
            } else {
                return res.status(404).json({
                    status: 'error',
                    message: "Product not found!"
                })
            }
        }
    },
    update: async (req, res) => {
        const schema = {
            quantity: "number|empty:false"
        }

        const validate = validator.validate(req.body, schema)
        if (validate.length > 0) {
            return res.status(400).json({
                status: "error",
                message: validate
            })
        } else {
            const id = req.params.id
            const { quantity } = req.body
            const user = req.user.data

            const cart = await Cart.findOne({
                where: {
                    product_id: id,
                    user_id: user.id
                }
            })
            if (cart) {
                const product = await Product.findByPk(cart.product_id)
                if (product) {
                    if (quantity <= product.stock) {
                        const total_price = Number(quantity) * Number(product.price)
                        const total_weight = Number(quantity) * Number(product.weight)
                        const data_update = {
                            price: product.price,
                            quantity,
                            total_price,
                            total_weight
                        }
                        await cart.update(data_update)
                        const cartUpdate = await Cart.findAll({
                            where: {
                                user_id: user.id,
                                product_id: id
                            },
                            attributes: ['quantity', 'product_id', 'seller_id'],
                            include: [
                                {
                                    model: Seller,
                                    attributes: ['store_name', 'courier', 'id'],
                                    where: {
                                        status: 'active'
                                    }
                                },
                                {
                                    model: Product,
                                    attributes: ['name', 'price', 'stock', 'seo_url', 'weight', 'thumbnail'],
                                    where: {
                                        status: 1
                                    }
                                }
                            ]
                        })
                        return res.json({
                            status: "success",
                            message:"Success!",
                            data: cartUpdate[0]
                        })
                    } else {
                        return res.status(400).json({
                            status: "error",
                            message: "Out of stock!"
                        })
                    }
                } else {
                    return res.status(404).json({
                        status: "error",
                        message: "Product not found!"
                    })
                }
            } else {
                return res.status(404).json({
                    status: "error",
                    message: "Cart not found!"
                })
            }
        }
    },
    delete: async (req, res) => {
        const user = req.user.data
        const id = req.params.id
        const cart = await Cart.findOne({
            where: {
                product_id: id,
                user_id: user.id,
            }
        })
        if (cart) {
            await cart.destroy()
            return res.json({
                status: "success",
                message: "Cart was successfully removed!"
            })
        } else {
            return res.status(404).json({
                status: "error",
                message: "Cart not found!"
            })
        }
    },
    get_all: async (req, res) => {
        const user = req.user.data
        const carts = await Cart.findAll({
            where: {
                user_id: user.id,
            },
            attributes: ['quantity', 'product_id', 'seller_id'],
            include: [
                {
                    model: Seller,
                    attributes: ['store_name', 'courier', 'id'],
                    where: {
                        status: 'active'
                    },
                    include: [
                        {
                            model: City,
                            attributes: ['type', 'name']
                        },
                        {
                            model: Province,
                            attributes: ['name']
                        }
                    ],
                },
                {
                    model: Product,
                    attributes: ['name', 'price', 'stock', 'seo_url', 'weight', 'thumbnail'],
                    where: {
                        status: 1
                    }
                }
            ]
        })
        return res.json({
            status: "success",
            data: carts
        })
    }
}