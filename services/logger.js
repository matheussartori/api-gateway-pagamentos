var winston = require('winston');

var logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: "info",
      filename: "logs/payfast.log",
      maxsize: 2000,
      maxFiles: 100
    })
  ]
});

logger.log('Log utilizando o winston.');
logger.info('Log utilizando o winston type info.');
