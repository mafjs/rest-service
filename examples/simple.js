const service = require('../')('myservice', {
    port: 4000,
    logger: {
        level: 'trace',
        src: false
    },
    accessLog: {
        path: `${__dirname}`
    }
});

service.addMethods({
    'GET /todos': (req, res) => {
        req.logger.debug('debug message');
        res.result([
            1, 2, 3
        ]);
    }
});

service.init();

service.start();


// curl -v http://localhost:3000/todos
