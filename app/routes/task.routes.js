module.exports = (app) => {

    const tasks = require('../controllers/task.controller');
    const router = require('express').Router();

    router.get('/', tasks.findAll);
    router.get('/:id', tasks.findOne);
    router.post('/', tasks.create);
    router.put('/:id', tasks.update);
    router.delete('/:id', tasks.delete);

    app.use('/api/tasks', router);

}