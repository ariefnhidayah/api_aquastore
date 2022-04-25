const midtransClient = require("midtrans-client");

const {
  MIDTRANS_SERVER_KEY,
  MIDTRANS_PRODUCTION,
  MIDTRANS_CLIENT_KEY
} = process.env;

module.exports = {
  create_order_code: () => {
    const now = Date.now();
    const dateNow = new Date(now);
    let year = dateNow.getFullYear();
    let month = dateNow.getMonth() + 1;
    let day = dateNow.getDate();
    let hour = dateNow.getHours();
    let minute = dateNow.getMinutes();
    let second = dateNow.getSeconds();
    let milisecond = dateNow.getMilliseconds();
    let random = Math.floor(Math.random() * 90000 + 10000);
    month = month.toString().length > 1 ? month : `0${month}`;
    day = day.toString().length > 1 ? day : `0${day}`;
    hour = hour.toString().length > 1 ? hour : `0${hour}`;
    minute = minute.toString().length > 1 ? minute : `0${minute}`;
    second = second.toString().length > 1 ? second : `0${second}`;
    milisecond =
      milisecond.toString().length > 1 ? milisecond : `0${milisecond}`;
    const orderCode = `ORDER/${year}${month}${day}/${hour}${minute}${second}${milisecond}/${random}`;
    return orderCode;
  },
  create_invoice_code: () => {
    const now = Date.now();
    const dateNow = new Date(now);
    let year = dateNow.getFullYear();
    let month = dateNow.getMonth() + 1;
    let day = dateNow.getDate();
    let hour = dateNow.getHours();
    let minute = dateNow.getMinutes();
    let second = dateNow.getSeconds();
    let milisecond = dateNow.getMilliseconds();
    let random = Math.floor(Math.random() * 90000 + 10000);
    month = month.toString().length > 1 ? month : `0${month}`;
    day = day.toString().length > 1 ? day : `0${day}`;
    hour = hour.toString().length > 1 ? hour : `0${hour}`;
    minute = minute.toString().length > 1 ? minute : `0${minute}`;
    second = second.toString().length > 1 ? second : `0${second}`;
    milisecond =
      milisecond.toString().length > 1 ? milisecond : `0${milisecond}`;
    const orderCode = `INV/${year}${month}${day}/${hour}${minute}${second}${milisecond}/${random}`;
    return orderCode;
  },
  configMidtrans: () => {
    const snap = new midtransClient.Snap({
      isProduction: MIDTRANS_PRODUCTION == 'true',
      serverKey: MIDTRANS_SERVER_KEY,
      // clientKey: MIDTRANS_CLIENT_KEY
    });
    return snap
  },
};
