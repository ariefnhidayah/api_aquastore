require('dotenv').config()
const axios = require('axios')

module.exports = {
    geocode: async (query) => {
        const request = new URLSearchParams({
            apiKey: process.env.HERE_API_KEY,
            q: query
        }).toString()
        const response = await axios.get(process.env.HERE_URL + "geocode?" + request).then(data => {
            return data.data.items[0];
        })

        return response
    }
}