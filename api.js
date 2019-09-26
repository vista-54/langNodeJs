let express = require('express')
let path = require('path')
let index = require('./index')
let app = express()
// app.use(express.logger('dev'));
// parse application/json
// app.use(app.router);



app.get('/api', function (req, res) {
  let body = req.query
  console.log(body.email)
  index.run(body.email)
  res.send('API is running')
})
let port = process.env.PORT || 4001
app.listen(port, function () {
  console.log('Express server listening on port '+port)
})