const service = require('../')('myservice');

service.addMethods({
    'GET /todos': (req, res) => {
        res.result([
            1, 2, 3,
        ]);
    },
});

service.start();

// curl -v http://localhost:3000/todos
