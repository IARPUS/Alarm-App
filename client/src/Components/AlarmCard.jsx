import PropTypes from 'prop-types';
const AlarmCard = ({ name, time, abbreviation, repeatDays, deleteAlarmCard, isEditButtonsVisible, id /*snooze, sound, handleDelete, handleEdit*/ }) => {
  //create part of title stating what days the alarm repeats
  let dayTitle = "";
  if (repeatDays.indexOf("Sunday") != -1 && repeatDays.indexOf("Monday") != -1 && repeatDays.indexOf("Tuesday") != -1 && repeatDays.indexOf("Wednesday") != -1 && repeatDays.indexOf("Thursday") != -1 && repeatDays.indexOf("Friday") != -1 && repeatDays.indexOf("Saturday") != -1) {
    dayTitle = "everyday";
  }
  else if (repeatDays.indexOf("Sunday") != -1 && repeatDays.indexOf("Saturday") != -1) {
    dayTitle = "every weekend"
  }
  else if (repeatDays.indexOf("Monday") != -1 && repeatDays.indexOf("Tuesday") != -1 && repeatDays.indexOf("Wednesday") != -1 && repeatDays.indexOf("Thursday") != -1 && repeatDays.indexOf("Friday") != -1) {
    dayTitle = "every weekday"
  }
  else {
    for (let day of repeatDays) {
      dayTitle += day.substring(0, 3) + " ";
    }
  }
  if (dayTitle !== "") {
    dayTitle = ", " + dayTitle
  }
  return (
    <>
      {isEditButtonsVisible ?
        (
          <>
            <button className="Alarm-Card-Delete-Button" onClick={() => deleteAlarmCard(id)}>-</button>
            <h1 id="time">{time}</h1>
            <div id="time-abbreviation">{abbreviation}</div>
            <h2 id="title">{name}{dayTitle}</h2>
          </>
        )
        :
        (
          <>
            <h1 id="time">{time}</h1>
            <div id="time-abbreviation">{abbreviation}</div>
            <h2 id="title">{name}{dayTitle}</h2>
          </>
        )
      }
    </>
  );
}
AlarmCard.propTypes = {
  name: PropTypes.string,
  time: PropTypes.string,
  abbreviation: PropTypes.string,
  repeatDays: PropTypes.array,
  deleteAlarmCard: PropTypes.func,
  isEditButtonsVisible: PropTypes.bool,
  id: PropTypes.string
};
export default AlarmCard;