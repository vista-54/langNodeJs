let nodemailer = require('nodemailer')

exports.send = function (data) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'svmdevgroup@gmail.com',
      pass: 'VistaBachata0304'
    }
  })


  var mailOptions = {
    from: 'Test Email',
    to: 'vista545457@gmail.com',
    subject: 'Daily report',
    text: 'That was easy!'
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}





