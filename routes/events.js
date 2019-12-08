const router = require('express').Router();
const EventController = require('../controllers/EventController');
const EventValidator = require('../validator/EventValidator');

router.route('/').post(EventValidator.validate(),EventController.addEvent);
router.route('/').get(EventController.getAllEvents);

module.exports = router;

