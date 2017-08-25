module.exports = function (logger, server) {

    var signals = {
        'SIGINT': 2,
        'SIGTERM': 15
    };

    var connections = {};

    server.on('connection', function (connection) {

        var key = connection.remoteAddress + ':' + connection.remotePort;

        connections[key] = connection;

        connection.on('close', function () {
            delete connections[key];
        });

    });

    function shutdown (signal, value) {
        var promises = [];

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

            server.close(function () {
                logger.info('http server stopped by ' + signal);
                resolve();
            });

            server.getConnections(function (error, count) {

                if (error) {
                    return reject(error);
                }

                for (var key in connections) {
                    connections[key].destroy();
                }

                logger.info(`http server: destroy ${count} connections`);

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


    Object.keys(signals).forEach(function (signal) {

        process.on(signal, function () {
            logger.info(`CATCH SIGNAL ${signal}`);
            shutdown(signal, signals[signal]);
        });

    });

};
