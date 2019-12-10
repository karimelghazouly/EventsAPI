require('./models/InitConnection');

const express = require('express');
const cors = require('cors');
const eventRoutes = require('./routes/events');
const usersRoutes = require('./routes/users');

var app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use('/events', eventRoutes);
app.use('/users', usersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Application listening in port ', PORT));

module.exports = app; // I export the app for testing