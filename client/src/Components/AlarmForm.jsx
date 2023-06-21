import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../Styles/AlarmForm.css'

const DATABASE_URL = "http://localhost:3000/alarms";

let hourOptions = [];
let minutesOptions = [];
let daysCheckBoxes = [];
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

//create multiple HTML elements 
const abbreviationOptions = [<option value="AM" key="AM">AM</option>, <option value="PM" key="PM">PM</option>];
const createHTMLElements = () => {
  for (let i = 1; i <= 12; i++) {
    hourOptions.push(<option className="Hour-Options" value={i} key={i}> {i} </option>)
  }
  for (let i = 0; i <= 59; i++) {
    if (i < 10) {
      minutesOptions.push(<option className="Minute-Options" value={"0" + i} key={i}> {"0" + i} </option>)
    }
    else {
      minutesOptions.push(<option className="Minute-Options" value={i} key={i}> {i} </option>)
    }
  }
  for (let day of days) {
    daysCheckBoxes.push(<input key={day + 1} type="checkbox" className="Day-CheckBoxes" id={day} value={1}></input>);
    daysCheckBoxes.push(<label key={day + 2} className="Day-CheckBoxes-Labels" htmlFor={day}>{day}</label>);
  }
};
createHTMLElements();

const AlarmForm = ({ list, setAlarmList, setAlarmFormIsVisible }) => {
  //the data format that will be stored
  const defaultData = {
    name: "",
    time: "",
    abbreviation: "",
    repeatDays: [],
    _id: ""
  };
  const [data, setData] = useState(defaultData);
  //update data to database

  useEffect(() => {
    const updateDB = async () => {
      try {
        const res = await fetch(DATABASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });
        const resData = await res.json();
        console.log("Succesfully sent data to database");
        return resData._id;
      }
      catch (error) {
        console.log("Error saving data to database:", error);
      }
    };
    const updateList = async () => {
      if (JSON.stringify(data) !== JSON.stringify(defaultData)) {
        console.log("Data posted", JSON.stringify(data));
        const dataWithID = data;
        dataWithID._id = await updateDB();
        const newList = [...list, dataWithID];
        setAlarmList(newList);
        setAlarmFormIsVisible(false);
      }
    }
    updateList();
    //reset form and state 
  }, [data])


  //submitting data to database 
  const handleSubmit = (e) => {
    e.preventDefault();
    let newName = e.target.elements["label"].value;
    let newTime = e.target.elements["Hour"].value + ":" + e.target.elements["Minutes"].value;
    let newAbbreviation = e.target.elements["Abbreviation"].value;
    let newRepeatDays = [];
    let daysHTML = e.target.getElementsByClassName("Day-CheckBoxes");
    for (let checkbox of daysHTML) {
      if (checkbox.checked) {
        newRepeatDays.push(checkbox.id);
      }
    }
    //update state
    setData({
      name: newName,
      time: newTime,
      abbreviation: newAbbreviation,
      repeatDays: newRepeatDays
    });
  }
  //function to reset data without trigger useEffect
  const resetData = () => {
    setData(defaultData);
  };

  return (
    <>
      <button id="Cancel-Button" onClick={() => setAlarmFormIsVisible(false)}>Cancel</button>
      <form onSubmit={handleSubmit} id="Alarm-Form">
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
  setAlarmList: PropTypes.func,
  setAlarmFormIsVisible: PropTypes.func
};
export default AlarmForm;