//store scheduled alarms in map for efficient search based on ID
//store schedule patterns in map to be able to reactivate alarms (also uses ID)
import * as audioPlayer from './playAudio.js'
import * as scheduler from 'node-schedule'
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
  return schedulePattern;
}
function createScheduleObject(alarm) {
  const newSchedule = scheduler.scheduleJob(createSchedulePattern(alarm), () => audioPlayer.playAudio(alarm.soundDuration));
  console.log("creating", newSchedule);
  return newSchedule;
}

function toggleOffSchedule(schedule) {
  schedule.cancel();
  return schedule;
}
function toggleOnSchedule(schedule) {
  schedule.reschedule(true);
  return schedule;
}
//update existing alarm schedule given new alarm data
function updateAlarmSchedule(updatedAlarm, schedule) {
  const updatedSchedule = schedule.reschedule(createSchedulePattern(updatedAlarm), () => { audioPlayer.playAudio(updatedAlarm.soundDuration) });
  return updatedSchedule;
}
export { createScheduleObject, updateAlarmSchedule, toggleOffSchedule, toggleOnSchedule }