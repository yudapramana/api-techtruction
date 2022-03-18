const verifyUser = require('../verifytoken')

module.exports = (app) => {

    const tasks = require('../controllers/task.controller');
    const router = require('express').Router();

    router.get('/', verifyUser, tasks.findAll);
    router.get('/:id', verifyUser, tasks.findOne);
    router.post('/', verifyUser, tasks.create);
    router.put('/:id', verifyUser, tasks.update);
    router.delete('/:id', verifyUser, tasks.delete);

    app.use('/api/tasks', router);

}