const User = require('../models/User');
const bcrypt = require('bcrypt');
const ErrorChecker = require('../validator/ErrorChecker');
const jwt = require("jsonwebtoken");
const config = require('config');

module.exports = {
    addUser: async (req, res) => {
        if (ErrorChecker.checkErrors(req, res))
            return;

        var data = req.body;
        var existingUser = await User.find({
            $or: [
                { username: data.username },
                { email: data.email }
            ]
        });

        if (existingUser && existingUser.length > 0) {
            res.status(500).json({
                success: false,
                message: 'A User already exists',
            });
        }
        else {
            data.password = await bcrypt.hash(data.password, 10);

            User.create(data).then((user) => {
                var Generatedtoken = jwt.sign(user.toJSON(), config.get('TOKEN_SECRET'));
                console.log(user);
                res.status(200).json({
                    success: true,
                    token: Generatedtoken,
                });
            })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        message: 'An Error Occured, please try again later',
                    });
                });
        }
    },

    login: async (req, res) => {

        var data = req.body;
        var existingUser = await User.findOne({
            $or: [
                { username: data.username },
                { email: data.email }
            ]
        });

        if (!existingUser) {
            res.status(500).json({
                success: false,
                message: 'This username does not exist',
            });
        }
        else {
            bcrypt.compare(data.password, existingUser.password).then((found) => {
                if (found) {
                    var Generatedtoken = jwt.sign(existingUser.toJSON(), config.get('TOKEN_SECRET'));
                    res.status(200).json({
                        success: true,
                        token: Generatedtoken,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'This username does not exist',
                    });
                }
            }).
                catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        message: 'An Error Occured, please try again later',
                    });
                })
        }
    },

    findAllUsersAndTheirEvents: async (req, res) => {
        var all = await User.find({}).populate('events');
        res.status(200).json({
            success: true,
            data: all,
        });
    },

    authToken: async (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.split(' ')[1] !== null) {
            const token = authHeader.split(' ')[1];
            jwt.verify(token, config.get('TOKEN_SECRET'), (err, user) => {
                if (err) {
                    res.status(403).json({
                        success: false,
                        message: "Server refuses authorization"
                    });

                    return;
                }
                req.user = user;
                next();
            });
        }
        else {
            return res.status(401).json({
                success: false,
                message: "You are not authorized for this request"
            });
        }

    }
};
