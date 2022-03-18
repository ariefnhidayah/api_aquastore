const { Product, ProductImage, Category, Seller, City, Province, sequelize } = require('../../models')
const Validator = require('fastest-validator')
const validator = new Validator()
const seoUrl = require('../../utils/seo_url')
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const QueryTypes = Sequelize.QueryTypes
const HereLocation = require('../../utils/here')

Category.hasMany(Product, {
    foreignKey: 'category_id'
})

Product.belongsTo(Category, {
    foreignKey: 'category_id'
})

ProductImage.belongsTo(Product, {
    foreignKey: 'product_id'
})

Product.hasMany(ProductImage, {
    foreignKey: 'product_id'
})

Seller.hasMany(Product, {
    foreignKey: 'seller_id'
})

Product.belongsTo(Seller, {
    foreignKey: 'seller_id'
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

module.exports = {
    async get_list (req, res) {
        let { page, limit, category, q, detail, province, city, seller_id } = req.query

        let products

        if (!page) {
            page = 1
        }
        if (!limit) {
            limit = 10
        }
        if (!q) {
            q = ''
        }

        let offset = (page - 1) * limit

        products = await Product.findAll({
            where: {
                [Op.and]: [
                    {status: 1},
                    {
                        name: {
                            [Op.like]: `%${q}%`
                        },
                    },
                    detail ? {
                        id: {
                            [Op.not]: detail
                        }
                    } : {},
                    category ? {
                        category_id: category
                    } : {},
                    seller_id ? {
                        seller_id: seller_id
                    } : {}
                ],
            },
            offset: offset,
            limit: Number(limit),
            order: [
                ['id', 'desc']
            ],
            include: [
                {
                    model: Category,
                    attributes: ['name'],
                    where: {
                        status: 1
                    }
                },
                {
                    model: Seller,
                    attributes: ['store_name', 'courier'],
                    where: {
                        [Op.and]: [
                            {status: 'active'},
                            city ? {
                                city_id: city
                            } : {},
                            province ? {
                                province_id: province
                            } : {},
                        ],
                    },
                    include: [
                        {
                            model: City,
                            attributes: ['type', 'name'],
                        },
                        {
                            model: Province,
                            attributes: ['name']
                        }
                    ]
                }
            ]
        })
        return res.json({
            status: 'success',
            data: products
        })
    },
    get: async (req, res) => {
        const seo_url = req.params.seo_url
        const product = await Product.findAll({
            where: {
                seo_url,
                status: 1
            },
            include: [
                {
                    model: ProductImage,
                    attributes: ['image']
                },
                {
                    model: Category,
                    attributes: ['name'],
                    where: {
                        status: 1
                    }
                },
                {
                    model: Seller,
                    attributes: ['store_name', 'courier'],
                    where: {
                        status: 'active'
                    },
                    include: [
                        {
                            model: City,
                            attributes: ['name', 'type']
                        },
                        {
                            model: Province,
                            attributes: ['name']
                        }
                    ]
                }
            ]
        })

        if (product && product.length > 0) {
            return res.json({
                status: 'success',
                data: product[0]
            })
        } else {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found!'
            })
        }
    },
}