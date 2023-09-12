import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { format, startOfWeek, isBefore, addDays } from 'date-fns'; // Import date-fns for date handling
import DatePicker from 'react-date-picker';
// import 'react-date-picker/dist/DatePicker.css';
import dateStyles from './DatePickerStyles.module.css';
import InputField from '../form/InputField';
import Button from '../button/Button';
import styles from './ManageShifts.module.css';

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
  const specialistID = useSelector(state => state.user.userInfo.ID);
  const [selectedDays, setSelectedDays] = useState({});
  const [times, setTimes] = useState({});
  const [shiftType, setShiftType] = useState('Working Hour');
  const [selectedDate, setSelectedDate] = useState(''); // New state for the date
  const [feedback, setFeedback] = useState('');

  const handleDayChange = day => {
    setSelectedDays(prevState => ({ ...prevState, [day]: !prevState[day] }));
  };

  const handleTimeChange = (day, timeType, value) => {
    setTimes(prev => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [timeType]: value,
      },
    }));
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const shiftData = Object.keys(selectedDays)
      .filter(day => selectedDays[day])
      .map(day => ({
        ShiftDate: format(selectedDate, 'yyyy-MM-dd'),
        MedicalSpecialistID: specialistID,
        DayOfWeek: day,
        StartTime: times[day]?.start,
        EndTime: times[day]?.end,
        Type: shiftType, // or any other value you want to set
      }));

    try {
      const response = await fetch('/shift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shiftData),
      });

      if (response.ok) {
        setFeedback('Shifts saved successfully!');
      } else {
        const data = await response.json();
        setFeedback(data.message || 'An error occurred.');
      }
    } catch (error) {
      setFeedback('Network error or server not responding.');
    }
  };
  const today = new Date();
  return (
    <div className={styles.container}>
      <div className={styles.radioContainer}>
        <label>
          <input
            type='radio'
            value='Working Hour'
            checked={shiftType === 'Working Hour'}
            onChange={e => setShiftType(e.target.value)}
          />
          Working Hour
        </label>
        <label>
          <input
            type='radio'
            value='Break'
            checked={shiftType === 'Break'}
            onChange={e => setShiftType(e.target.value)}
          />
          Break
        </label>
      </div>
      <DatePicker
        // className={`${dateStyles}`}
        onChange={setSelectedDate}
        value={selectedDate}
        format='y-MM-dd'
        minDate={today}
      />
      {daysOfWeek.map(day => (
        <div key={day} className={styles.dayContainer}>
          <InputField
            type='checkbox'
            label={day}
            name={day}
            checked={selectedDays[day] || false}
            onChange={() => handleDayChange(day)}
          />
          {selectedDays[day] && (
            <>
              <InputField
                type='time'
                value={times[day]?.start || ''}
                onChange={event =>
                  handleTimeChange(day, 'start', event.target.value)
                }
                placeholder='Start Time'
              />
              <InputField
                type='time'
                value={times[day]?.end || ''}
                onChange={event =>
                  handleTimeChange(day, 'end', event.target.value)
                }
                placeholder='End Time'
              />
            </>
          )}
        </div>
      ))}
      <Button text='Submit' type='submit' handleClick={handleSubmit} />

      {feedback && (
        <p
          className={
            feedback.includes('success') ? styles.success : styles.failure
          }
        >
          {feedback}
        </p>
      )}
    </div>
  );
};

export default ManageShifts;
