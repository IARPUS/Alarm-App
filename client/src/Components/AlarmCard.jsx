import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../Styles/AlarmCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faChevronRight } from '@fortawesome/free-solid-svg-icons'
const AlarmCard = ({ name, time, abbreviation, repeatDays, deleteAlarmCard, isEditButtonsVisible, setAlarmFormIsVisible, setAlarmIdToEdit, id }) => {
  const alarmCardContainer = useRef();
  const timeTitle = useRef();
  const timeAbbreviationTitle = useRef();
  const title = useRef();
  const deleteButton = useRef();
  const editButton = useRef();
  //handle transitions each time the edit button is pressed using useEffect
  useEffect(() => {
    const translate = (isEditButtonsVisible) => {
      const timeTitleElement = timeTitle.current;
      const timeAbbreviationTitleElement = timeAbbreviationTitle.current;
      const titleElement = title.current;
      const deleteButtonElement = deleteButton.current;
      const editButtonElement = editButton.current;
      if (isEditButtonsVisible) {
        deleteButtonElement.style.display = "block";
        const alarmCardContainerWidth = alarmCardContainer.current.offsetWidth;
        let translation = alarmCardContainerWidth * 0.1;
        translation = translation * 1;
        timeTitleElement.style.transform = `translateX(${translation}px)`;
        timeAbbreviationTitleElement.style.transform = `translateX(${translation}px)`;
        titleElement.style.transform = `translateX(${translation}px)`;
        deleteButtonElement.display = "inline";
        const deleteTranslation = translation / 2.25;
        deleteButtonElement.style.transform = `translateX(${deleteTranslation}px)`;
        if (editButtonElement != null) {
          const editButtonTranslation = deleteTranslation * -1;
          editButtonElement.style.transform = `translateX(${editButtonTranslation}px)`
        }
      }
      else {
        timeTitleElement.style.transform = `translateX(0px)`;
        timeAbbreviationTitleElement.style.transform = `translateX(0px)`;
        titleElement.style.transform = `translateX(0px)`;
        deleteButtonElement.style.transform = `translateX(0px)`;
        setTimeout(() => {
          deleteButtonElement.style.display = "none";
        }, 200);
      }
    }
    translate(isEditButtonsVisible);
  }, [isEditButtonsVisible]);
  //create part of title stating what days the alarm repeats
  let dayTitle = "";
  if (repeatDays.indexOf("Sunday") != -1 && repeatDays.indexOf("Monday") != -1 && repeatDays.indexOf("Tuesday") != -1 && repeatDays.indexOf("Wednesday") != -1 && repeatDays.indexOf("Thursday") != -1 && repeatDays.indexOf("Friday") != -1 && repeatDays.indexOf("Saturday") != -1) {
    dayTitle = "everyday";
  }
  else if (repeatDays.indexOf("Monday") != -1 && repeatDays.indexOf("Tuesday") != -1 && repeatDays.indexOf("Wednesday") != -1 && repeatDays.indexOf("Thursday") != -1 && repeatDays.indexOf("Friday") != -1 && repeatDays.indexOf("Sunday") == -1 && repeatDays.indexOf("Saturday") == -1) {
    dayTitle = "every weekday"
  }
  else if (repeatDays.indexOf("Sunday") != -1 && repeatDays.indexOf("Saturday") != -1 && repeatDays.indexOf("Monday") == -1 && repeatDays.indexOf("Tuesday") == -1 && repeatDays.indexOf("Wednesday") == -1 && repeatDays.indexOf("Thursday") == -1 && repeatDays.indexOf("Friday") == -1) {
    dayTitle = "every weekend"
  }
  else {
    for (let day of repeatDays) {
      dayTitle += day.substring(0, 3) + " ";
    }
  }
  if (dayTitle !== "") {
    dayTitle = ", " + dayTitle
  }
  if (name.length + dayTitle.length > 20) {
    name = name.slice(0, 20);
    name += "...";
  }
  return (
    <div id="Alarm-Card-Container" ref={alarmCardContainer}>
      <>
        <button id="Alarm-Card-Delete-Button" onClick={() => deleteAlarmCard(id)} ref={deleteButton}><FontAwesomeIcon id="Delete-Button-Icon" icon={faTrashCan} /></button>
        <h1 id="Time" ref={timeTitle}>{time}</h1>
        <div id="Time-Abbreviation" ref={timeAbbreviationTitle}>{abbreviation}</div>
        <h2 id="Title" ref={title}>{name}{dayTitle}</h2>
      </>
      {isEditButtonsVisible ?
        (
          <button id="Alarm-Edit-Button" ref={editButton} onClick={() => { setAlarmIdToEdit(id); setAlarmFormIsVisible(true); }}><FontAwesomeIcon icon={faChevronRight} /></button>
        ) : (
          <>
            <label className="switch">
              <input type="checkbox"></input>
              <span className="slider round" ></span>
            </label>
          </>
        )
      }
    </div >
  );
}
AlarmCard.propTypes = {
  name: PropTypes.string,
  time: PropTypes.string,
  abbreviation: PropTypes.string,
  repeatDays: PropTypes.array,
  deleteAlarmCard: PropTypes.func,
  isEditButtonsVisible: PropTypes.bool,
  id: PropTypes.string,
  setAlarmFormIsVisible: PropTypes.func,
  setAlarmIdToEdit: PropTypes.func
};
export default AlarmCard;