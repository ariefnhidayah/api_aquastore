const jwt = require('jsonwebtoken')
const { JWT_SECRET_ADMIN } = process.env

module.exports = async (req, res, next) => {
    const token = req.headers.authorization
    jwt.verify(token, JWT_SECRET_ADMIN, async (error, decoded) => {
        if (error) {
            return res.status(403).json({
                status: 'error',
                message: error.message
            })
        } else {
            req.user = decoded
            return next()
        }
    })
}