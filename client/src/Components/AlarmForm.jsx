import React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';

const DATABASE_URL = "/alarms";

const AlarmForm = ({ list, setList }) => {
  const defaultData = {
    name: "",
    time: "",
    abbreviation: "",
    repeatDays: {
      Sunday: "0",
      Monday: "0",
      Tuesday: "0",
      Wednesday: "0",
      Thursday: "0",
      Friday: "0",
      Saturday: "0"
    }
  };
  const [data, setData] = useState(defaultData);
  let hourOptions = [];
  let minutesOptions = [];
  let daysCheckBoxes = [];
  const days = new Map();
  days.set('Sunday', 0);
  days.set('Monday', 0);
  days.set('Tuesday', 0);
  days.set('Wednesday', 0);
  days.set('Thursday', 0);
  days.set('Friday', 0);
  days.set('Saturday', 0);
  const abbreviationOptions = [<option value="AM" key="AM">AM</option>, <option value="PM" key="PM">PM</option>];
  for (let i = 1; i <= 12; i++) {
    hourOptions.push(<option className="Hour-Options" value={i} key={i}> {i} </option>)
  }
  for (let i = 0; i <= 59; i++) {
    minutesOptions.push(<option className="Minute-Options" value={i} key={i}> {i} </option>)
  }
  for (const key of days.keys()) {
    daysCheckBoxes.push(<input type="checkbox" className="Day-CheckBoxes" id={key} value={1}></input>);
    daysCheckBoxes.push(<label className="Day-CheckBoxes-Labels" htmlFor={key}>{key}</label>);
  }
  //update data to database
  const updateDB = async () => {
    try {
      await fetch(DATABASE_URL, {
        method: "POST",
        body: JSON.stringify(data)
      });
    }
    catch (error) {
      console.log("Error saving data to database:", error);
    }
  };

  //submitting data to database 
  const handleSubmit = (e) => {
    e.preventDefault();
    let newName = e.target.elements["label"].value;
    let newTime = e.target.elements["Hour"].value + ":" + e.target.elements["Minutes"].value;
    let newAbbreviation = e.target.elements["Abbreviation"].value;
    let newRepeatDays = e.target.getElementsByClassName("Day-CheckBoxes");
    for (const checkbox of newRepeatDays) {
      if (checkbox.checked) {
        days.set(checkbox.id, 1);
      }
    }
    //update state
    setData({
      name: newName,
      time: newTime,
      abbreviation: newAbbreviation,
      repeatDays: days
    })
    //update database
    updateDB();
    const newList = [...list, data];
    setList(newList);
    //reset form and state 
    e.target.reset();
    setData(defaultData);
  }
  //update database everytime data is changed
  return (
    <>
      <button id="Cancel-Button">Cancel</button>
      <form onSubmit={handleSubmit}>
        <h1 id="Form-Title">Add Alarm</h1>
        <div>
          <label htmlFor="Hour">
            <select name="Hour" id="Hour">
              {hourOptions}
            </select>
          </label>
          <label htmlFor="Minutes">
            <select name="Minutes" id="Minutes">
              {minutesOptions}
            </select>
          </label>
          <label htmlFor="Abbreviation">
            <select name="Abbreviation" id="Abbreviation">
              {abbreviationOptions}
            </select>
          </label>
        </div>
        {daysCheckBoxes}
        <label htmlFor="Alarm-Label">
          Label
          <input id="Alarm-Label" type="text" name="label" required></input>
        </label>
        <button type="submit" id="Submit-Button"> Save </button>
      </form >
    </>
  )
};
AlarmForm.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object),
  setList: PropTypes.func
};
export default AlarmForm;