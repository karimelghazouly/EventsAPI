const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect('mongodb://UserName:Password@ds131137.mlab.com:31137/brickbase-test', { useNewUrlParser: true });
const EventSchema = new Schema(
  {
    end: { type: Date, required: true },
    start: { type: Date, required: true },
    title: { type: String, required: true },
    details: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      latLng: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
  },
  {
    timestamps: true,
  },
);


var Event = mongoose.model('Event', EventSchema);

module.exports = Event;
