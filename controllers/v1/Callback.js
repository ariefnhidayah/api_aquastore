const { OrderLog, Order, PaymentLog, PaymentMeta, OrderInvoice } = require("../../models");
const { MIDTRANS_SERVER_KEY } = process.env;
const SHA512 = require("crypto-js/sha512");

module.exports = {
    callback: async (req, res) => {
        const data = req.body
        const signatureKey = data.signature_key
        const orderId = data.order_id
        const statusCode = data.status_code
        const grossAmount = data.gross_amount
        
        const mySignatureKey = SHA512(`${orderId}${statusCode}${grossAmount}${MIDTRANS_SERVER_KEY}`)

        const transactionStatus = data.transaction_status
        const type = data.payment_type
        const fraudStatus = data.fraud_status

        await PaymentMeta.create({
            data: JSON.stringify(data)
        })

        if (signatureKey != mySignatureKey) {
            await PaymentLog.create({
                order_code: orderId,
                message: `Invalid Signature (Signature: ${signatureKey}) (My Signature: ${mySignatureKey})` 
            })
            return res.status(400).json({
                status: 'error',
                message: 'Invalid signature'
            })
        } else {
            const order = await Order.findOne({
                where: {
                    code: orderId
                }
            })
            if (!order) {
                await PaymentLog.create({
                    order_code: orderId,
                    message: `Order not found!` 
                })
                return res.status(404).json({
                    status: "error",
                    message: "Order not found!"
                })
            } else {
                if (order.payment_status == 'paid') {
                    await PaymentLog.create({
                        order_code: orderId,
                        message: `Order not permitted!` 
                    })
                    return res.status(405).json({
                        status: "error",
                        message: "Operation not permitted"
                    })
                } else {
                    if (transactionStatus == 'capture') {
                        if (fraudStatus == 'challenge') {
                            await order.update({
                                payment_status: 'challenge'
                            })
                        } else if (fraudStatus == 'accept') {
                            await order.update({
                                payment_status: 'paid'
                            })
                        }
                    } else if (transactionStatus == 'settlement') {
                        await order.update({
                            payment_status: 'paid'
                        })
                    } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
                        await order.update({
                            payment_status: 'expired'
                        })
                        await OrderInvoice.update({
                            status: 5
                        }, {
                            where: {
                                id: order.id
                            }
                        })
                    } else if (transactionStatus == 'pending') {
                        await order.update({
                            payment_status: 'pending'
                        })
                    }

                    const logData = {
                        payment_status: transactionStatus,
                        raw_response: JSON.stringify(data),
                        order_id: order.id,
                        payment_type: type,
                    }
                    // redirect
                    // https://f8d4955aa2b0.ngrok.io/finish?order_id=ORDER%2F20210418%2F113107817%2F65441&status_code=200&transaction_status=capture
                    await OrderLog.create(logData)
                    return res.json('ok')
                }
            }
        }
    }
}