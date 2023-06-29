const express = require('express');
const Alarm = require('../models/alarm.js');
const router = express.Router();
//essentially creating the API here

//route for getting all alarms
//we use async since we want to wait for the .find() but dont want to stall other code
router.get('/', async (req, res) => {
  try {
    const alarms = await Alarm.find();
    res.json(alarms);
    console.log("Succesfully retrieved alarms and schedule");
  }
  catch (err) {
    res.status(500).json({ message: err.message })
  }
});

//route for getting specific alarm by id
router.get('/:id', getAlarm, async (req, res) => {
  res.json(res.alarm);
  console.log("Succesfully retrieved alarm data");
});

//route for updating one
router.patch('/:id', getAlarm, async (req, res) => {
  //bunch of if statements to check what data is changed, and if it is changed replace the old with the new data
  if (req.body.name != null) {
    res.alarm.name = req.body.name;
  }
  if (req.body.time != null) {
    res.alarm.time = req.body.time;
  }
  if (req.body.abbreviation != null) {
    res.alarm.abbreviation = req.body.abbreviation;
  }
  if (req.body.repeatDays != null) {
    res.alarm.repeatDays = req.body.repeatDays;
  }
  if (req.body.soundDuration != null) {
    res.alarm.soundDuration = req.body.soundDuration;
  }
  if (req.body.snooze != null) {
    res.alarm.snooze = req.body.snooze;
  }
  try {
    const updatedAlarm = await res.alarm.save();
    res.json(updatedAlarm);
    console.log("Succesfully updated alarm data");
  }
  catch (err) {
    //send 400 status due to unaccepted request
    res.status(400).json({ message: err.message });
  }

});

//route for creating one
router.post('/', async (req, res) => {
  //create new Alarm object
  console.log(req.body);
  const alarm = new Alarm(
    {
      name: req.body.name,
      time: req.body.time,
      abbreviation: req.body.abbreviation,
      repeatDays: req.body.repeatDays,
      soundDuration: req.body.soundDuration,
      snooze: req.body.snooze
    }
  );
  try {
    //wait until we save the alarm to database
    const newAlarmData = await alarm.save();
    //send status of 201 if succesful to say object was sucessfully saved, and parse json
    res.status(201).json(newAlarmData);
  }
  catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//route for deleting one
router.delete('/:id', getAlarm, async (req, res) => {
  try {
    //delete from database
    await res.alarm.deleteOne();
    console.log("Deleted alarm");
    res.json({ message: "Removed alarm" })
  }
  catch (err) {
    res.status(500).json({ message: err.message })
  }
});

//middleware for getting existing alarm data
async function getAlarm(req, res, next) {
  let alarm
  try {
    alarm = await Alarm.findById(req.params.id)
    if (alarm == null) {
      return res.status(404).json({ message: 'Cannot find alarms' });
    }
  }
  catch (err) {
    //return 500 status since it is a problem with our server
    return res.status(500).json({ message: err.message })
  }
  res.alarm = alarm;
  //call the next middleware function in the middleware stack
  next();
}
module.exports = router;