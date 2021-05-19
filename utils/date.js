module.exports = {
    getDueDate: (countDay) => {
        const now = Date.now()
        const dateNow = new Date(now)
        let year = dateNow.getFullYear()
        let month = dateNow.getMonth() + 1
        let day = dateNow.getDate() + countDay
        let hour = dateNow.getHours()
        let minute = dateNow.getMinutes()
        let second = dateNow.getSeconds()
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    },
    getDateNow: () => {
        const now = Date.now()
        const dateNow = new Date(now)
        let year = dateNow.getFullYear()
        let month = dateNow.getMonth() + 1
        let day = dateNow.getDate()
        let hour = dateNow.getHours()
        let minute = dateNow.getMinutes()
        let second = dateNow.getSeconds()
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    },
    convertDate: (date) => {
        const dateConvert = new Date(date)
        let year = dateConvert.getFullYear()
        let month = dateConvert.getMonth() + 1
        let day = dateConvert.getDate()
        return `${year}-${month}-${day}`
    }
}