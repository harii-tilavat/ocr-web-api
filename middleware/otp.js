const nodemailer = require('nodemailer')
const path = require("path");

async function otp_email(user, res) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'ocrweb441@gmail.com',
            pass: 'rmmj ffqr naah trfx'
        }
    });
    let info = transporter.sendMail({
        from: "ocrweb441@gmail.com", // sender address
        to: user.email, // list of receivers
        subject: "Verify your otp ✔", // Subject line
        template: "email",
        otp: user.otp,
        html: `<p>Please Verify Your OTP : </p><h1>${user.otp} </h1>`

    }, function (err) {
        if (err) {
            return res.send(
                {
                    message: "email is not sent",

                })
        } else {
            return res.send(
                {
                    message: "email sent succesfully !",

                })
        }
    });
}




module.exports = {
    otp_email,
}