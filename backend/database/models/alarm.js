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
    Sunday: {
      type: Number,
      required: true
    },
    Monday: {
      type: Number,
      required: true
    },
    Tuesday: {
      type: Number,
      required: true
    },
    Wednesday: {
      type: Number,
      required: true
    },
    Thursday: {
      type: Number,
      required: true
    },
    Friday: {
      type: Number,
      required: true
    },
    Saturday: {
      type: Number,
      required: true
    }
  }
})

module.exports = mongoose.model('Alarm', alarmSchema);