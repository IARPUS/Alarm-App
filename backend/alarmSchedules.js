//store scheduled alarms in map for efficient search based on ID
//store schedule patterns in map to be able to reactivate alarms (also uses ID)
const schedule = require('node-schedule');
const playAudio = require('./playAudio.js')
let alarmSchedules = new Map();
let schedulePatterns = new Map();

//parse saved alarm data to be used in schedulePattern
function createSchedulePattern(alarm) {
  let [hourString, minuteString] = alarm.time.split(":");
  if (alarm.abbreviation === "PM") {
    hourString = parseInt(hourString, 10);
    if (hourString !== 12) {
      hourString += 12;
    }
    hourString += "";
  }
  if (alarm.abbreviation === "AM") {
    hourString = parseInt(hourString, 10);
    if (hourString === 12) {
      hourString -= 12;
    }
    hourString += "";
  }
  let dayString = "";
  alarm.repeatDays.forEach((day, index) => {
    if (day === 'Sunday') {
      dayString += 0;
    }
    else if (day === 'Monday') {
      dayString += 1;
    }
    else if (day === 'Tuesday') {
      dayString += 2;
    }
    else if (day === 'Wednesday') {
      dayString += 3;
    }
    else if (day === 'Thursday') {
      dayString += 4;
    }
    else if (day === 'Friday') {
      dayString += 5;
    }
    else if (day === 'Saturday') {
      dayString += 6;
    }
    if (index !== alarm.repeatDays.length - 1) {
      dayString += ",";
    }
  });
  if (dayString === "") {
    dayString = "*";
  }
  const schedulePattern = `${minuteString} ${hourString} * * ${dayString}`;
  console.log(schedulePattern);
  return schedulePattern;
}

//add alarm schedule to map
function addAlarmSchedule(alarm) {
  const schedulePattern = createSchedulePattern(alarm);
  //create actual schedule object
  //add audio later
  const newAlarm = schedule.scheduleJob(schedulePattern, () => {
    console.log(alarm.name, "Is ringing!");
  });
  console.log("Added", newAlarm);
  alarmSchedules.set(alarm._id.toString(), newAlarm);
  schedulePatterns.set(alarm._id.toString(), schedulePattern);
  console.log(alarmSchedules);
  console.log(schedulePatterns);
}

//gets alarm schedule by id
function getAlarmSchedule(id) {
  return alarmSchedules.get(id);
}

//removes alarm schedule by id
function removeAlarmSchedule(id) {
  const alarmSchedule = getAlarmSchedule(id);
  alarmSchedules.delete(id);
}

//toggle on or off the alarm schedule by id
function toggleAlarmOn(id) {
  const alarmSchedule = getAlarmSchedule(id);
  alarmSchedule.reschedule(true)
}
function toggleAlarmOff(id) {
  const alarmSchedule = getAlarmSchedule(id);
  alarmSchedule.cancel();
}

//update existing alarm schedule given new alarm data
function updateAlarmSchedule(updatedAlarm) {
  let existingSchedule = getAlarmSchedule(updatedAlarm._id.toString());
  existingSchedule.reschedule(createSchedulePattern(updatedAlarm));
}
module.exports = {
  addAlarmSchedule,
  getAlarmSchedule,
  removeAlarmSchedule,
  updateAlarmSchedule,
  toggleAlarmOn,
  toggleAlarmOff
};