const db = require('../models/')
const Task = db.tasks
const jwt = require('jsonwebtoken');

exports.findAll = (req, res) => {

    const token = req.header('x-auth-token');
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    let user_id = decoded.id;

    Task.find(
        {
            user_id: user_id
        }
    )
        .then(tasks => {
            res.send(tasks)
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tasks."
            })
        });


}

exports.findOne = (req, res) => {
    Task.findById(req.params.id)
        .then(task => {
            if (!task) {
                return res.status(404).send({
                    message: "Task not found with id " + req.params.id
                });
            }
            res.send(task);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Task not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving task with id " + req.params.id
            });
        });
}

exports.create = (req, res) => {

    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send({
        message: 'No token provided.'
    });

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    let user_id = decoded.id;


    const task = new Task({
        user_id: user_id,
        text: req.body.text,
        day: req.body.day,
        reminder: req.body.reminder,
        completed: req.body.completed
    });
    task.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the task."
            });
        });
}

exports.update = (req, res) => {
    Task.findByIdAndUpdate(req.params.id, {
        text: req.body.text,
        day: req.body.day,
        reminder: req.body.reminder,
        completed: req.body.completed
    }, {
        new: true
    }).then(task => {
        if (!task) {
            return res.status(404).send({
                message: "Task not found with id " + req.params.id
            });
        }
        res.send(task);
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Task not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Error updating task with id " + req.params.id
        });
    });
}

exports.delete = (req, res) => {
    Task.findByIdAndRemove(req.params.id)
        .then(task => {
            if (!task) {
                return res.status(404).send({
                    message: "Task not found with id " + req.params.id
                });
            }
            res.send({
                message: "Task deleted successfully!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Task not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Could not delete task with id " + req.params.id
            });
        });
}