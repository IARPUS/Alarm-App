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
    daysCheckBoxes.push(<label key={day + 2} htmlFor={day}> {day}<input key={day + 1} type="checkbox" id={day} value={1} ></input></label>);
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
          <label htmlFor="Sound-Duration-Label" className="Label-Font Horizontal-Items">
            Sound Duration (Seconds)
            <input id="Sound-Duration-Label" type="number" name="label" defaultValue="10" required className="Input-Boxes"></input>
          </label>
          <label htmlFor="Alarm-Label" className="Label-Font Horizontal-Items">
            Label
            <input id="Alarm-Label" type="text" name="label" defaultValue="My Alarm" required className="Input-Boxes"></input>
          </label>
          <button type="submit" id="Submit-Button"> Save </button>
        </form >
      </div>
    </>

  )
};
AlarmForm.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object),
  setAlarmList: PropTypes.func,
  setAlarmFormIsVisible: PropTypes.func
};
export default AlarmForm;