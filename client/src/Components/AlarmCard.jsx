import React from 'react';
import { useState } from 'react'
import PropTypes from 'prop-types';
const AlarmCard = ({ name, time, abbreviation, repeatDays, /*snooze, sound, handleDelete, handleEdit*/ }) => {
  //create part of title stating what days the alarm repeats
  let dayTitle = "";
  if (repeatDays.get("Sunday") == 1 && repeatDays.get("Monday") == 1 && repeatDays.get("Tuesday") == 1 && repeatDays.get("Wednesday") == 1 && repeatDays.get("Thursday") == 1 && repeatDays.get("Friday") == 1 && repeatDays.get("Saturday") == 1) {
    dayTitle = "everyday";
  }
  else if (repeatDays.get("Sunday") == 1 && repeatDays.get("Saturday") == 1) {
    dayTitle = "every weekend"
  }
  else if (repeatDays.get("Monday") == 1 && repeatDays.get("Tuesday") == 1 && repeatDays.get("Wednesday") == 1 && repeatDays.get("Thursday") == 1 && repeatDays.get("Friday") == 1) {
    dayTitle = "every weekday"
  }
  else {
    for (let key of repeatDays.keys()) {
      dayTitle += key.substring(0, 3) + " ";
    }
  }
  //
  return (
    <>
      <h1 id="time">{time}</h1>
      <div id="time-abbreviation">{abbreviation}</div>
      <h2 id="title">{name}, {dayTitle}</h2>
    </>
  );
}
AlarmCard.propTypes = {
  name: PropTypes.string,
  time: PropTypes.string,
  abbreviation: PropTypes.string,
  repeatDays: PropTypes.object
};
export default AlarmCard;