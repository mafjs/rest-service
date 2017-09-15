var Logger = require('maf-logger');

module.exports = function (name, options) {
    var logger = Logger.create(name, options);

    if (process.env.NODE_ENV === 'production') {
        logger.level('INFO');
    } else {
        logger.level('TRACE');
    }

    return logger;
};
