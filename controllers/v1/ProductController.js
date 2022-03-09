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
        let { page, limit, category, q, detail, province, city, fromLocation, address, limitDistance } = req.query

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

        limitDistance = limitDistance ?? 10

        if (parseInt(fromLocation) === 1) {
            const location = await HereLocation.geocode(address)
            const {lat, lng} = location.position

            let queryWhere = " WHERE `Product`.`status` = 1 AND `Product`.`name` LIKE '%" + q + "%'";

            queryWhere += ` AND (
                6971 * acos(
                    cos(
                        radians('${lat}')) * cos(
                        radians( latitude )) * cos(
                        radians( longitude ) - radians(
                        '${lng}')) + sin(
                        radians(
                        '${lat}')) * sin(
                    radians( latitude )))) <= ${limitDistance}`;
            
            if (category) {
                queryWhere += " AND `Category`.`id` = '"+ category +"'"
            }

            let querySelect = "SELECT `Product`.`id`, `Product`.`id`, `Product`.`category_id`, `Product`.`seller_id`, `Product`.`name`, `Product`.`description`, `Product`.`price`, `Product`.`stock`, `Product`.`seo_url`, `Product`.`weight`, `Product`.`thumbnail`, `Product`.`created_at` AS `createdAt`, `Product`.`updated_at` AS `updatedAt`, `Category`.`id` AS `Category.id`, `Category`.`name` AS `Category.name`, `Seller`.`id` AS `Seller.id`, `Seller`.`store_name` AS `Seller.store_name`, `Seller`.`courier` AS `Seller.courier`, `Seller->City`.`id` AS `Seller.City.id`, `Seller->City`.`type` AS `Seller.City.type`, `Seller->City`.`name` AS `Seller.City.name`, `Seller->Province`.`id` AS `Seller.Province.id`, `Seller->Province`.`name` AS `Seller.Province.name`, (6971 * acos(cos(radians('" + lat + "')) * cos(radians( latitude )) * cos(radians( longitude ) - radians('" + lng + "')) + sin(radians('" + lat + "')) * sin(radians( latitude )))) AS distance FROM `products` AS `Product` INNER JOIN `categories` AS `Category` ON `Product`.`category_id` = `Category`.`id`  AND `Category`.`status` = 1 INNER JOIN `sellers` AS `Seller` ON `Product`.`seller_id` = `Seller`.`id`  AND `Seller`.`status` = 'active' LEFT OUTER JOIN `cities` AS `Seller->City` ON `Seller`.`city_id` = `Seller->City`.`id` LEFT OUTER JOIN `provincies` AS `Seller->Province` ON `Seller`.`province_id` = `Seller->Province`.`id` ";

            querySelect += queryWhere + ` ORDER BY distance ASC LIMIT ${offset}, ${limit}`;

            products = await sequelize.query(querySelect, {type: QueryTypes.SELECT, nest: true})

            return res.json({
                status: "testing",
                data: products,
            })
        }

        if (city && province) {
            if (!category) {
                products = await Product.findAll({
                    where: {
                        status: 1,
                        name: {
                            [Op.like]: `%${q}%`
                        },
                        id: {
                            [Op.not]: detail ? detail : false
                        }
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
                                status: 'active',
                                [Op.or]: [
                                    {
                                        city_id: city
                                    },
                                    {
                                        province_id: province
                                    }
                                ]
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
                            ]
                        }
                    ]
                })
            } else {
                products = await Product.findAll({
                    where: {
                        status: 1,
                        category_id: category,
                        name: {
                            [Op.like]: `%${q}%`
                        },
                        id: {
                            [Op.not]: detail ? detail : false
                        }
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
                                status: 'active',
                                [Op.or]: [
                                    {
                                        city_id: city
                                    },
                                    {
                                        province_id: province
                                    }
                                ]
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
                            ]
                        }
                    ]
                })
            }
        } else {
            if (!category) {
                products = await Product.findAll({
                    where: {
                        status: 1,
                        name: {
                            [Op.like]: `%${q}%`
                        },
                        id: {
                            [Op.not]: detail ? detail : false
                        }
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
                                status: 'active',
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
                            ]
                        }
                    ]
                })
            } else {
                products = await Product.findAll({
                    where: {
                        status: 1,
                        category_id: category,
                        name: {
                            [Op.like]: `%${q}%`
                        },
                        id: {
                            [Op.not]: detail ? detail : false
                        }
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
                                status: 'active',
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
                            ]
                        }
                    ]
                })
            }
        }


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