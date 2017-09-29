module.exports = function restServiceInitGlobalErrorHandlers(logger) {
    process.on('uncaughtException', (error) => {
        logger.fatal(error);
        process.exit(255);
    });

    process.on('unhandledRejection', (reason, p) => {
        logger.fatal(reason, p);
        process.exit(255);
    });
};
