const Event = require('../models/Events');
const { validationResult } = require('express-validator/check')

module.exports = {
  addEvent: async (req, res) => {

    console.log("basha ana hena");
    const errors = validationResult(req); 

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    let data = req.body;

    data.start =  data.start - new Date().getTimezoneOffset() * 60 * 1000;  
    data.end = data.end - new Date().getTimezoneOffset() * 60 * 1000;

    const existingEvent = await Event.findOne({
      $and: [
        {
          'location.lngLat.coordinates': [data.location.lngLat.lng, data.location.lngLat.lat]
        },
        {
          'start': { $gte: data.start },
          'end': { $lte: data.end } ,
        },
      ],
    });

    if (existingEvent) {
      res.status(500).json({
        success: false,
        message: 'An Event already exist at this venue on this day',
      });
    } else {
      data.location.ad
      Event.create(data)
        .then((event) => {
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
  getAllEvents: (req, res) => {
    
    let allEvents = Event.find({})
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
