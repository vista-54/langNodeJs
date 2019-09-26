var cron = require('node-cron');
var index = require('./index');


var task = cron.schedule('20 19 * * *', function () {
  index.run();
}, {
  scheduled: false
});

task.start();