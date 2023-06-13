import { useState, useEffect } from 'react'
import { React } from 'react'
import './App.css'
import AlarmCard from './Components/AlarmCard'
import AlarmForm from './Components/AlarmForm'

const DATABASE_URL = "/alarms";

function App() {
  const [alarmList, setAlarmList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await fetch(DATABASE_URL,
        {
          method: "GET"
        }).then(res => {
          if (res.ok) {
            console.log("Successful in fetching data");
            console.log(res);
            if (res.length === 0) {
              return [];
            }
            else {
              return res.json;
            }
          } else {
            console.log("Error in fetching data");
          }
        })
        .then(data => {
          setAlarmList(data);
          console.log(data);
        })
        .catch(() => {
          console.log("Error in setting data")
        })
    }
    fetchData();
  }, []);
  return (
    <>
      <AlarmForm list={alarmList}></AlarmForm>
    </>
  );
}

export default App
