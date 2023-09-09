import React, { useState } from 'react';
import InputField from '../form/InputField'

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const ManageShifts = () => {
  const [selectedDays, setSelectedDays] = useState({});
  const [times, setTimes] = useState({});

  const handleDayChange = (day) => {
    setSelectedDays(prevState => ({...prevState, [day]: !prevState[day]}))
  }

  const handleTimeChange = (day, timeType, value) => {
    if (!times[day]) times[day] = {};
    times[day][timeType] = value
    setTimes({...times})
  }
  
  const handleSubmit = async (event)=> {
    event.preventDefault();

    const shiftData = [];
    for (let day in selectedDays) {
      if (selectedDays[day]) {
        shiftData.push({
          day:day, start:times[day]?.start,end: times[day]?.end
        })
      }
    }
    try {
      const response = await fetch('/shift', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(shiftData)
      })
      const data = await response.json();
      if (response.ok) {}
    } catch (error) {
      
    }
  }
  return (
    <div>
      daysOfWeek.map( day => (
      <div key={day}>
        <label>
          <input
            type='checkbox'
            checked={selectedDays[day] || false}
            onChange={() => handleDayChange(day)}
          />
          {day}
        </label>
        {selectedDays[day] && (
          <>
          <input type="time"
          value={times[day]?.start || ''}
          onChange={(event)=> handleTimeChange(day,'start',event.target.value)}
          placeholder='Start Time'
          />
          <input
          type='time'
          value={times[day]?.end || ''}
          onChange={(event) => handleTimeChange(day, 'end', event.target.value)}
          placeholder='End Time'/>
          </>
        )}
      </div>
      ) )
    </div>
  );
};

export default ManageShifts;
