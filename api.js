let express = require('express')
let path = require('path')
let index = require('./index')
let app = express()
const http = require('http');
// app.use(express.logger('dev'));
// parse application/json
// app.use(app.router);

process
  .on('SIGTERM', shutdown('SIGTERM'))
  .on('SIGINT', shutdown('SIGINT'))
  .on('uncaughtException', shutdown('uncaughtException'));

setInterval(console.log.bind(console, 'tick'), 1000);
http.createServer((req, res) => res.end('hi'))
  .listen(process.env.PORT || 4001, () => console.log('Listening'));

function shutdown(signal) {
  return (err) => {
    console.log(`${ signal }...`);
    if (err) console.error(err.stack || err);
    setTimeout(() => {
      console.log('...waited 5s, exiting.');
      process.exit(err ? 1 : 0);
    }, 4001).unref();
  };
}

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