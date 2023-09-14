import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import Calendar from '../calendar/Calendar';
import { addEvent, removeEvent, updateEvent } from '../slices/eventsSlice';

const ManageShifts = () => {
  const specialistID = useSelector(state => state.user.userInfo.ID);
  const dispatch = useDispatch(); // For dispatching Redux actions
  const [feedback, setFeedback] = useState('');

  // Instead of a local events state, we use the global state from Redux
  const events = useSelector(state => state.events);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await fetch('/shift');
        const data = await response.json();
        data.forEach(shift => dispatch(addEvent(shift))); // Add each shift to the Redux store
      } catch (error) {
        setFeedback('Error loading shifts.');
      }
    };

    fetchShifts();
  }, [dispatch]);

  const handleEventClick = async clickInfo => {
    if (window.confirm(`Do you want to delete ${clickInfo.event.title}?`)) {
      try {
        const response = await fetch(`/shift/${clickInfo.event.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          dispatch(removeEvent({ id: clickInfo.event.id }));
        } else {
          setFeedback('Error deleting shift.');
        }
      } catch (error) {
        setFeedback('Error deleting shift.');
      }
    }
  };

  const handleDateSelect = async selectInfo => {
    const title = prompt('Please enter a new title for your event');
    if (title) {
      const newEvent = {
        id: Date.now(),
        title: title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        ShiftDate: format(selectInfo.start, 'yyyy-MM-dd'),
        MedicalSpecialistID: specialistID,
        Type: 'Working Hour', // This can be modified according to your requirements
      };

      try {
        const response = await fetch('/shift', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEvent),
        });

        if (response.ok) {
          dispatch(addEvent(newEvent));
        } else {
          setFeedback('Error adding shift.');
        }
      } catch (error) {
        setFeedback('Error adding shift.');
      }
    }
  };

  return (
    <div>
      <Calendar
        handleDateSelect={handleDateSelect}
        handleEventClick={handleEventClick}
        events={events}
      />
      {/* You can also add the rest of your form fields below the calendar as per your needs */}
      {feedback && <p>{feedback}</p>}
    </div>
  );
};

export default ManageShifts;
