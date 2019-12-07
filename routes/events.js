const router = require('express').Router();
const EventController = require('../controllers/EventController');

router.route('/').post(EventController.addEvent);
router.route('/').get(EventController.getAllEvents);

module.exports = router;

