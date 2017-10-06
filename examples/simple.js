const service = require('../')('myservice', {
    port: 4000,
    accessLog: {
        path: `${__dirname}`,
    },
});

service.addMethods({
    'GET /todos': (req, res) => {
        res.result([
            1, 2, 3,
        ]);
    },
});

service.init();

service.start();


// curl -v http://localhost:3000/todos
