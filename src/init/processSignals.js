/**
 * @private
 * @param {Logger} logger
 * @param {Express} server
 */
module.exports = function restServiceInitProcessSignals(logger, server) {
    const signals = {
        SIGINT: 2,
        SIGTERM: 15
    };

    const connections = {};

    server.on('connection', (connection) => {
        const key = `${connection.remoteAddress}:${connection.remotePort}`;

        connections[key] = connection;

        connection.on('close', () => {
            delete connections[key];
        });
    });

    function shutdown(signal, value) {
        const promises = [];

        // TODO add callback for stopping other clien

        // promises.push(new Promise((resolve, reject) => {
        //     di.logger.info('stopping mongodb client');
        //
        //     if (di.db && di.db.mongo) {
        //         di.db.mongo.close(true, function (error) {
        //             if (error) {
        //                 di.logger.error(error);
        //                 process.exit(1);
        //             }
        //
        //             di.logger.info('mongodb client stopped');
        //
        //             resolve();
        //         });
        //     } else {
        //         resolve();
        //     }
        // }));

        promises.push(new Promise((resolve, reject) => {
            logger.info('stopping http server');

            server.close(() => {
                logger.info(`http server stopped by ${signal}`);
                resolve();
            });

            server.getConnections((error, count) => {
                if (error) {
                    return reject(error);
                }

                Object.keys(connections).forEach((key) => {
                    connections[key].destroy();
                });

                return logger.info(`http server: destroy ${count} connections`);
            });
        }));

        Promise.all(promises)
            .then(() => {
                logger.info('shutdown complete');
                process.exit(128 + value);
            })
            .catch((error) => {
                logger.error(error);
                process.exit(128 + value);
            });
    }


    Object.keys(signals).forEach((signal) => {
        process.on(signal, () => {
            logger.info(`CATCH SIGNAL ${signal}`);
            shutdown(signal, signals[signal]);
        });
    });
};
