const verifyUser = require('../verifytoken')

module.exports = (app) => {

    const users = require('../controllers/user.controller');
    const router = require('express').Router();

    router.post('/register', users.create);
    router.post('/login', users.login);
    
    router.get('/', verifyUser, users.findAll);
    router.get('/:id', verifyUser, users.findOne);
    router.put('/:id', verifyUser, users.update);
    router.delete('/:id', verifyUser, users.delete);

    app.use('/api/users', router);
}