var cron = require('node-cron');
var index = require('./index');


var task = cron.schedule('01 01 * * *', function () {
  index.run();
}, {
  scheduled: false
});

task.start();