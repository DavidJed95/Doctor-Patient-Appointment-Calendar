import React, { useState, useEffect, useCallback } from 'react';

import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import Calendar from '../calendar/Calendar';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchShifts,
  addShift,
  updateShift,
  deleteShift,
} from '../../redux/reducers/eventsSlice';

import Modal from '../common/Modal';

import Button from '../button/Button';

const ManageShifts = () => {
  const dispatch = useDispatch();
  const { ID: specialistID } = useSelector(state => state.user.userInfo);

  const loading = useSelector(state => state.events.loading);
  const [feedback, setFeedback] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const toggleModal = open => {
    setIsModalOpen(open);
  };

  const handleEventClick = clickInfo => {
    console.log('Event clicked line 41', clickInfo); // Check if this logs when an event is clicked
    const timeZone = 'Asia/Jerusalem'; // your preferred timezone

    // Convert UTC to local time
    const startLocal = utcToZonedTime(clickInfo.event.startStr, timeZone);
    const endLocal = utcToZonedTime(clickInfo.event.endStr, timeZone);

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

    toggleModal(true);
    console.log('Modal should open in handleDateClick', isModalOpen);
  };

  const handleDateSelect = selectInfo => {
    const timeZone = 'Asia/Jerusalem'; // your preferred timezone

    // Convert selected time to local timezone
    const startDate = utcToZonedTime(selectInfo.startStr, timeZone);
    const endDate = utcToZonedTime(selectInfo.endStr, timeZone);

    // Format the times for display
    const formattedShiftDate = format(startDate, 'yyyy-MM-dd', { timeZone });
    const formattedStartTime = format(startDate, 'HH:mm', { timeZone });
    const formattedEndTime = format(endDate, 'HH:mm', { timeZone });

    setShiftDetails({
      ShiftDate: formattedShiftDate,
      StartTime: formattedStartTime,
      EndTime: formattedEndTime,
      Type: 'Working Hour', // Default type, adjust as needed
    });

    resetSelectedShift();
    toggleModal(true);
  };

  /**
   * Reset the selected shift upon closing modal
   */
  const resetSelectedShift = useCallback(() => {
    setSelectedShift(null);
  }, []);

  /**
   * Closes the selected shift upon closing modal
   */
  const handleModalClose = useCallback(() => {
    toggleModal(false);
    setSelectedShift(null);
  }, []);

  const handleModalSubmit = async () => {
    try {
      if (selectedShift && selectedShift.id) {
        const updatedShift = await dispatch(
          updateShift({
            shiftID: selectedShift.shiftID,
            shiftDetails: {
              ...shiftDetails,
              MedicalSpecialistID: specialistID,
            },
          }),
        ).unwrap();
        setFeedback(updatedShift.message);
      } else {
        const createdNewShift = await dispatch(
          addShift({ ...shiftDetails, MedicalSpecialistID: specialistID }),
        ).unwrap();
        setFeedback(createdNewShift.message);
      }
      dispatch(fetchShifts(specialistID));
      handleModalClose(); // Close after submit
      // If you want to re-open the modal here, call handleModalOpen();
    } catch (error) {
      console.error('Error submitting shift:', error);
      setFeedback('Error updating shift: ' + error.message);
    }
  };

  const handleRemoveShift = useCallback(
    async event => {
      event.preventDefault();
      try {
        const shiftDeleted = await dispatch(
          deleteShift(selectedShift.id),
        ).unwrap();
        dispatch(fetchShifts(specialistID)); // Refetch to update the list
        handleModalClose();
        setFeedback(shiftDeleted.message);
      } catch (error) {
        console.error('Error deleting shift:', error);
        setFeedback('Error deleting shift: ' + error.message);
      }
    },
    [selectedShift, dispatch, specialistID, handleModalClose],
  );

  if (loading) return <div>Loading...</div>;

  return (
    <article>
      {feedback && <p>{feedback}</p>}
      <Calendar
        handleDateSelect={handleDateSelect}
        handleEventClick={handleEventClick}
      />
      {isModalOpen && (
        <Modal open={isModalOpen} onClose={() => handleModalClose}>
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
          <Button
            label={'Save'}
            type={'submit'}
            handleClick={handleModalSubmit}
          />
          {selectedShift?.id && (
            <Button label={'Remove Shift'} handleClick={handleRemoveShift} />
          )}
        </Modal>
      )}
    </article>
  );
};

export default ManageShifts;
