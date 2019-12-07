const Event = require('../models/Events');


module.exports = {
  addEvent: async (req, res) => {
    let data = req.body;

    data.start =  new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000;  
    data.end = new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000;

    const existingEvent = await Event.findOne({
      $and: [
        {
          'location.latLng.lng': data.location.latLng.lng,
          'location.latLng.lat': data.location.latLng.lat,
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
