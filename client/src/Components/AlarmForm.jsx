import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../Styles/AlarmForm.css'
import * as scheduler from '../audioPlayer/alarmSchedules';

const DATABASE_URL = "http://localhost:3000/alarms";

let hourOptions = [];
let minutesOptions = [];
let daysCheckBoxes = [];
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

//create multiple HTML elements 
const abbreviationOptions = [<option value="AM" key="AM">AM</option>, <option value="PM" key="PM">PM</option>];
const createHTMLElements = () => {
  for (let i = 1; i <= 12; i++) {
    hourOptions.push(<option value={i} key={i}> {i} </option>)
  }
  for (let i = 0; i <= 59; i++) {
    if (i < 10) {
      minutesOptions.push(<option value={"0" + i} key={i}> {"0" + i} </option>)
    }
    else {
      minutesOptions.push(<option value={i} key={i}> {i} </option>)
    }
  }
  for (let day of days) {
    daysCheckBoxes.push(<label key={day + 2} htmlFor={day}> {day}<input key={day + 1} className="Day-CheckBoxes" type="checkbox" id={day} value={1} ></input></label>);
  }
};
createHTMLElements();

const AlarmForm = ({ list, setalarmMap, setAlarmFormIsVisible, scheduleMap, setScheduleMap, alarmId = "N/A" }) => {
  const listMap = new Map(list);
  const schedules = new Map(scheduleMap);
  //the data format that will be stored
  const dataFormat = {
    name: "My Alarm",
    time: "1:00",
    abbreviation: "AM",
    repeatDays: [],
    soundDuration: 15,
    snooze: false,
    _id: ""

  };
  const [checked, setChecked] = useState(false);
  const [defaultData, setDefaultData] = useState(dataFormat);
  //retrieve existing data from database if id is provided
  useEffect(() => {
    const setInitialData = async () => {
      await fetch(DATABASE_URL + "/" + alarmId)
        .then(res => {
          if (res.ok) {
            console.log("Successfully connected to fetch data");
            const data = res.json();
            return data;
          }
          else {
            console.log("Failed status");
            return null;
          }
        })
        .then(data => {
          let { name, time, abbreviation, repeatDays, soundDuration, snooze, _id } = data;
          let prevData = { name, time, abbreviation, repeatDays, soundDuration, snooze, _id };
          console.log(prevData);
          setDefaultData(prevData);
          setChecked(prevData.snooze);
        })
        .catch(err => console.log("Error in fetching data", err))
    };
    if (alarmId != "N/A" && listMap.length != 0) {
      setInitialData();
    }
  }, []);

  //submitting data to database and update alarmcards
  const handleSubmit = (e) => {
    e.preventDefault();
    let newName = e.target.elements["Alarm-Label"].value;
    let newTime = e.target.elements["Hour"].value + ":" + e.target.elements["Minutes"].value;
    let newAbbreviation = e.target.elements["Abbreviation"].value;
    let newRepeatDays = [];
    let daysHTML = e.target.getElementsByClassName("Day-CheckBoxes");
    let newSoundDuration = e.target.elements["Sound-Duration"].value;
    let newSnooze = e.target.elements["Snooze-Check-Box"].checked;
    for (let checkbox of daysHTML) {
      if (checkbox.checked) {
        newRepeatDays.push(checkbox.id);
      }
    }
    const newData = {
      name: newName,
      time: newTime,
      abbreviation: newAbbreviation,
      repeatDays: newRepeatDays,
      soundDuration: newSoundDuration,
      snooze: newSnooze
    };
    const updateDB = async (data) => {
      try {
        const res = await fetch(DATABASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });
        const resData = await res.json();
        console.log(resData);
        console.log("Succesfully sent data to database");
        return resData._id;
      }
      catch (error) {
        console.log("Error saving data to database:", error);
      }
    };
    const updateExistingDataDB = async (id, data) => {
      try {
        const res = await fetch(DATABASE_URL + "/" + id, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });
        const resData = await res.json();
        console.log(resData);
        console.log("Succesfully sent data to database");
        return resData._id;
      }
      catch (error) {
        console.log("Error saving data to database:", error);
      }
    };
    const updateList = async (data) => {
      console.log("Data posted", JSON.stringify(data));
      const dataWithID = data;
      const newList = new Map(listMap);
      if (listMap.has(alarmId)) {
        const dataId = await updateExistingDataDB(alarmId, data);
        newList.set(dataId, data);
        let scheduleToUpdate = schedules.get(dataId);
        scheduler.updateAlarmSchedule(newList.get(dataId), scheduleToUpdate)
      }
      else {
        dataWithID._id = await updateDB(data);
        newList.set(dataWithID._id, dataWithID);
        schedules.set(dataWithID._id, scheduler.createScheduleObject(dataWithID));
      }
      setalarmMap(newList);
      setAlarmFormIsVisible(false);
      setScheduleMap(schedules);
    }
    updateList(newData);
  }

  return (
    <>
      <div id="Form-Page-Container">
        <button id="Cancel-Button" onClick={() => setAlarmFormIsVisible(false)}>Cancel</button>
        <form onSubmit={handleSubmit} className="Vertical-Items" id="Alarm-Form">
          <h1 id="Form-Title" className="Vertical-Items">Add Alarm</h1>
          <div className="Horizontal-Items">
            <label htmlFor="Hour">
              <select name="Hour" id="Hour" className="Option-Boxes">
                {hourOptions}
              </select>
            </label>
            <label htmlFor="Minutes">
              <select name="Minutes" id="Minutes" className="Option-Boxes">
                {minutesOptions}
              </select>
            </label>
            <label htmlFor="Abbreviation">
              <select name="Abbreviation" id="Abbreviation" className="Option-Boxes">
                {abbreviationOptions}
              </select>
            </label>
          </div>
          <div className="Horizontal-Items Label-Font">
            {daysCheckBoxes}
          </div>
          <label htmlFor="Snooze-Check-Box" className="Label-Font">
            Snooze
            <input id="Snooze-Check-Box" type="checkbox" checked={checked} onChange={() => setChecked(!checked)}></input>
          </label>
          <label htmlFor="Sound-Duration" className="Label-Font Horizontal-Items">
            Sound Duration (Seconds)
            <input id="Sound-Duration" type="number" name="label" defaultValue={defaultData.soundDuration} required className="Input-Boxes"></input>
          </label>
          <label htmlFor="Alarm-Label" className="Label-Font Horizontal-Items">
            Label
            <input id="Alarm-Label" type="text" name="label" defaultValue={defaultData.name} required className="Input-Boxes"></input>
          </label>
          <button type="submit" id="Submit-Button"> Save </button>
        </form >
      </div>
    </>

  )
};
AlarmForm.propTypes = {
  list: PropTypes.array,
  setalarmMap: PropTypes.func,
  setAlarmFormIsVisible: PropTypes.func,
  alarmId: PropTypes.string,
  scheduleMap: PropTypes.array,
  setScheduleMap: PropTypes.func
};
export default AlarmForm;