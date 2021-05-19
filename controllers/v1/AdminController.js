const { Admin } = require('../../models')
const Validator = require('fastest-validator')
const validator = new Validator()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { JWT_SECRET_ADMIN, JWT_ACCESS_TOKEN_EXPIRED } = process.env

module.exports = {
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
            // check account
            const admin = await Admin.findOne({
                where: {
                    email: req.body.email
                }
            })
            if (!admin) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Account not found!'
                })
            } else {
                // check password
                const isValidPassword = await bcrypt.compare(req.body.password, admin.password)
                if (!isValidPassword) {
                    return res.status(400).json({
                        status: "error",
                        message: "Wrong password!"
                    })
                } else {
                    const token = jwt.sign({ data: admin }, JWT_SECRET_ADMIN, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED })
                    return res.json({
                        status: 'success',
                        data: {
                            token,
                            email: admin.email,
                            name: admin.name
                        }
                    })
                }
            }
        }
    }
}