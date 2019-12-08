const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const eventRoutes = require('./routes/events');
const bodyParser = require('body-parser')

let app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json())
app.use('/',eventRoutes);

const PORT = process.env.PORT || 5000;



app.listen(PORT, () => console.log('Application listening in port ', PORT));

module.exports = app;