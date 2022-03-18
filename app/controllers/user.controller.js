const db = require('../models/')
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const User = db.users


exports.create = (req, res) => {

    // Validate data
    const {error} = registerValidation(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Check if user already exists
    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                return res.status(400).send({
                    message: "User already exists"
                });
            }

            // Hash password
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(req.body.password, salt);

            // Create new user
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            });
            newUser.save()
                .then(user => {
                    res.send({
                        user: user.id
                    });
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the user."
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the user."
            });
        })

}

exports.login = (req, res) => {
    
    // Validate data
    const {error} = loginValidation(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
  
    // Check if user already exists
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found"
                });
            }

            // Check password
            const validPassword = bcrypt.compareSync(req.body.password, user.password);
            if (!validPassword) {
                return res.status(400).send({
                    message: "Invalid password"
                });
            }

            // Create and assign token
            const token = jwt.sign({id: user.id}, process.env.TOKEN_SECRET);
            res.header('auth-token', token).send(token);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the user."
            });
        });
}

exports.update = (req, res) => {
    User.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving user with id " + req.params.id
            });
        });
}

exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            res.send({
                message: "User deleted successfully!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Could not delete user with id " + req.params.id
            });
        });
}


exports.findAll = (req, res) => {
    User.find()
        .then(users => {
            res.send(users)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            })
        })
}

exports.findOne = (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving user with id " + req.params.id
            });
        });
}


