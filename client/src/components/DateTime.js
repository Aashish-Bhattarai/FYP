// DateTime.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {  isAfter, isBefore, isSameDay, addHours, addDays } from 'date-fns';
import './DateTime.css';

function DateTimePicker() {
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

  return (
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
  );
}

export default DateTimePicker;

