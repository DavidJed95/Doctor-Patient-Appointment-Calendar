import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import Calendar from '../calendar/Calendar';
import {
  setAvailability,
  removeAvailability,
  updateAvailability,
} from '../../redux/reducers/specialistAvailabilitySlice';
import Modal from '../common/Modal';


// const fetchShiftsAPI = async () => {
//   const response = await fetch('/shift');
//   if (!response.ok) {
//     throw new Error('Error loading shifts.');
//   }
//   return response.json();
// };

const fetchShiftsAPI = async specialistID => {
  const response = await fetch(`/shift?medicalSpecialistID=${specialistID}`);
  if (!response.ok) {
    throw new Error('Error loading shifts.');
  }
  return response.json();
};

const addShiftAPI = async event => {
  const response = await fetch('/shift', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  if (!response.ok) {
    throw new Error('Error adding shift.');
  }
  return response.json();
};

const updateShiftAPI = async (id, event) => {
  const response = await fetch(`/shift/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  if (!response.ok) {
    throw new Error('Error updating shift.');
  }
  return response.json();
};

const deleteShiftAPI = async id => {
  const response = await fetch(`/shift/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error deleting shift.');
  }
  return response.json();
};


const ManageShifts = () => {
  const { ID: specialistID } = useSelector(state => state.user.userInfo);
  const specialistAvailability = useSelector(
    state => state.specialistAvailability,
  );
  const dispatch = useDispatch();

  const [feedback, setFeedback] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventType, setEventType] = useState('Working Hour');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const data = await fetchShiftsAPI(specialistID);
        data.forEach(shift => dispatch(setAvailability(shift)));
      } catch (error) {
        setFeedback(error.message);
      }
    };
    fetchShifts();
  }, [dispatch, specialistID]);





  const handleEventClick = useCallback(clickInfo => {
    setSelectedDate(clickInfo.event);
    setModalOpen(true);
  }, []);

  const handleDateSelect = useCallback(selectInfo => {
    setSelectedDate({
      start: selectInfo.start,
      end: selectInfo.end,
      allDay: selectInfo.allDay,
    });
    setModalOpen(true);
  }, []);

  const handleModalClose = () => {
    setSelectedDate(null);
    setEventTitle('');
    setModalOpen(false);
  };

   const handleModalSubmit = () => {
     if (eventTitle && startTime && endTime) {
       const startDateTime = new Date(selectedDate.startStr);
       const endDateTime = new Date(selectedDate.startStr);

       startDateTime.setHours(parseInt(startTime.split(':')[0]));
       startDateTime.setMinutes(parseInt(startTime.split(':')[1]));

       endDateTime.setHours(parseInt(endTime.split(':')[0]));
       endDateTime.setMinutes(parseInt(endTime.split(':')[1]));

       try {
        const response = await addShiftAPI({
          MedicalSpecialistID: specialistID,
          DayOfWeek: new Date(startDateTime).getDay(),
          StartTime: startTime,
          EndTime: endTime,
          Type: eventType,
          ShiftDate: format(startDateTime, 'yyyy-MM-dd')
        });
        dispatch(setAvailability(newEvent));
        setFeedback(response.message);
        handleModalClose();
      } catch (error) {
        setFeedback(error.message);
      }
    }
  };

  const handleEditSubmit = async () => {
    if (eventTitle && selectedDate) {
      const updatedEvent = {
        id: selectedDate.id, // Assuming that your event has id
        title: eventTitle,
        start: format(selectedDate.start, 'yyyy-MM-dd'),
        end: format(selectedDate.end, 'yyyy-MM-dd'),
        allDay: selectedDate.allDay,
        MedicalSpecialistID: specialistID,
        Type: eventType,
      };
     try {
        const response = await updateShiftAPI(selectedDate.id, updatedEvent);
        dispatch(updateAvailability(updatedEvent));
        setFeedback(response.message);
        handleModalClose();
      } catch (error) {
        setFeedback(error.message);
      }
    }
  };

  const handleRemoveShift = async () => {
    if (selectedDate) {
      try {
        const response = await deleteShiftAPI(selectedDate.id);
        dispatch(removeAvailability({ id: selectedDate.id }));
        setFeedback(response.message);
        handleModalClose();
      } catch (error) {
        setFeedback(error.message);
      }
    }
  };

  return (
    <div>
      <Calendar
        handleDateSelect={handleDateSelect}
        handleEventClick={handleEventClick}
        events={specialistAvailability}
      />
      {feedback && <p>{feedback}</p>}
      {isModalOpen && (
        <Modal
          show={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        >
          <h2>Add Event</h2>
          <div>
            <label>
              Event Title:
              <input
                type='text'
                value={eventTitle}
                onChange={e => setEventTitle(e.target.value)}
              />
            </label>
          </div>
          <p>Selected Date: {selectedDate?.startStr}</p>

          <h3>Specialist Hours</h3>
          <div>
            <label>
              Start Time:
              <input
                type='time'
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              End Time:
              <input
                type='time'
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
              />
            </label>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ManageShifts;
