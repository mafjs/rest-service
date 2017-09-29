const joi = require('maf-rest/joi');

/* eslint-disable global-require */
const init = {
    logger: require('./init/logger'),
    config: require('./init/config'),
    globalErrorHandlers: require('./init/globalErrorHandlers'),
    server: require('./init/server'),
    processSignals: require('./init/processSignals'),
    rest: require('./init/rest')
};
/* eslint-enable */

class RestService {
    constructor(name, rawOptions) {
        const options = rawOptions || {};

        this._logger = init.logger(name, options.logger);

        init.globalErrorHandlers(this._logger);

        this._config = init.config();

        this._di = {};

        this._app = null;

        this._appInited = false;

        this._rest = init.rest(this._logger, this._config);

        this._restInited = false;

        this._server = null;

        this._restMethods = [];

        this.joi = joi;
    }

    get logger() {
        return this._logger;
    }

    get config() {
        return this._config;
    }

    get di() {
        return this._di;
    }

    set di(di) {
        this._di = di;
    }

    get app() {
        return this._app;
    }

    get rest() {
        return this._rest;
    }

    addMethods(methods) {
        this._restMethods.push(methods);
    }

    initApp() {
        if (this._appInited) {
            return;
        }

        this._app = init.server(this._logger, this._config, this._di);
        this._appInited = true;
    }

    initRest() {
        if (this._restInited) {
            return Promise.resolve();
        }

        const promises = [];

        Object.keys(this._restMethods).forEach((key) => {
            const methods = this._restMethods[key];
            promises.push(this._rest.addMethods(methods));
        });

        this._restInited = true;

        return Promise.all(promises)
            .then(() => this._rest.init(this._app, this._di));
    }

    listen() {
        return new Promise((resolve, reject) => {
            this.initApp();

            this.initRest()
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

    _listen() {
        const host = this._config.get('host');
        const port = this._config.get('port');

        this._server = this._app.listen(port, host, () => {
            this._logger.info(`listen on ${host}:${port}`);
        });

        init.processSignals(this._logger, this._server);
    }
}

module.exports = RestService;
