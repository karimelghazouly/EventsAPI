const Event = require('../models/Events');
const User = require('../models/User');
const ErrorChecker = require('../validator/ErrorChecker');

module.exports = {
  addEvent: async (req, res) => {
    if (ErrorChecker.checkErrors(req, res))
      return;

    var user = req.user;
    var data = req.body;
    data.start = data.start - new Date().getTimezoneOffset() * 60 * 1000;
    data.end = data.end - new Date().getTimezoneOffset() * 60 * 1000;

    const existingEvent = await Event.findOne({
      $and: [
        {
          'location.lngLat.coordinates': [data.location.lngLat.lng, data.location.lngLat.lat]
        },
        {
          'start': { $gte: data.start },
          'end': { $lte: data.end },
        },
      ],
    });


    if (existingEvent) {
      res.status(500).json({
        success: false,
        message: 'An Event already exist at this venue on this day',
      });
    } else {

      data.ownerId = user._id;
      Event.create(data)
        .then((event) => {
          console.log("ana hena hazwd el event hao");
          console.log(user._id);
          console.log(event._id);
          User.findOneAndUpdate(
            user._id,
            { $push: { events: event._id } },
            (err,done) =>{
              if(err)
              console.log(err);
              else
              console.log(done);
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
  },
  getAllEvents: async (req, res) => {
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
  },

  getAllEventsForUser: async (req, res) => {

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
  },
};
