const {
  Order,
  OrderInvoice,
  OrderProduct,
  Cart,
  Address,
  Product,
  Seller,
  OrderHistory,
  Category,
  sequelize
} = require("../../models");
const axios = require("axios");
const dateUtils = require('../../utils/date')
const orderUtils = require('../../utils/order')
const Validator = require('fastest-validator')
const validator = new Validator()

const { RAJAONGKIR_KEY, RAJAONGKIR_URL } = process.env;

Category.hasMany(Product, {
    foreignKey: 'category_id'
})

Product.belongsTo(Category, {
    foreignKey: 'category_id'
})

Seller.hasMany(Product, {
    foreignKey: 'seller_id'
})

Product.belongsTo(Seller, {
    foreignKey: 'seller_id'
})

module.exports = {
    get_cost: async (req, res) => {
        const schema = {
            seller_id: "string|empty:false",
            weight: "string|empty:false",
            destination: "string|empty:false"
        }
        const validate = validator.validate(req.query, schema)
        if (validate.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: validate
            })
        } else {
            const { destination, weight, seller_id } = req.query
            const seller = await Seller.findByPk(seller_id)
            const couriers = JSON.parse(seller.courier)

            const shippings = couriers.map(courier => {
                return axios.post(RAJAONGKIR_URL, {
                    origin: seller.city_id,
                    destination,
                    weight,
                    courier
                }, {
                    headers: {
                        key: RAJAONGKIR_KEY
                    }
                }).then(({ data }) => {
                    return data.rajaongkir.results
                }).catch(({ message }) => {
                    res.status(503).json({
                        status: "error",
                        message
                    })
                })
            })

            return res.json({
                status: "success",
                data: await Promise.all(shippings).then(value => value)
            })
        }
    },
    order: async (req, res) => {
        const schema = {
            shipping_cost: "string|empty:false",
            address_id: "string|empty:false"
        }
        const validate = validator.validate(req.body, schema)
        if (validate.length > 0) {
            return res.status(400).json({
                status:"error",
                message: validate
            })
        } else {
            const {
                data_invoices,
                shipping_cost,
                address_id
            } = req.body

            const user = req.user.data

            const address = await Address.findByPk(address_id)
            
            if (address) {
                const invoices = JSON.parse(data_invoices)
                // console.log(invoices)
                let subtotal = 0

                for(let i = 0; i < invoices.length; i++)  {
                    const products_temp = invoices[i].products
                    for(let j = 0; j < products_temp.length; j++) {
                        const prod_temp = await Product.findByPk(products_temp[j].product_id)
                        subtotal += Number(prod_temp.price) * Number(products_temp[j].quantity)
                    }
                }

                const order_total = Number(subtotal) + Number(shipping_cost)
                const tax = Math.round((Number(subtotal) * 10) / 100)
                const total_plus_tax = order_total + tax

                const orderCode = orderUtils.create_order_code()

                if (invoices.length > 0) {
                    // create order
                    const data_order_create = {
                        code: orderCode,
                        user_id: user.id,
                        subtotal,
                        shipping_cost,
                        tax,
                        total_plus_tax,
                        address: address.address,
                        province_id: address.province_id,
                        city_id: address.city_id,
                        district_id: address.district_id,
                        postcode: address.postcode,
                        total: order_total,
                        due_date: dateUtils.getDueDate(2),
                        snap_url: '',
                    }
                    const transaction = sequelize.transaction()
                    try {
                        const order = await Order.create(data_order_create, {
                            transaction: transaction
                        })
                        if (order) {
                            let itemDetails = [];
                            invoices.map(async (invoice) => {
                                let invSubtotal = 0
                                const products = invoice.products
                                for(let i = 0; i < products.length; i++) {
                                    const get_prod = await Product.findByPk(products[i].product_id)
                                    invSubtotal += Number(get_prod.price) * Number(products[i].quantity)
                                }
                                const data_invoice_create = {
                                    code: orderUtils.create_invoice_code(),
                                    seller_id: invoice.seller_id,
                                    subtotal: invSubtotal,
                                    shipping_cost: invoice.shipping_cost,
                                    total: invSubtotal + Number(invoice.shipping_cost),
                                    shipping_courier: invoice.shipping_courier,
                                    status: 0,
                                    order_id: order.id,
                                }
                                const order_invoice = await OrderInvoice.create(data_invoice_create, {
                                    transaction: transaction
                                })
                                if (order_invoice) {
                                    await OrderHistory.create({
                                        invoice_id: order_invoice.id,
                                        status: 0
                                    },{
                                        transaction: transaction
                                    })
                                    products.map(async (product) => {
                                        const prod = await Product.findByPk(product.product_id)
                                        const data_product_create = {
                                            product_id: product.product_id,
                                            invoice_id: order_invoice.id,
                                            quantity: product.quantity,
                                            price: prod.price,
                                            subtotal: Number(prod.price) * Number(product.quantity),
                                            total_weight: Number(prod.weight) * Number(product.quantity)
                                        }
                                        await OrderProduct.create(data_product_create, {
                                            transaction: transaction
                                        })
                                        await prod.update({
                                            stock: prod.stock - product.quantity
                                        },{
                                            transaction: transaction
                                        })
                                        itemDetails.push({
                                            id: prod.id,
                                            name: prod.name,
                                            price: prod.price,
                                            quantity: product.quantity,
                                            category: 'Product'
                                        })
                                    })
                                }
                            })
                            const customerDetails = {
                                first_name: user.name,
                                email: user.email,
                                phone: user.phone,
                            }
                            const transactionDetails = {
                                order_id: order.code,
                                gross_amount: order.total_plus_tax
                            }
                            const midtransParams = {
                                transaction_details: transactionDetails,
                                // item_details: itemDetails,
                                customer_details: customerDetails
                            }
    
                            const snap = orderUtils.configMidtrans()
                            snap.createTransaction(midtransParams).then(async(transaction) => {
                                await order.update({
                                    snap_url: transaction.redirect_url
                                },{
                                    transaction: transaction
                                })
                                await Cart.destroy({
                                    where: {
                                        user_id: user.id
                                    }
                                })
                                return res.json({
                                    status: 'success',
                                    data: {
                                        code: order.code,
                                        url: transaction.redirect_url
                                    }
                                })
                            }).catch(err => {
                                return res.status(503).json({
                                    status: 'error',
                                    message: err.message
                                })
                            })
                        } else {
                            return res.status(409).json({
                                status: 'error',
                                message: "Something wen't wrong!"
                            })
                        }
                    } catch (error) {
                        await transaction.rollback();
                        return res.status(500).json({
                            status: 'error',
                            message: error?.message || `Failed to create order`
                        })
                    }
                } else {
                    return res.status(400).json({
                        status: 'error',
                        message: "Something wen't wrong!"
                    })
                }
                
            } else {
                return res.status(404).json({
                    status: "error",
                    message: "Address not found!"
                })
            }
        }
    },
    create_json: async (req, res) => {
        const invoices = [
            {
                // code: orderUtils.create_invoice_code(),
                seller_id: 3,
                shipping_cost: 63000,
                // total: invSubtotal + Number(invoice.shipping_cost),
                shipping_courier: 'jne-oke',
                // status: 0,
                // order_id: order.id,
                products: [
                    {
                        product_id: 2,
                        quantity: 2,
                        // price: product.price,
                        // subtotal: product.total_price,
                        // total_weight: product.total_weight
                    }
                ]
            }
        ]
        return res.json({
            data: invoices
        })
    },
    check_product: async (req, res) => {
        const products = JSON.parse(req.body.products)
        const user = req.user.data

        let arr_error = []
        for(let i = 0; i < products.length; i++) {
            const getProduct = await Product.findAll({
                where: {
                    id: products[i].id,
                    status: 1
                },
                include: [
                    {
                        model: Category,
                        where: {
                            status: 1
                        }
                    },
                    {
                        model: Seller,
                        where: {
                            status: 'active'
                        }
                    }
                ]
            })
            if (getProduct.length > 0) {
                const product = getProduct[0]
                if (product.stock < products[i].quantity) {
                    arr_error.push({
                        id: products[i].id,
                        message: `Stok ${products[i].name} tidak mencukupi!`,
                        type: 'out_of_stock'
                    })
                }
            } else {
                arr_error.push({
                    id: products[i].id,
                    message: `${products[i].name} tidak tersedia!`,
                    type: 'not_found'
                })
            }
        }

        if (arr_error.length > 0) {
            for(let i = 0; i < arr_error.length; i++) {
                if (arr_error[i].type == 'not_found') {
                    await Cart.destroy({
                        where: {
                            product_id: arr_error[i].id,
                            user_id:  user.id
                        }
                    })
                }
            }
        }

        if (arr_error.length > 0) {
            return res.status(400).json({
                status: 'error',
                data: arr_error
            })
        } else {
            return res.json({
                status: 'success',
            })
        }
    }
}