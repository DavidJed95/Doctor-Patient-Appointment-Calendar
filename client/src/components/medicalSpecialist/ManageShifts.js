import React, { useState, useEffect, useCallback } from 'react';

import { format, parseISO, isValid } from 'date-fns';
import { utcToZonedTime ,zonedTimeToUtc } from 'date-fns-tz';

import Calendar from '../calendar/Calendar';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchShifts,
  addShift,
  updateShift,
  deleteShift,
} from '../../redux/reducers/eventsSlice';

import Modal from '../common/Modal';

// import Button from '../button/Button';

const ManageShifts = () => {
  const dispatch = useDispatch();
  const { ID: specialistID } = useSelector(state => state.user.userInfo);

  const loading = useSelector(state => state.events.loading);
  const [feedback, setFeedback] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [shiftDetails, setShiftDetails] = useState({
    ShiftDate: '',
    Type: '',
    StartTime: '',
    EndTime: '',
  });

  const [selectedShift, setSelectedShift] = useState(null);

  useEffect(() => {
    dispatch(fetchShifts(specialistID));
  }, [dispatch, specialistID]);

  const toggleModal = useCallback(open => {
    setModalOpen(open);
    console.log(`Modal suppose to be ${open=== true?'open = true':'closed = false'}`)
  }, []);

  const handleEventClick = useCallback(
    clickInfo => {
      console.log('Event clicked line 41', clickInfo); // Check if this logs when an event is clicked
      const timeZone = 'Asia/Jerusalem'; // your preferred timezone

      // Convert UTC to local time
      const startLocal = utcToZonedTime(clickInfo.event.start, timeZone);
      const endLocal = utcToZonedTime(clickInfo.event.end, timeZone);

      const formattedShiftDate = format(startLocal, 'yyyy-MM-dd', { timeZone });
      const formattedStartTime = format(startLocal, 'HH:mm', { timeZone });
      const formattedEndTime = format(endLocal, 'HH:mm', { timeZone });

      setShiftDetails({
        ShiftDate: formattedShiftDate,
        StartTime: formattedStartTime,
        EndTime: formattedEndTime,
        Type: clickInfo.event.extendedProps.type,
      });

      setSelectedShift({
        id: clickInfo.event.id,
        ...clickInfo.event.extendedProps,
      });

      // clickInfo.jsEvent.preventDefault(); // Prevent default action
      // clickInfo.jsEvent.stopPropagation(); // Stop event bubbling
      toggleModal(true);
      console.log('Modal should open', isModalOpen);
    },
    [toggleModal],
  );
  

  const handleDateSelect = useCallback(
    selectInfo => {
      const timeZone = 'Asia/Jerusalem'; // your preferred timezone

      // Convert selected time to local timezone
      const startDate = utcToZonedTime(selectInfo.startStr, timeZone);
      const endDate = utcToZonedTime(selectInfo.endStr, timeZone);

      console.log(`line 73: ${selectInfo.endStr}`);

      // Format the times for display
      const formattedShiftDate = format(startDate, 'yyyy-MM-dd', { timeZone });
      const formattedStartTime = format(startDate, 'HH:mm', { timeZone });
      const formattedEndTime = format(endDate, 'HH:mm', { timeZone });
      console.log(`formattedShiftsDate: ${formattedShiftDate}`);
      console.log(`formattedStartTime: ${formattedStartTime}`);
      console.log(`formattedEndTime: ${formattedEndTime}`);

      setShiftDetails({
        ShiftDate: formattedShiftDate,
        StartTime: formattedStartTime,
        EndTime: formattedEndTime,
        Type: 'Working Hour', // Default type, adjust as needed
      });

      resetSelectedShift();
      toggleModal(true);
      console.log('Modal should open', isModalOpen);
    },
    [toggleModal],
  );
  

  /**
   * Reset the selected shift upon closing modal
   */
  const resetSelectedShift = useCallback(() => {
    setSelectedShift(null);
  }, [])
  
  /**
   * Closes the selected shift upon closing modal
   */
  const handleModalClose = useCallback(() => {
    toggleModal(false);
    setSelectedShift(null);
  }, [toggleModal]);
  
  /**
   * Opens the edition/ creation/ deletion request of shift upon opening modal
   */
  const handleModalOpen = useCallback((open) => {
    setModalOpen(open);
  }, []);

  // TODO: This function shouldn't use updateShift function because it should be called from eventsSlice.js correctly first
  // TODO: Continue looking at the update function in server for passing correct values because of getting undefined without the ability to update
  const handleModalSubmit = useCallback(async () => {
    try {
        if (selectedShift && selectedShift.id) {
            await dispatch(updateShift({
                shiftID: selectedShift.shiftID,
                shiftDetails: { ...shiftDetails, MedicalSpecialistID: specialistID },
            })).unwrap();
        } else {
            await dispatch(addShift({ ...shiftDetails, MedicalSpecialistID: specialistID })).unwrap();
        }
        dispatch(fetchShifts(specialistID));
        handleModalClose();  // Close after submit
        setFeedback("Shift updated successfully!");  // Set feedback
        // If you want to re-open the modal here, call handleModalOpen();
    } catch (error) {
        console.error('Error submitting shift:', error);
        setFeedback("Error updating shift: " + error.message);
    }
}, [selectedShift, shiftDetails, specialistID, dispatch, handleModalClose, handleModalOpen]);

  const handleRemoveShift = useCallback(async (event) => {
    event.preventDefault();
    try {
      await dispatch(deleteShift(selectedShift.id)).unwrap();
      dispatch(fetchShifts(specialistID)); // Refetch to update the list
      handleModalClose();
      setFeedback("Shift deleted successfully!");
    } catch (error) {
      console.error('Error deleting shift:', error);
      setFeedback("Error deleting shift: " + error.message);
    }
  }, [selectedShift, dispatch, specialistID, handleModalClose]);
  
  if (loading) return <div>Loading...</div>;

  return (
    <article>
      {feedback && <p>{feedback}</p>}
      <Calendar
        handleDateSelect={handleDateSelect}
        handleEventClick={handleEventClick}
      />
      {isModalOpen && (
        <Modal
          show={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        >
          <h2>{selectedShift?.id ? 'Edit Shift' : 'Add Shift'}</h2>
          <section>
            <label>
              Shift Date:
              <input
                type='date'
                value={shiftDetails.ShiftDate}
                onChange={e =>
                  setShiftDetails(prev => ({
                    ...prev,
                    ShiftDate: e.target.value,
                  }))
                }
              />
            </label>
          </section>
          <section>
            <label>
              Shift Type:
              <select
                name='Type'
                value={shiftDetails.Type}
                onChange={e =>
                  setShiftDetails(prev => ({ ...prev, Type: e.target.value }))
                }
              >
                <option value='Working Hour'>Working Hour</option>
                <option value='Break'>Break</option>
              </select>
            </label>
          </section>
          <section>
            <label>
              Start Time:
              <input
                type='time'
                value={shiftDetails.StartTime}
                onChange={e =>
                  setShiftDetails(prev => ({
                    ...prev,
                    StartTime: e.target.value,
                  }))
                }
              />
            </label>
          </section>
          <section>
            <label>
              End Time:
              <input
                type='time'
                value={shiftDetails.EndTime}
                onChange={e =>
                  setShiftDetails(prev => ({
                    ...prev,
                    EndTime: e.target.value,
                  }))
                }
              />
            </label>
          </section>
          {selectedShift?.id && (
            <button onClick={handleRemoveShift}>Remove Shift</button>
          )}
        </Modal>
      )}
    </article>
  );
};

export default ManageShifts;
