const mongoose = require('mongoose');
//connect using localhost/aDatabaste in order to connect to a local mongodb database
//mongoose.connect("mongodb://localhost/alarmdb");

const alarmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  abbreviation: {
    type: String,
    required: true
  },
  repeatDays: {
    type: Array,
    required: true
  }
})

module.exports = mongoose.model('Alarm', alarmSchema);