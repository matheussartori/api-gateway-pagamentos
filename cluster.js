var cluster = require('cluster');
var os = require('os');

var cpus = os.cpus();

console.log('Running thread...');

if(cluster.isMaster) {
  console.log('Running master thread...');

  cpus.forEach(function() {
    cluster.fork();
  });

} else {
  console.log('Running slave thread...');
  require('./index.js');
}
