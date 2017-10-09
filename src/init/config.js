const Config = require('maf-config');

/**
 * @private
 * @param {?Object} rawConfig
 * @return {Config}
 */
module.exports = function restServiceInitConfig(rawConfig) {
    const config = new Config();

    const env = process.env;

    const host = env.HOST || null;
    const port = env.PORT || 3000;
    const publicBaseUrl = env.CONFIG_PUBLIC_BASE_URL || `http://localhost:${port}`;

    config.setRaw('.', {
        mode: env.CONFIG_MODE || 'public',
        autoInit: true,
        logger: {
            level: null,
            src: false
        },
        host,
        port,
        publicBaseUrl,
        cors: {
            origin: '*',
            preflightContinue: true,
            methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        },
        accessLog: {
            format: [
                ':remote-addr',
                ':remote-user',
                '[:date[clf]]',
                ':req[x-request-id]',
                ':method',
                ':url',
                'HTTP/:http-version',
                ':status',
                ':res[content-length]',
                ':response-time',
                ':referrer',
                ':user-agent',
            ],
            filename: 'access.log',
            path: null,
            rotateInterval: '1d',
        },
    });

    if (typeof rawConfig !== 'undefined') {
        config.mergeRaw(rawConfig);
    }

    return config;
};
