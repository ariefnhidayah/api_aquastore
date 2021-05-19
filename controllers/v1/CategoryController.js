const { Category } = require('../../models')
const Validator = require('fastest-validator')
const validator = new Validator()

module.exports = {
    add: async (req, res) => {
        const schema = {
            name: "string|empty:false"
        }

        const validate = validator.validate(req.body, schema)
        if (validate.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: validate
            })
        } else {
            const data = {
                name: req.body.name
            }
            await Category.create(data)
            return res.json({
                status: 'success',
                message: 'Category successfully added!'
            })
        }
    },
    update: async (req, res) => {
        const schema = {
            name: "string|empty:false"
        }

        const validate = validator.validate(req.body, schema)
        if (validate.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: validate
            })
        } else {
            const id = req.params.id
            // check category
            const category = await Category.findByPk(id)
            if (category) {
                await category.update(req.body)
                return res.json({
                    status: 'success',
                    message: 'Category successfully updated!'
                })
            } else {
                return res.status(404).json({
                    status: 'error',
                    message: "Category not found!"
                })
            }
        }
    },
    delete: async (req, res) => {
        // check category
        const id = req.params.id
        const category = await Category.findByPk(id)
        if (category) {
            await category.destroy()
            return res.json({
                status: 'success',
                message: 'Category successfully deleted!'
            })
        } else {
            return res.status(404).json({
                status: "error",
                message: "Category not found!"
            })
        }
    },
    get_list: async (req, res) => {
        const categories = await Category.findAll()
        return res.json({
            status: 'success',
            data: categories
        })
    },
    get: async (req, res) => {
        const { id } = req.params
        const category = await Category.findByPk(id)
        if (category) {
            return res.json({
                status: 'success',
                data: category
            })
        } else {
            return res.status(404).json({
                status: 'error',
                message: 'Category not found!'
            })
        }
    }
}