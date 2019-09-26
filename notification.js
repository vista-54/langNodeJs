'use strict'
const nodemailer = require('nodemailer')
let moment = require('moment')

exports.send = function (data) {
  async function main () {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'mail.adm.tools',
      port: 25,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'v.stalynskyi@semperteam.com', // generated ethereal user
        pass: 'd48hDE7x0lBN' // generated ethereal password
      }
    })

    let messageBody = ''

    data.map(item => {
      messageBody += '<p>' + item.name + ' Cards: ' + item.cards + ' Categories' + item.categories +
        ' △Cards:' + item.deltaCards + ' △Categories:' + item.deltaCategories + '</p>'
    })

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'v.stalynskyi@semperteam.com ', // sender address
      to: 'vista545457@gmail.com', // list of receivers
      subject: 'Daily report ' + moment().subtract(1, 'days').format('MMMM Do YYYY'), // Subject line
      html: messageBody // html body
    })

    console.log('Message sent: %s', JSON.stringify(info))
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
  }

  main().catch(console.error)
}