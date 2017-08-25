var Logger = require('maf-logger');

module.exports = function (name) {
    var logger = Logger.create(name);

    if (process.env.NODE_ENV === 'production') {
        logger.level('INFO');
    } else {
        logger.level('TRACE');
    }

    return logger;
};
