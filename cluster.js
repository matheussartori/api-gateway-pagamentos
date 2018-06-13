var cluster = require('cluster');
var os = require('os');

var cpus = os.cpus();

console.log('Running thread...');

if(cluster.isMaster) {
  console.log('Running master thread...');

  cpus.forEach(function() {
    cluster.fork();
  });

  cluster.on('listening', worker => {
    console.log('Cluster %d connected', worker.process.pid);
  });

  cluster.on('exit', worker => {
    console.log('Cluster %d disconnected', worker.process.pid);
    cluster.fork();
  });

} else {
  console.log('Running slave thread...');
  require('./index.js');
}
