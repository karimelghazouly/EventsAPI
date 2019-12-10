const router = require('express').Router();
const UserController = require('../controllers/UserController');

router.route('/register').post(UserController.addUser);
router.route('/login').post(UserController.login);
router.route('/findAllUsersAndTheirEvents').get(UserController.authToken,UserController.findAllUsersAndTheirEvents);

module.exports = router;

