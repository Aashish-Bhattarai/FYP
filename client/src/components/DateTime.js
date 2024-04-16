// DateTime.js
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { isAfter, isBefore, isSameDay, addHours, addDays } from 'date-fns';
import PickupAndDropService from './PickupAndDropService';

function DateTimePicker(props) {
  const [selectedDateTime, setStartDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const filterPassedTime = (time) => {
    const minimumAllowedTime = addHours(new Date(), 5);
    return minimumAllowedTime.getTime() < new Date(time).getTime();
  };

  const filterPassedDate = (date) => {
    const currentDate = new Date();
    const limitDate = addDays(currentDate, 6);

    return (
      isSameDay(date, currentDate) || (isAfter(date, currentDate) && isBefore(date, limitDate))
    );
  };

  useEffect (() => {
    props.setSelectedDateTime(selectedDateTime)
  }, [props, selectedDateTime]);

  return (
    <>
      <div className="datetime-picker-container">
        <DatePicker
          selected={selectedDateTime}
          onChange={(date) => {
            setStartDate(date);
            setSelectedDate(date);
          }}
          showTimeSelect
          filterTime={filterPassedTime}
          filterDate={filterPassedDate}
          dateFormat="MMMM d, yyyy h:mm aa"
          placeholderText='Choose Date and Time'
          className="custom-date-picker"
        />  

        <div className="selected-datetime">
          {selectedDateTime && (
            `Selected Date and Time: ${selectedDateTime.toLocaleString()}`
          )}
        </div>
      </div>

      <style>
        {`
          
          .datetime-picker-label {
            font-size: 16px;
            margin-bottom: 8px;
          }

          .custom-date-picker {
            width: 325px;
            height: 45px;
            margin-left: 5px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
          }

          .selected-datetime {
            margin-top: 8px;
            font-size: 14px;
            color: #333;
          }
        `}
      </style>
    </>
  );
}

export default DateTimePicker;
