const { Seller } = require('../../models')
const bcrypt = require('bcrypt')
const Validator = require('fastest-validator')
const validator = new Validator()
const jwt = require('jsonwebtoken')
const number = require('../../utils/number')
const mail = require('../../utils/email')

const { JWT_SECRET_SELLER, JWT_ACCESS_TOKEN_EXPIRED } = process.env

module.exports = {
    register: async (req, res) => {
        const schema = {
            email: "email|empty:false",
            name: "string|empty:false",
            store_name: "string|empty:false",
            password: "string|min:6",
            phone: "string|empty:false",
            courier: "string|empty:false",
            bank_name: "string|empty:false",
            account_number: "string|empty:false",
            account_holder: "string|empty:false",
            address: "string|empty:false",
            province_id: "string|empty:false",
            city_id: "string|empty:false",
            district_id: "string|empty:false",
            postcode: "string|empty:false"
        }

        const validate = validator.validate(req.body, schema)

        if (validate.length > 0) {
            return res.status(400).json({
                status: "error",
                message: validate
            })
        } else {
            // check email & phone
            const check_email = await Seller.findOne({
                where: {
                    email: req.body.email
                }
            })
            const check_phone = await Seller.findOne({
                where: {
                    phone: req.body.phone
                }
            })

            if (check_email || check_phone) {
                return res.status(409).json({
                    status: 'error',
                    message: "Email or phone already exists!"
                })
            } else {
                const password = await bcrypt.hash(req.body.password, 10)
                const data = {
                    password,
                    email: req.body.email,
                    name: req.body.name,
                    store_name: req.body.store_name,
                    phone: req.body.phone,
                    courier: req.body.courier,
                    bank_name: req.body.bank_name,
                    account_number: req.body.account_number,
                    account_holder: req.body.account_holder,
                    address: req.body.address,
                    province_id: req.body.province_id,
                    city_id: req.body.city_id,
                    district_id: req.body.district_id,
                    postcode: req.body.postcode
                }

                const newSeller = await Seller.create(data)
                const token = jwt.sign({data: newSeller}, JWT_SECRET_SELLER, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED })
                return res.json({
                    status: 'success',
                    data: {
                        token,
                        name: newSeller.name,
                        status: newSeller.status,
                        balance: newSeller.balance,
                        email: newSeller.email,
                        phone: newSeller.phone,
                        store_name: newSeller.store_name
                    }
                })
            }
        }
    },
    login: async (req, res) => {
        const schema = {
            email: "email|empty:false",
            password: "string|min:6"
        }

        const validate = validator.validate(req.body, schema)

        if (validate.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: validate
            })
        } else {
            // check seller
            const seller = await Seller.findOne({
                where: {
                    email: req.body.email
                }
            })
            if (!seller) {
                return res.status(404).json({
                    status: 'error',
                    message: "Seller not found!"
                })
            } else {
                const isValidPassword = await bcrypt.compare(req.body.password, seller.password)
                if (!isValidPassword) {
                    return res.status(400).json({
                        status: "error",
                        message: "Wrong password!"
                    })
                } else {
                    const token = jwt.sign({data: seller}, JWT_SECRET_SELLER, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED })
                    return res.json({
                        status: 'success',
                        data: {
                            token,
                            name: seller.name,
                            status: seller.status,
                            balance: seller.balance,
                            email: seller.email,
                            phone: seller.phone,
                            store_name: seller.store_name
                        }
                    })
                }
            }
        }
    },
    update: async (req, res) => {
        const schema = {
            email: "email|empty:false",
            name: "string|empty:false",
            store_name: "string|empty:false",
            password: "string|min:6",
            phone: "string|empty:false",
            courier: "string|empty:false",
            bank_name: "string|empty:false",
            account_number: "string|empty:false",
            account_holder: "string|empty:false",
            address: "string|empty:false",
            province_id: "number|empty:false",
            city_id: "number|empty:false",
            district_id: "number|empty:false",
            postcode: "string|empty:false"
        }
        
        const validate = validator.validate(req.body, schema)

        if (validate.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: validate
            })
        } else {
            const id = req.user.data.id
            const seller = await Seller.findByPk(id)
            if (!seller) {
                return res.status(404).json({
                    status: "error",
                    message: "Seller not found!"
                })
            } else {
                const check_email = await Seller.findOne({
                    where: {
                        email: req.body.email
                    }
                })
                if (check_email && req.body.email !== seller.email) {
                    return res.status(409).json({
                        status: 'error',
                        message: 'Email already exists!'
                    })
                }

                const check_phone = await Seller.findOne({
                    where: {
                        phone: req.body.phone
                    }
                })

                if (check_phone && req.body.phone !== seller.phone) {
                    return res.status(409).json({
                        status: 'error',
                        message: "Phone already exists!"
                    })
                }

                const isValidPassword = await bcrypt.compare(req.body.password, seller.password)

                if (!isValidPassword) {
                    return res.status(409).json({
                        status: 'error',
                        message: "Wrong password!"
                    })
                } else {
                    const data = {
                        email: req.body.email,
                        name: req.body.name,
                        store_name: req.body.store_name,
                        phone: req.body.phone,
                        courier: req.body.courier,
                        bank_name: req.body.bank_name,
                        account_number: req.body.account_number,
                        account_holder: req.body.account_holder,
                        address: req.body.address,
                        province_id: req.body.province_id,
                        city_id: req.body.city_id,
                        district_id: req.body.district_id,
                        postcode: req.body.postcode
                    }

                    const sellerUpdate = await seller.update(data)

                    return res.json({
                        status: 'success',
                        data: {
                            name: sellerUpdate.name,
                            status: sellerUpdate.status,
                            balance: sellerUpdate.balance,
                            email: sellerUpdate.email,
                            phone: sellerUpdate.phone,
                            store_name: sellerUpdate.store_name
                        }
                    })
                }
            }
        }
    },
    send_email: async (req, res) => {
        const id = req.user.data.id
        const seller = await Seller.findByPk(id)
        if (!seller) {
            return res.status(404).json({
                status: 'error',
                message: "Seller not found!"
            })
        } else {
            let verification_code
            do {
                verification_code = number.random(1000, 9999)
            } while (await Seller.findOne({
                where: {
                    verification_code
                }
            }))

            const verification_sent_time = new Date()
            const emailOption = {
                from: "noreply@aquastoreid.com",
                to: seller.email,
                subject: "Activation Code Seller Aqua Store ID",
                html: mail.email_activation("Activation Code Seller Aqua Store ID", seller.name, verification_code)
            }
            const sendEmail = mail.sendMail(emailOption)
            if (sendEmail) {
                await seller.update({
                    verification_code,
                    verification_sent_time
                })
                res.json({
                    status: 'success',
                    message: "The activation code has been sent successfully!"
                })
            } else {
                res.status(502).json({
                    status: 'error',
                    message: "Something went wrong!"
                })
            }
        }
    },
    activation_code: async (req, res) => {
        const id = req.user.data.id
        const code = req.body.code
        const seller = await Seller.findByPk(id)
        if (!seller) {
            return res.status(404).json({
                status: 'error',
                message: "Seller not found!"
            })
        } else {
            if (seller.verification_code == code) {
                const sellerUpdate = await seller.update({
                    status: 'active',
                })
                res.json({
                    status: 'success',
                    data: {
                        name: sellerUpdate.name,
                        status: sellerUpdate.status,
                        balance: sellerUpdate.balance,
                        email: sellerUpdate.email,
                        phone: sellerUpdate.phone,
                        store_name: sellerUpdate.store_name
                    }
                })
            } else {
                return res.status(400).json({
                    status: 'error',
                    message: "Wrong activation code!"
                })
            }
        }
    }
}