require('./models/InitConnection');

const express = require('express');
const cors = require('cors');
const EventRoutes = require('./routes/EventsRoutes');
const UsersRoutes = require('./routes/UsersRoutes');

var app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use('/events', EventRoutes);
app.use('/users', UsersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Application listening in port ', PORT));

module.exports = app; // I export the app for testing