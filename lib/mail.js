const nodemailer = require('nodemailer')
const mailConfigs = require('../config/index');
const mailConfig = mailConfigs [mailConfigs .environment].mail;

const sendMail = async (email, cusName, token, req, res) => {

    const fromEmail = mailConfig.user
    const password = mailConfig.password
    var transporter = nodemailer.createTransport(`smtps://${fromEmail}:${password}@smtp.gmail.com`)

    var mailOptions = {
		from: `<${fromEmail}>`,
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