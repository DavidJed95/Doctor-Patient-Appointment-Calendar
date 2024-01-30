import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import Calendar from '../calendar/Calendar';
import { useSelector, useDispatch } from 'react-redux';
import {
  addSpecialistAvailability,
  removeEvent,
  updateEvent,
} from '../../redux/reducers/eventsSlice';
import Modal from '../common/Modal';
import {
  fetchShiftsAPI,
  addShiftAPI,
  updateShiftAPI,
  deleteShiftAPI,
} from './shiftsAPI';
import Button from '../button/Button';

const ManageShifts = () => {
  const { ID: specialistID } = useSelector(state => state.user.userInfo);
  const events = useSelector(state => state.events);
  const specialistAvailability = events.filter(
    event => event.eventType === 'specialistAvailability',
  ); // Filter by eventType
  const dispatch = useDispatch();

  const [feedback, setFeedback] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  // const [shifts, setShifts] = useState({
  //   MedicalSpecialistID: specialistID,
  //   DayOfWeek: null,
  //   StartTime: null, // Changed from empty string to null
  //   EndTime: null, // Changed from empty string to null
  //   Type: 'Working Hour',
  //   ShiftDate: format(new Date(), 'yyyy-MM-dd'),
  // });
  const [shifts, setShifts] = useState(() => []);
  const [selectedDate, setSelectedDate] = useState(null);
  const [reportDates, setReportDates] = useState({ start: null, end: null });

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const data = await fetchShiftsAPI(specialistID);
        console.log('Shift Data:', data);
        const formattedShifts = data.map(shift => convertToEventFormat(shift));
        formattedShifts.forEach(shift =>
          dispatch(addSpecialistAvailability(shift)),
        );
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
console.log(`Shift Type line 73: ${shift.Type}`);
    return {
      id: shift.SpecialistHourID,
      title: shift.Type,
      start: startDate,
      end: endDate,
      eventType: 'specialistAvailability'
    };
  };

  const handleEventClick = useCallback(
    clickInfo => {
      if (isPastDate(clickInfo.event.start)) {
        setFeedback("Can't modify past shifts");
        return;
      }

      const clickedShift = {
        MedicalSpecialistID: specialistID,
        DayOfWeek: clickInfo.event.start.getDay(),
        StartTime: format(clickInfo.event.start, 'HH:mm'),
        EndTime: format(clickInfo.event.end, 'HH:mm'),
        Type: clickInfo.event.title,
        ShiftDate: format(clickInfo.event.start, 'yyyy-MM-dd'),
      };

      setShifts([...shifts, clickedShift]);
      setSelectedDate(clickInfo.event);
      setModalOpen(true);
    },
    [specialistID, shifts],
  );

  const isOverlapping = useCallback(
    (start, end) =>
      specialistAvailability.some(
        event =>
          (start >= event.start && start < event.end) ||
          (end > event.start && end <= event.end) ||
          (start <= event.start && end >= event.end),
      ),
    [specialistAvailability],
  );

  const handleDateSelect = useCallback(
    selectInfo => {
      if (isOverlapping(selectInfo.start, selectInfo.end)) {
        setFeedback('This time overlaps with another event.');
        return;
      }

      const selectedShift = {
        ...shifts,
        DayOfWeek: selectInfo.start.getDay(),
        StartTime: selectInfo.start, // Use the Date directly
        EndTime: selectInfo.end, // Use the Date directly
        ShiftDate: format(selectInfo.start, 'yyyy-MM-dd'),
      };

      setShifts(selectedShift);
      setSelectedDate({
        start: selectInfo.start,
        end: selectInfo.end,
        allDay: selectInfo.allDay,
      });

      setModalOpen(true);
    },
    [shifts, isOverlapping],
  );

  const handleModalClose = () => {
    setSelectedDate(null);
    setModalOpen(false);
  };

  const handleModalSubmit = async () => {
    if (isNaN(shifts.StartTime) || isNaN(shifts.EndTime)) {
      setFeedback('Issue with date values. Please try again.');
      return;
    }
    if (isOverlapping(new Date(shifts.StartTime), new Date(shifts.EndTime))) {
      setFeedback('This time overlaps with another event.');
      return;
    }

    try {
      const response = await addShiftAPI(shifts);
      setFeedback(response.message);
      dispatch(addSpecialistAvailability(response.shift));
      handleModalClose();
    } catch (error) {
      setFeedback(error.message);
    }
  };

  const handleEditSubmit = async () => {
    if (shifts.Type && selectedDate) {
      const updatedEvent = {
        MedicalSpecialistID: specialistID,
        Type: shifts.Type,
        DayOfWeek: new Date(selectedDate.start).getDay(),
        StartTime: format(new Date(shifts.StartTime), 'HH:mm'),
        EndTime: format(new Date(shifts.EndTime), 'HH:mm'),
        ShiftDate: shifts.ShiftDate,
      };

      try {
        await updateShiftAPI(selectedDate.id, updatedEvent);
        dispatch(updateEvent(updatedEvent));
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
        dispatch(removeEvent({ id: selectedDate.id }));
        setFeedback('Shift deleted successfully.');
      } catch (error) {
        setFeedback(error.message);
      }
    }
    handleModalClose();
  };

  console.log(
    `The events in the ManageShifts component before sending them to the Calendar component: ${shifts}`,
  );
  return (
    <div>
      <Calendar
        eventType='specialistAvailability'
        handleDateSelect={handleDateSelect}
        handleEventClick={handleEventClick}
        events={specialistAvailability.map(event => ({
          ...event,
          title: event.Type || 'Unknown',
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
                value={shifts.ShiftDate}
                onChange={e =>
                  setShifts(prev => ({ ...prev, ShiftDate: e.target.value }))
                }
              />
            </label>
          </div>
          <div>
            <label>
              Shift Type:
              <select
                name='Type'
                value={shifts.Type}
                onChange={e =>
                  setShifts(prev => ({ ...prev, Type: e.target.value }))
                }
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
                value={
                  shifts.StartTime instanceof Date
                    ? format(shifts.StartTime, 'HH:mm')
                    : ''
                }
                onChange={e => {
                  const [hours, minutes] = e.target.value.split(':');
                  const newStartTime = new Date();
                  newStartTime.setHours(hours, minutes, 0, 0);
                  setShifts(prev => ({ ...prev, StartTime: newStartTime }));
                }}
              />
            </label>
          </div>
          <div>
            <label>
              End Time:
              <input
                type='time'
                value={
                  shifts.EndTime instanceof Date
                    ? format(shifts.EndTime, 'HH:mm')
                    : ''
                }
                onChange={e => {
                  const [hours, minutes] = e.target.value.split(':');
                  const newEndTime = new Date();
                  newEndTime.setHours(hours, minutes, 0, 0);
                  setShifts(prev => ({ ...prev, EndTime: newEndTime }));
                }}
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
