module.exports = {
    random: (min, max) => {
        return Math.floor(
            Math.random() * (max - min) + min
        )
    },
    priceRupiah: (number) => {
        let reverse = number.toString().split('').reverse().join('')
        let ribuan = reverse.match(/\d{1,3}/g);
        ribuan = ribuan.join('.').split('').reverse().join('');
        return 'Rp. ' + ribuan;
    }
}