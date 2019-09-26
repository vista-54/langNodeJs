var cron = require('node-cron');
var index = require('./index');


var task = cron.schedule('10 4 * * *', function () {
  index.run();
}, {
  scheduled: false
});

task.start();