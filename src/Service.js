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
    constructor(name, rawConfig) {
        this.joi = joi;

        const logLevel = (rawConfig && rawConfig.logLevel) ? rawConfig.logLevel : null;

        this._logger = init.logger(name, logLevel);

        init.globalErrorHandlers(this._logger);

        this._config = init.config(rawConfig);

        this._di = {};

        this._appInited = false;
        this._restInited = false;

        this._app = null;
        this._server = null;

        this._rest = null;
        this._restMethods = [];

        this._rest = init.rest(this._logger, this._config);

        if (this._config.get('autoInit') === true) {
            this.initApp();
        }
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

    setEndpoint(endpoint) {
        this._rest.setEndpoint(endpoint);
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

    start() {
        return new Promise((resolve /* , reject */) => {
            this.initApp();

            this.initRest()
                .then(() => {
                    this._listen();
                    resolve();
                })
                .catch((error) => {
                    this._logger.error(error);
                    process.exit(255);
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
