const Logger = require('maf-logger');

module.exports = function restServiceInitLogger(name, options) {
    const logger = Logger.create(name, options);

    if (process.env.NODE_ENV === 'production') {
        logger.level('INFO');
    } else {
        logger.level('TRACE');
    }

    return logger;
};
