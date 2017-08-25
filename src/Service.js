'use strict';

var init = {
    logger: require('./init/logger'),
    config: require('./init/config'),
    globalErrorHandlers: require('./init/globalErrorHandlers'),
    server: require('./init/server'),
    processSignals: require('./init/processSignals'),
    rest: require('./init/rest')
};

class RestService {

    constructor (name) {
        this._logger = init.logger(name);

        init.globalErrorHandlers(this._logger);

        this._config = init.config();

        this._di = {};

        this._app = null;

        this._rest = init.rest(this._logger, this._config);

        this._server = null;

        this._restMethods = [];

    }

    get logger () {
        return this._logger;
    }

    get config () {
        return this._config;
    }

    get di () {
        return this._di;
    }

    get app () {
        return this._app;
    }

    get rest () {
        return this._rest;
    }

    setDi (di) {
        this._di = di;
    }

    addMethods (methods) {
        this._restMethods.push(methods);
    }

    listen () {


        return new Promise((resolve, reject) => {

            this._app = init.server(this._logger, this._config, this._di);

            var promises = [];

            for (var methods of this._restMethods) {
                promises.push(this._rest.addMethods(methods));
            }

            Promise.all(promises)
                .then(() => {
                    return this._rest.init(this._app, this._di);
                })
                .then(() => {
                    this._listen();
                    resolve();
                })
                .catch((error) => {
                    this._logger.error(error);
                    reject(error);
                });

        });

    }

    _listen () {
        var host = this._config.get('host');
        var port = this._config.get('port');

        // eslint-disable-next-line no-unused-vars
        this._app.use(function (req, res, next) {
            res.status(404).json({
                error: {
                    code: 'RESOURCE_NOT_FOUND',
                    message: 'resource not found'
                }
            });
        });

        // eslint-disable-next-line no-unused-vars
        this._app.use((error, req, res, next) => {
            var logger = req.logger || this._logger;

            logger.error(error);

            res.status(500).json({
                error: {
                    code: 'SERVER_ERROR',
                    message: 'server error'
                }
            });
        });

        this._server = this._app.listen(port, host, () => {
            this._logger.info(`listen on ${host}:${port}`);
        });

        init.processSignals(this._logger, this._server);
    }

}

module.exports = RestService;
