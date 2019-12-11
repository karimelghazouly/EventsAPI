const Event = require('../models/Events');
const User = require('../models/User');
const ErrorChecker = require('../validator/ErrorChecker');


async function addEvent (req, res) {
  if (ErrorChecker.checkErrors(req, res))
    return;

  var user = req.user;
  var data = req.body;
  var offest = new Date().getTimezoneOffset() * 60 * 1000;
  data.start = new Date(data.start) - new Date(data.start).getMinutes() * 1000 - offest
  data.end = new Date(data.end) - new Date(data.end).getMinutes() * 1000 - offest;

  const existing_event = await Event.findOne({
    $and: [
      {
        'location.lngLat.coordinates': data.location.lngLat.coordinates
      },
      {
        'start': data.start ,
        'end': data.end
      },
      {
        "ownerId": user._id
      }
    ],
  });

  if (existing_event) {
    res.status(500).json({
      success: false,
      message: 'An Event already exist at this venue on this day',
    });
  } else {

    data.ownerId = user._id;
    Event.create(data)
      .then((event) => {
        User.findOneAndUpdate(
          user._id,
          { $push: { events: event._id } },
          (err,done) =>{
            if(err)
              console.log(err);
          }
        );

        res.status(200).json({
          success: true,
          event,
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
}

async function getAllEvents (req, res) {
  await Event.find({})
    .then((events) => {
      res.json({ success: true, events });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: 'An Error Occured, please try again later',
      });
    });
}

async function getAllEventsForUser (req, res) {

  var user = req.user;
  await Event.find({ ownerId: user._id })
    .then((events) => {
      res.json({ success: true, events });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: 'An Error Occured, please try again later',
      });
    });
}

module.exports = {
  "addEvent":addEvent,
  "getAllEvents":getAllEvents,
  "getAllEventsForUser":getAllEventsForUser
};
