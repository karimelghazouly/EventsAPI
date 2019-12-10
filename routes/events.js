const router = require('express').Router();
const EventController = require('../controllers/EventController');
const EventValidator = require('../validator/EventValidator');
const UserController = require('../controllers/UserController');

router.use(UserController.authToken);
router.route('/addEvent').post(EventValidator.validate(), EventController.addEvent);
router.route('/getEvents').get(EventController.getAllEvents);
router.route('/getEventsForUser').get(EventController.getAllEventsForUser);

module.exports = router;

