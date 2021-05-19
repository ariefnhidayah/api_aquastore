const nodemailer = require('nodemailer')
const { EmailLog } = require('../models')

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    auth: {
        user: 'aquastore.id@gmail.com',
        pass: 'aquastoreid123'
    }
})

module.exports = {
    sendMail: async (option) => {
        let status = false
        return Promise.all([
            transporter.sendMail(option, async (error, info) => {
                if (error) {
                    console.log(error)
                    status = false
                    await EmailLog.create({
                        email: option.to,
                        value: JSON.stringify(error)
                    })
                    return status
                } else {
                    console.log('Email sent: ' + info.response)
                    status = true
                    await EmailLog.create({
                        email: option.to,
                        value: JSON.stringify(info.response)
                    })
                    return status
                }
            })
        ]);
    },
    email_activation: (subject, name, code) => {
        return `<!DOCTYPE html
            PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">

        <head>
            <meta http-equiv="Content-Type" content="text/html; ">
            <title>${subject}</title>
        </head>

        <body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0"
            style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;background-color: #DEE0E2;height: 100% !important;width: 100% !important;">
            <center>
                <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable"
                    style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;background-color: #DEE0E2;border-collapse: collapse !important;height: 100% !important;width: 100% !important;">
                    <tr>
                        <td align="center" valign="top" id="bodyCell"
                            style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0px;height: 100% !important;width: 100% !important;">
                            <!-- BEGIN TEMPLATE // -->
                            <table border="0" cellpadding="0" cellspacing="0" id="templateContainer"
                                style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;width: 600px;border-collapse: collapse !important;">
                                <tr>
                                    <td>
                                        <!-- BEGIN HEADER // -->
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" id="templateHeader"
                                            style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;background-color: #FFFFFF;border-bottom: 1px solid #DDDDDD;border-collapse: collapse !important;">
                                            <tr>
                                                <td valign="top" class="headerContent"
                                                    style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;color: #565656;font-family: Helvetica;font-size: 20px;font-weight: bold;line-height: 100%;padding-top: 30px;padding-right: 30px;padding-bottom: 30px;padding-left: 30px;text-align: left;vertical-align: middle;width: 100%;">
                                                    <a href="" style="text-decoration: none;">Aqua Store ID</a>
                                                </td>
                                            </tr>
                                        </table>
                                        <!-- // END HEADER -->
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top"
                                        style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;">
                                        <!-- BEGIN BODY // -->
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" id="templateBody"
                                            class="templateBody"
                                            style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;background-color: #FFFFFF;border-collapse: collapse !important;">
                                            <tr>
                                                <td valign="top" class="bodyContent" mc:edit="body_content00"
                                                    style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;color: #565656;font-family: Helvetica;font-size: 13px;line-height: 150%;padding-top: 25px;padding-right: 30px;padding-bottom: 5px;padding-left: 30px;text-align: left;background: #FFFFFF;">
                                                    <h1
                                                        style="color: #0099FF;display: block;font-family: Helvetica;font-size: 17px;font-style: normal;font-weight: bold;line-height: 100%;letter-spacing: normal;margin-top: 0;margin-right: 0;margin-bottom: 10px;margin-left: 0;">
                                                        Hai ${name},</h1>
                                                    Berikut adalah kode verifikasi akun kamu
                                                    <br />
                                                    <div style="text-align:center;padding: 10px 0px;margin-top: 10px;">
                                                        <b style="border: 1px solid #CCCCCC;padding: 10px;font-size: 18px;border-radius: 3px;">${code}</b>
                                                    </div>
                                                    <br />
                                                    <br />
                                                </td>
                                            </tr>
                                        </table>
                                        <!-- // END BODY -->
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </center>
        </body>

        </html>`;
    }
}