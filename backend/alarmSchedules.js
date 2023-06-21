//store scheduled alarms in map for efficient search based on ID
const schedule = require('node-schedule');
let alarmSchedules = new Map();
function createSchedulePattern(alarm) {
  //parse saved alarm data to be used in schedulePattern
  let [hourString, minuteString] = alarm.time.split(":");
  if (alarm.abbreviation === "PM") {
    hourString = parseInt(hourString, 10) + 12;
    hourString += "";
  }
  if (alarm.abbreviation === "AM" && hourString === "12") {
    hourString = parseInt(hourString, 10) - 12;
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
function addAlarmSchedule(alarm) {
  const schedulePattern = createSchedulePattern(alarm);
  //create actual schedule object
  //add audio later
  const newAlarm = schedule.scheduleJob(schedulePattern, () => {
    console.log(alarm.name, "Is ringing!");
  });
  console.log(newAlarm);
  alarmSchedules.set(alarm._id.toString(), newAlarm);
}

function getAlarmSchedule(id) {
  return alarmSchedules.get(id);
}

function removeAlarmSchedule(id) {
  const alarmSchedule = getAlarmSchedule(id);
  alarmSchedule.cancel();
  alarmSchedules.delete(id);
}

function updateAlarmSchedule(updatedAlarm) {
  let existingSchedule = getAlarmSchedule(updatedAlarm._id);
  existingSchedule.cancel();
  const newSchedulePattern = createSchedulePattern(updatedAlarm)
  const updatedSchedule = schedule.scheduleJob(newSchedulePattern, () => {
    console.log(updatedAlarm.name, "Is ringing!");
  });

  // Assign the new schedule to the same variable
  existingSchedule = updatedSchedule;
}
module.exports = {
  addAlarmSchedule,
  getAlarmSchedule,
  removeAlarmSchedule
};