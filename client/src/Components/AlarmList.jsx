import React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import AlarmCard from 'AlarmCard';

const AlarmList = ({ list }) => {
  return (
    < ul >
      {
        list.forEach((alarm) => (
          <AlarmCard name={alarm.name} time={alarm.time} abbreviation={alarm.abbreviation} repeatDays={alarm.repeatDays}></AlarmCard >
        ))
      }
    </ul >
  );
};
AlarmList.propTypes = {
  list: PropTypes.instanceof(Array)
};
export default AlarmList;