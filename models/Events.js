const mongoose = require('mongoose');
const { Schema } = mongoose;
const config = require('config');

let ConnectionString = config.get("DB_Connection_String");

mongoose.connect(ConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number], // longitude first and then latitude
    required: true
  }
});


const EventSchema = new Schema(
  {
    end: { type: Date, required: true },
    start: { type: Date, required: true },
    title: { type: String, required: true },
    details: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      lngLat: {
        type: pointSchema,
        required: true
      },
    },
  },
  {
    timestamps: true,
  },
);


var Event = mongoose.model('Event', EventSchema);

module.exports = Event;
