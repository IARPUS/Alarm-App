import { useState, useEffect, useCallback } from 'react'
import './Styles/App.css'
import AlarmCard from './Components/AlarmCard'
import AlarmForm from './Components/AlarmForm'
import * as scheduler from './audioPlayer/alarmSchedules';
const DATABASE_URL = "http://localhost:3000/alarms";

function App() {
  const [alarmIdToEdit, setAlarmIdToEdit] = useState("N/A");
  const [alarmMap, setalarmMap] = useState(() => new Map);
  const [scheduleMap, setScheduleMap] = useState(() => new Map);
  const [alarmCards, setAlarmCards] = useState([]);
  //state used to toggle between the alarm form and cards
  const [alarmFormIsVisible, setAlarmFormIsVisible] = useState(false);
  //state used to toggle delete and edit buttons
  const [isEditButtonsVisible, setIsEditButtonsVisible] = useState(false);

  //function to create map of schedules based on alarm data, the maps need to be the same length at the end
  const scheduleAllAlarms = () => {
    //if there are no alarms
    if (alarmMap.size != 0) {
      const newScheduleMap = new Map();
      alarmMap.forEach((val, key) => {
        newScheduleMap.set(key, scheduler.createScheduleObject(val));
      });
      setScheduleMap(newScheduleMap);
    }
  }
  const deleteSchedule = (id) => {
    let newScheduleMap = new Map(scheduleMap);
    const scheduleToDelete = newScheduleMap.get(id);
    scheduler.toggleOffSchedule(scheduleToDelete);
    newScheduleMap.delete(id);
    setScheduleMap(newScheduleMap);
  }

  //function to create the actual alarmcards from data
  const createAlarmCardsHTML = (alarmMap) => {
    let alarmCardsHTML = [];
    alarmMap.forEach((val, key) => {
      alarmCardsHTML.push(<AlarmCard setScheduleMap={setScheduleMap} setAlarmMap={setalarmMap} setAlarmFormIsVisible={setAlarmFormIsVisible} isEditButtonsVisible={isEditButtonsVisible} key={key} id={key.toString()} deleteAlarmCard={deleteAlarmCard} name={val.name} time={val.time} abbreviation={val.abbreviation} repeatDays={val.repeatDays} setAlarmIdToEdit={setAlarmIdToEdit}></AlarmCard>);
    });
    return alarmCardsHTML;
  };

  //grab set the initial alarm list on first render
  useEffect(() => {
    const setInitialData = async () => {
      await fetch(DATABASE_URL)
        .then(res => {
          if (res.ok) {
            console.log("Successful connected to fetch data");
            const data = res.json();
            return data;
          }
          else {
            console.log("Failed status");
            return null;
          }
        })
        .then(data => {
          console.log(data);
          const newAlarmMap = new Map();
          for (let alarm of data) {
            newAlarmMap.set(alarm._id, alarm);
          }
          setalarmMap(newAlarmMap);
        })
        .catch(err => console.log("Error in fetching data", err))
    };
    setInitialData();
  }, []);

  //update our alarm cards whenever the alarm list changes
  const updateAlarmCards = useCallback(() => {
    if (scheduleMap.size === 0) {
      scheduleAllAlarms();
    }
    const cards = createAlarmCardsHTML(alarmMap);
    setAlarmCards(cards);
  }, [alarmMap, isEditButtonsVisible]);

  useEffect(() => {
    updateAlarmCards();
  }, [updateAlarmCards]);

  //delete alarm card from data base and update alarm list
  const deleteAlarmCard = async (id) => {
    console.log("Deleting ", id);
    try {
      await fetch(DATABASE_URL + "/" + id,
        {
          method: "DELETE"
        });
      console.log("Succesful in connecting");
    }
    catch (error) {
      console.log("Error in fetching", error);
    }
    const newMap = new Map(alarmMap);
    newMap.delete(id);
    setalarmMap(newMap);
    deleteSchedule(id);
  }
  //update visibility of alarm cards based on whether or not alarm form is visible
  return (
    <>
      {alarmMap.size == 0 && !alarmFormIsVisible ?
        (
          <>
            <button id="Add-Alarm-Button" onClick={() => { setAlarmFormIsVisible(!alarmFormIsVisible); setIsEditButtonsVisible(false) }}>+</button >
            <div>No Alarms Added</div>
          </>
        )
        :
        alarmFormIsVisible ?
          (
            <AlarmForm scheduleMap={Array.from(scheduleMap)} setScheduleMap={setScheduleMap} list={Array.from(alarmMap)} setAlarmFormIsVisible={setAlarmFormIsVisible} setalarmMap={setalarmMap} alarmId={alarmIdToEdit}></AlarmForm>
          )
          :
          (
            <>
              <button id="Edit-Button" onClick={() => { setIsEditButtonsVisible(!isEditButtonsVisible); }}>Edit</button>
              <button id="Add-Alarm-Button" onClick={() => { setAlarmFormIsVisible(!alarmFormIsVisible); setIsEditButtonsVisible(false) }}>+</button >
              <div id="Cards-Container">{alarmCards}</div>
            </>
          )}
    </>
  );
}

export default App
