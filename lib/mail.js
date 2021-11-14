const nodemailer = require('nodemailer')

const sendMail = async (email, cusName, token, req, res) => {

    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        ignoreTLS: false,
        secure: false,
        auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
}
});;

    var mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: `${email}`,
        subject: 'Xác nhận Email',
        html: `<h1>Chào ${cusName} thân mến! </h1><br>
           <h3>Bạn đã chọn ${email} sử dung email để đăng ký tài khoản VietFoodStore, chào mừng bạn đến với trang thương mại điện tử của chúng tôi:</h3>
           <h3>Mã Xác minh: ${token}</h3><br>
           <h3>Lưu ý: Vui lòng không cung cấp mã này cho bất kì ai, mã xác minh chỉ được sử dụng 1 lần.</h3><br>
           <h3>Trân trọng!</h3>`
    }
    await transporter.sendMail(mailOptions);
}

module.exports = {
    sendMail
}