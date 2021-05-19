const { User } = require('../../models/')
const bcrypt = require('bcrypt')
const Validator = require('fastest-validator')
const validator = new Validator()
const jwt = require('jsonwebtoken')
const number = require('../../utils/number')
const mail = require('../../utils/email')

const { JWT_SECRET, JWT_ACCESS_TOKEN_EXPIRED } = process.env

module.exports = {
    register: async (req, res) => {
        const schema = {
            email: "email|empty:false",
            name: "string|empty:false",
            password: "string|min:6",
            phone: "string|empty:false",
        }

        const validate = validator.validate(req.body, schema)

        if (validate.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: validate
            })
        } else {
            // check email & phone
            const check_email = await User.findOne({
                where: {
                    email: req.body.email
                }
            })
            const check_phone = await User.findOne({
                where: {
                    phone: req.body.phone
                }
            })
            if (check_phone || check_email) {
                return res.status(409).json({
                    status: 'error',
                    message: 'Email or phone already exists!'
                })
            } else {
                const password = await bcrypt.hash(req.body.password, 10)
                const data = {
                    password,
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone
                }

                const newUser = await User.create(data)
                const token = jwt.sign({ data: newUser }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED })
                return res.json({
                    status: 'success',
                    data: {
                        token,
                        email: data.email,
                        phone: data.phone,
                        name: data.name,
                        status: newUser.status,
                        balance: newUser.balance
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
            // check user
            const user = await User.findOne({
                where: {
                    email: req.body.email
                }
            })
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found!'
                })
            } else {
                const isValidPassword = await bcrypt.compare(req.body.password, user.password)
                if (!isValidPassword) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Wrong password!'
                    })
                } else {
                    const token = jwt.sign({ data: user }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED })
                    return res.json({
                        status: 'success',
                        data: {
                            token,
                            email: user.email,
                            phone: user.phone,
                            name: user.name,
                            status: user.status,
                            balance: user.balance
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
            password: "string|min:6",
            phone: "string|empty:false",
        }

        const validate = validator.validate(req.body, schema)

        if (validate.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: validate
            })
        } else {
            const id = req.user.data.id
            const user = await User.findByPk(id)
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found!'
                })
            } else {
                const email = req.body.email
                const check_email = await User.findOne({
                    where: {
                        email
                    }
                })
                if (check_email && email !== user.email) {
                    return res.status(409).json({
                        status: 'error',
                        message: 'Email already exists!'
                    })
                }

                const phone = req.body.phone
                const check_phone = await User.findOne({
                    where: {
                        phone
                    }
                })
                if (check_phone && phone !== user.phone) {
                    return res.status(409).json({
                        status: 'error',
                        message: 'Phone already exists!'
                    })
                }

                const isValidPassword = await bcrypt.compare(req.body.password, user.password)

                if (!isValidPassword) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Wrong password!'
                    })
                }

                const { name } = req.body
                await user.update({
                    email,
                    name,
                    phone,
                })

                return res.json({
                    status: 'success',
                    data: {
                        email,
                        phone,
                        name,
                        status: user.status,
                        balance: user.balance
                    }
                })
            }
        }
    },
    send_email: async (req, res) => {
        const id = req.user.data.id
        const user = await User.findByPk(id)
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: 'User not found!'
            })
        } else {
            let verification_code
            do {
                verification_code = number.random(1000, 9999)
            } while (await User.findOne({
                where: {
                    verification_code
                }
            }))
            const verification_sent_time = new Date()
            const emailOption = {
                from: 'noreply@aquastoreid.com',
                to: user.email,
                subject: 'Activation Code Aqua Store ID',
                html: mail.email_activation('Activation Code Aqua Store ID', user.name, verification_code)
            }
            const sendEmail = mail.sendMail(emailOption)
            if (sendEmail) {
                await user.update({
                    verification_code,
                    verification_sent_time
                })
                res.json({
                    status: 'success',
                    message: 'The activation code has been sent successfully!'
                })
            } else {
                res.status(502).json({
                    status: 'error',
                    message: 'Something went wrong!'
                })
            }
        }
    },
    activation_code: async (req, res) => {
        const id = req.user.data.id
        const code = req.body.code
        const user = await User.findByPk(id)
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found!'
            })
        } else {
            if (user.verification_code == code) {
                await user.update({
                    status: 'active'
                })
                return res.json({
                    status: 'success',
                    data: {
                        email: user.email,
                        phone: user.phone,
                        name: user.name,
                        status: user.status,
                        balance: user.balance
                    }
                })
            } else {
                return res.status(400).json({
                    status: 'error',
                    message: 'Wrong activation code!'
                })
            }
        }
    },
    check_expired: (req, res) => {
        return res.status(200).json({message: 'ok'})
    }
}