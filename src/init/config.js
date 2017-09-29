const Config = require('maf-config');

module.exports = function restServiceInitConfig() {
    const config = new Config();

    const env = process.env;

    const host = env.CONFIG_HOST || null;
    const port = env.CONFIG_PORT || 3000;
    const publicBaseUrl = env.PUBLIC_BASE_URL || `http://localhost:${port}`;

    config.setRaw('.', {
        host,
        port,
        publicBaseUrl,
        cors: {
            origin: '*',
            preflightContinue: true,
            methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
        },
        accessLog: {
            format: [
                ':remote-addr',
                ':remote-user',
                '[:date[clf]]',
                ':method',
                ':url',
                'HTTP/:http-version',
                ':status',
                ':res[content-length]',
                ':response-time',
                ':referrer',
                ':user-agent'
            ],
            filename: 'access.log',
            path: '/var/log/app',
            rotateInterval: '1d'
        }
    });

    return config;
};
