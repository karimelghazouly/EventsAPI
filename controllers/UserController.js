const User = require('../models/User');
const Bcrypt = require('bcrypt');
const ErrorChecker = require('../validator/ErrorChecker');
const JWT = require("jsonwebtoken");
const Config = require('config');

module.exports = {
    addUser: async (req, res) => {
        if (ErrorChecker.checkErrors(req, res))
            return;

        var data = req.body;
        var existing_user = await User.find({
            $or: [
                { username: data.username },
                { email: data.email }
            ]
        });

        if (existing_user && existing_user.length > 0) {
            res.status(500).json({
                success: false,
                message: 'A User already exists',
            });
        }
        else {
            data.password = await Bcrypt.hash(data.password, 10);

            User.create(data).then((user) => {

                var generated_token = JWT.sign(user.toJSON(), Config.get('TOKEN_SECRET'));
                res.status(200).json({
                    success: true,
                    token: generated_token,
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
        var existing_user = await User.findOne({
            $or: [
                { username: data.username },
                { email: data.email }
            ]
        });

        if (!existing_user) {
            res.status(500).json({
                success: false,
                message: 'This username does not exist',
            });
        }
        else {
            Bcrypt.compare(data.password, existing_user.password).then((match) => {
                if (match) {
                    var generated_token = JWT.sign(existing_user.toJSON(), Config.get('TOKEN_SECRET'));
                    
                    res.status(200).json({
                        success: true,
                        token: generated_token,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Incorrect Password',
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
        const auth_Header = req.headers['authorization'];
        if (auth_Header && auth_Header.split(' ')[1] !== null) {

            const token = auth_Header.split(' ')[1];
            JWT.verify(token, Config.get('TOKEN_SECRET'), (err, user) => {

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
