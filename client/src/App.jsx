import { useState, useEffect, useCallback } from 'react'
import './Styles/App.css'
import AlarmCard from './Components/AlarmCard'
import AlarmForm from './Components/AlarmForm'

const DATABASE_URL = "http://localhost:3000/alarms";

function App() {
  const [alarmList, setAlarmList] = useState([]);
  const [alarmCards, setAlarmCards] = useState([]);
  //state used to toggle between the alarm form and cards
  const [alarmFormIsVisible, setAlarmFormIsVisible] = useState(false);
  //state used to toggle delete and edit buttons
  const [isEditButtonsVisible, setIsEditButtonsVisible] = useState(false);

  //function to create the actual alarmcards from data
  const createAlarmCardsHTML = (data) => {
    let alarmCardsHTML = [];
    for (let alarmData of data) {
      alarmCardsHTML.push(<AlarmCard isEditButtonsVisible={isEditButtonsVisible} key={alarmData._id} id={alarmData._id} deleteAlarmCard={deleteAlarmCard} name={alarmData.name} time={alarmData.time} abbreviation={alarmData.abbreviation} repeatDays={alarmData.repeatDays} ></AlarmCard>);
    }
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
          setAlarmList(data);
        })
        .catch(err => console.log("Error in fetching data", err))
    };
    setInitialData();
  }, []);

  //update our alarm cards whenever the alarm list changes
  const updateAlarmCards = useCallback(() => {
    const cards = createAlarmCardsHTML(alarmList);
    setAlarmCards(cards);
  }, [alarmList, isEditButtonsVisible]);

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
      setAlarmList(alarmList.filter((alarm) => alarm._id != id));
      console.log("Succesful in connecting");
    }
    catch (error) {
      console.log("Error in fetching", error);
    }
  }
  //update visibility of alarm cards based on whether or not alarm form is visible
  return (
    <>
      {alarmList.length == 0 && !alarmFormIsVisible ?
        (
          <>
            <button id="Add-Alarm-Button" onClick={() => { setAlarmFormIsVisible(!alarmFormIsVisible); setIsEditButtonsVisible(false) }}>+</button >
            <div>No Alarms Added</div>
          </>
        )
        :
        alarmFormIsVisible ?
          (
            <AlarmForm list={alarmList} setAlarmFormIsVisible={setAlarmFormIsVisible} setAlarmList={setAlarmList}></AlarmForm>
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
