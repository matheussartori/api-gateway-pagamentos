var winston = require('winston');

module.exports = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: "info",
      filename: "logs/payfast.log",
      maxsize: 2000,
      maxFiles: 100
    })
  ]
});
