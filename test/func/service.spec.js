const tap = require('tap');
const request = require('supertest');

const todoRestApi = require(`${__dirname}/todos-rest-api`);

const createService = () => todoRestApi();

const service = createService();

tap.test('should create service', (t) => {
    createService();
    t.done();
});

tap.test('should create todos', (t) => {
    return request(service.app)
    .post('/api/todos')
    .send({title: 'test'})
    .expect(200)
    .then((res) => {
        t.type(res.headers['x-request-id'], 'string');
        t.same(res.body, {result: {title: 'test', id: 1}});
        t.done();
    });
});

tap.test('should search todos', (t) => {
    // test
    return request(service.app)
        .get('/api/todos')
        .send({title: 'test'})
        .expect(200)
        .then((res) => {
            t.type(res.headers['x-request-id'], 'string');
            t.same(res.body, {result: [{title: 'test', id: 1}]});
            t.done();
        });
});

tap.test('should get one', (t) => {
    // test
    return request(service.app)
        .get('/api/todos/1')
        .expect(200)
        .then((res) => {
            t.type(res.headers['x-request-id'], 'string');
            t.same(res.body, {result: {title: 'test', id: 1}});
            t.done();
        });
});

tap.test('should delete one', (t) => {
    // test
    return request(service.app)
        .del('/api/todos/1')
        .expect(200)
        .then((res) => {
            return request(service.app).get('/api/todos');
        })
        .then((res) => {
            t.type(res.headers['x-request-id'], 'string');
            t.same(res.body, {result: []});
            t.done();
        });

});
