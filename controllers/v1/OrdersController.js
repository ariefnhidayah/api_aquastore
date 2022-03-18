const {
    Order,
    OrderInvoice,
    OrderProduct,
    Cart,
    Address,
    Product,
    Seller,
    OrderHistory,
    City,
    Province,
    District,
    OrderLog,
    sequelize
} = require("../../models");

const Validator = require('fastest-validator')
const validator = new Validator()

Order.hasMany(OrderInvoice, {
    foreignKey: 'order_id'
})

OrderInvoice.belongsTo(Order, {
    foreignKey: 'order_id'
})

OrderInvoice.hasMany(OrderProduct, {
    foreignKey: 'invoice_id'
})

OrderProduct.belongsTo(OrderInvoice, {
    foreignKey: 'invoice_id'
})

OrderInvoice.hasMany(OrderHistory, {
    foreignKey: 'invoice_id'
})

OrderHistory.belongsTo(OrderInvoice, {
    foreignKey: 'invoice_id'
})

Product.hasMany(OrderProduct, {
    foreignKey: 'product_id'
})

OrderProduct.belongsTo(Product, {
    foreignKey: 'product_id'
})

Seller.hasMany(OrderInvoice, {
    foreignKey: 'seller_id'
})

OrderInvoice.belongsTo(Seller, {
    foreignKey: 'seller_id'
})

City.hasMany(Order, {
    foreignKey: 'city_id'
})

Order.belongsTo(City, {
    foreignKey: 'city_id'
})

Province.hasMany(Order, {
    foreignKey: 'province_id'
})

Order.belongsTo(Province, {
    foreignKey: 'province_id'
})

District.hasMany(Order, {
    foreignKey: 'district_id'
})

Order.belongsTo(District, {
    foreignKey: 'district_id'
})

City.hasMany(Seller, {
    foreignKey: 'city_id'
})

Seller.belongsTo(City, {
    foreignKey: 'city_id'
})

Province.hasMany(Seller, {
    foreignKey: 'province_id'
})

Seller.belongsTo(Province, {
    foreignKey: 'province_id'
})

District.hasMany(Seller, {
    foreignKey: 'district_id'
})

Seller.belongsTo(District, {
    foreignKey: 'district_id'
})

Order.hasOne(OrderLog, {
    foreignKey: 'order_id'
})

OrderLog.belongsTo(Order, {
    foreignKey: 'order_id'
})

module.exports = {
    get: async (req, res) => {
        const code = req.query.code

        if (!code) {
            return res.status(400).json({
                status: 'error',
                message: 'No Order harus diisi!'
            })
        }

        const user = req.user.data

        const order = await Order.findAll({
            where: {
                code: code,
                user_id: user.id
            },
            include: [
                {
                    model: City,
                    attributes: ['type', 'name']
                },
                {
                    model: Province,
                    attributes: ['name']
                },
                {
                    model: District,
                    attributes: ['name']
                },
                {
                    model: OrderLog,
                    attributes: ['payment_status', 'payment_type']
                },
                {
                    model: OrderInvoice,
                    attributes: ['code', 'subtotal', 'shipping_cost', 'total', 'shipping_courier', 'status', 'receipt_number'],
                    include: [
                        {
                            model: Seller,
                            attributes: ['store_name', 'phone', 'address', 'postcode'],
                            include: [
                                {
                                    model: City,
                                    attributes: ['type', 'name']
                                },
                                {
                                    model: Province,
                                    attributes: ['name']
                                },
                                {
                                    model: District,
                                    attributes: ['name']
                                }
                            ]
                        },
                        {
                            model: OrderProduct,
                            attributes: ['quantity', 'price', 'subtotal', 'total_weight'],
                            include: [
                                {
                                    model: Product,
                                    attributes: ['name', 'seo_url', 'thumbnail']
                                }
                            ]
                        },
                        {
                            model: OrderHistory,
                            attributes: ['status']
                        }
                    ]
                }
            ]
        })

        if (order.length > 0) {
            return res.json({status: 'success', data: order[0]})
        } else {
            return res.status(404).json({
                status: 'error',
                message: 'Order Not Found!'
            })
        }
    },
    get_list: async (req, res) => {
        const user = req.user.data

        let { page, limit } = req.query

        if (!page) {
            page = 1
        }

        if (!limit) {
            limit = 10
        }

        let offset = (page - 1) * limit
        let returnData = []

        const orders = await Order.findAndCountAll({
            where: {
                user_id: user.id,
            },
            attributes: ['id', 'code', 'subtotal', 'shipping_cost', 'total', 'tax', 'total_plus_tax', 'due_date', 'payment_status', 'created_at'],
            offset: Number(offset),
            limit: Number(limit),
            order: [
                ['id', 'desc']
            ]
        })

        if (orders.count > 0) {
            orders.rows.map(order => {
                returnData.push(order.get({plain: true}))
            })
        }

        return res.json({
            status: 'success',
            data: returnData,
            count: orders.count
        })
    }
}