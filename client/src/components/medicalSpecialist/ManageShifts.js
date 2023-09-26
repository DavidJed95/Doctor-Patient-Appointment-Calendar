import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import Calendar from '../calendar/Calendar';
import { useSelector, useDispatch } from 'react-redux';
import {
  setAvailability,
  removeAvailability,
  updateAvailability,
} from '../../redux/reducers/specialistAvailabilitySlice';
import Modal from '../common/Modal';
import {
  fetchShiftsAPI,
  addShiftAPI,
  updateShiftAPI,
  deleteShiftAPI,
} from './shiftsAPI';

const ManageShifts = () => {
   const { ID: specialistID } = useSelector(state => state.user.userInfo);
   const specialistAvailability = useSelector(
     state => state.specialistAvailability,
   );
   const dispatch = useDispatch();

   const [feedback, setFeedback] = useState('');
   const [isModalOpen, setModalOpen] = useState(false);
   const [selectedDate, setSelectedDate] = useState(null);
   const [eventType, setEventType] = useState('Working Hour');
   const [startTime, setStartTime] = useState('');
   const [endTime, setEndTime] = useState('');
   const [shiftDate, setShiftDate] = useState(format(new Date(), 'yyyy-MM-dd'));

   useEffect(() => {
     const fetchShifts = async () => {
       try {
         const data = await fetchShiftsAPI(specialistID);
         console.log('Fetched shifts line 37:', data); // Existing log for fetched data

         // Log before mapping
         console.log('About to map through fetched shifts:');

         const formattedShifts = data.map(shift => {
           // Log each shift as it's being processed
           console.log('Currently processing shift:', shift);
           return convertToEventFormat(shift);
         });

         formattedShifts.forEach(shift => dispatch(setAvailability(shift)));
       } catch (error) {
         setFeedback(error.message);
       }
     };
     fetchShifts();
   }, [dispatch, specialistID]);

  const isPastDate = date => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const convertToEventFormat = shift => {
    const shiftDate = new Date(shift.ShiftDate);
    const [startHour, startMin] = shift.StartTime.split(':');
    const [endHour, endMin] = shift.EndTime.split(':');

    const startDate = new Date(shiftDate);
    startDate.setHours(startHour, startMin);

    const endDate = new Date(shiftDate);
    endDate.setHours(endHour, endMin);

    return {
      id: shift.SpecialistHourID,
      title: shift.Type,
      start: startDate,
      end: endDate,
    };
  };

  const handleEventClick = useCallback(clickInfo => {
    if (isPastDate(clickInfo.event.start)) {
      setFeedback("Can't modify past shifts");
      return;
    }
    setShiftDate(format(clickInfo.event.start, 'yyyy-MM-dd'));
    setSelectedDate(clickInfo.event);
    setEventType(clickInfo.event.title); // setting eventType to the type of the selected event
    setModalOpen(true);
  }, []);

  const isOverlapping = (start, end) => {
    return specialistAvailability.some(event => {
      return (
        (start >= event.start && start < event.end) ||
        (end > event.start && end <= event.end) ||
        (start <= event.start && end >= event.end)
      );
    });
  };

  const handleDateSelect = useCallback(
    selectInfo => {
      if (isOverlapping(selectInfo.start, selectInfo.end)) {
        setFeedback('This time overlaps with another event.');
        return;
      }

      setShiftDate(format(selectInfo.start, 'yyyy-MM-dd'));
      setSelectedDate({
        start: selectInfo.start,
        end: selectInfo.end,
        allDay: selectInfo.allDay,
      });

      setStartTime(format(selectInfo.start, 'HH:mm'));
      setEndTime(format(selectInfo.end, 'HH:mm'));

      setModalOpen(true);
    },
    [specialistAvailability],
  );

  const handleModalClose = () => {
    setSelectedDate(null);
    setModalOpen(false);
  };

  const handleModalSubmit = async () => {
    const [year, month, day] = shiftDate.split('-').map(Number);
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startDateTime = new Date(year, month - 1, day, startHour, startMin);
    const endDateTime = new Date(year, month - 1, day, endHour, endMin);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      setFeedback('Issue with date values. Please try again.');
      return;
    }
     if (isOverlapping(startDateTime, endDateTime)) {
       setFeedback('This time overlaps with another event.');
       return;
     }

    const newEvent = {
      MedicalSpecialistID: specialistID,
      DayOfWeek: startDateTime.getDay(),
      StartTime: format(startDateTime, 'HH:mm'),
      EndTime: format(endDateTime, 'HH:mm'),
      Type: eventType,
      ShiftDate: format(startDateTime, 'yyyy-MM-dd'),
    };

    try {
      const response = await addShiftAPI(newEvent);
      setFeedback(response.message);
      dispatch(setAvailability(response.shift));
      handleModalClose();
    } catch (error) {
      setFeedback(error.message);
    }
  };

  const handleEditSubmit = async () => {
    if (eventType && selectedDate) {
      const updatedEvent = {
        MedicalSpecialistID: specialistID,
        Type: eventType,
        DayOfWeek: new Date(selectedDate.start).getDay(),
        StartTime: new Date(selectedDate.start).toISOString(),
        EndTime: new Date(selectedDate.end).toISOString(),
      };

      try {
        await updateShiftAPI(selectedDate.id, updatedEvent);
        dispatch(updateAvailability(updatedEvent));
        setFeedback('Shift updated successfully.');
      } catch (error) {
        setFeedback(error.message);
      }
    }
    handleModalClose();
  };

  const handleRemoveShift = async () => {
    if (selectedDate) {
      try {
        await deleteShiftAPI(selectedDate.id);
        dispatch(removeAvailability({ id: selectedDate.id }));
        setFeedback('Shift deleted successfully.');
      } catch (error) {
        setFeedback(error.message);
      }
    }
    handleModalClose();
  };

  return (
    <div>
      <Calendar
        handleDateSelect={handleDateSelect}
        handleEventClick={handleEventClick}
        events={specialistAvailability.map(event => ({
          ...event,
          title: event.Type,
        }))}
      />
      {feedback && <p>{feedback}</p>}
      {isModalOpen && (
        <Modal
          show={isModalOpen}
          onClose={handleModalClose}
          onSubmit={
            selectedDate?.SpecialistHourID
              ? handleEditSubmit
              : handleModalSubmit
          }
        >
          <h2>{selectedDate?.SpecialistHourID ? 'Edit Event' : 'Add Event'}</h2>
          <div>
            <label>
              Shift Date:
              <input
                type='date'
                value={shiftDate}
                onChange={e => setShiftDate(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Shift Type:
              <select
                name='Type'
                value={eventType}
                onChange={e => setEventType(e.target.value)}
              >
                <option value='Working Hour'>Working Hour</option>
                <option value='Break'>Break</option>
              </select>
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
          {selectedDate?.SpecialistHourID && (
            <button onClick={handleRemoveShift}>Remove Shift</button>
          )}
        </Modal>
      )}
    </div>
  );
};

export default ManageShifts;
