var cluster = require('cluster');

console.log('Running thread...');

if(cluster.isMaster) {
  console.log('Running master thread...');
  cluster.fork();
} else {
  console.log('Running slave thread...');
}
