import React, { useState, useEffect, useCallback } from 'react';

import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import Calendar from '../calendar/Calendar';
import { useSelector, useDispatch } from 'react-redux';
import usePageTitle from '../../hooks/usePageTitle';
import {
  fetchShiftsForSpecialist,
  addShift,
  updateShift,
  deleteShift,
} from '../../redux/reducers/eventsSlice';

import Modal from '../common/Modal';

import Button from '../common/Button';

const ManageShifts = () => {
  usePageTitle('Doctor Shift Management')
  const dispatch = useDispatch();
  const { ID: specialistID } = useSelector(state => state.user.userInfo);

  const loading = useSelector(state => state.events.loading);
  const [feedback, setFeedback] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shiftDetails, setShiftDetails] = useState({
    ShiftDate: '',
    Type: 'Working Hour',
    StartTime: '',
    EndTime: '',
  });

  const [selectedShift, setSelectedShift] = useState(null);

  useEffect(() => {
    dispatch(fetchShiftsForSpecialist(specialistID));
  }, [dispatch, specialistID]);

  const toggleModal = useCallback(open => {
    setFeedback('')
    setIsModalOpen(open);
  }, []);

  const handleEventClick = clickInfo => {
    const timeZone = 'Asia/Jerusalem';

    const startLocal = utcToZonedTime(clickInfo.event.startStr, timeZone);
    const endLocal = utcToZonedTime(clickInfo.event.endStr, timeZone);

    const formattedShiftDate = format(startLocal, 'yyyy-MM-dd', { timeZone });
    const formattedStartTime = format(startLocal, 'HH:mm', { timeZone });
    const formattedEndTime = format(endLocal, 'HH:mm', { timeZone });

    setShiftDetails({
      ShiftDate: formattedShiftDate,
      StartTime: formattedStartTime,
      EndTime: formattedEndTime,
      Type: clickInfo.event.extendedProps.type || 'Working Hour',
    });

    setSelectedShift({
      id: clickInfo.event.id,
      ...clickInfo.event.extendedProps,
    });

    toggleModal(true);
  };

  const handleDateSelect = selectInfo => {
    const timeZone = 'Asia/Jerusalem';

    const startDate = utcToZonedTime(selectInfo.startStr, timeZone);
    const endDate = utcToZonedTime(selectInfo.endStr, timeZone);

    const formattedShiftDate = format(startDate, 'yyyy-MM-dd', { timeZone });
    const formattedStartTime = format(startDate, 'HH:mm', { timeZone });
    const formattedEndTime = format(endDate, 'HH:mm', { timeZone });

    setShiftDetails({
      ShiftDate: formattedShiftDate,
      StartTime: formattedStartTime,
      EndTime: formattedEndTime,
      Type: 'Working Hour',
    });

    resetSelectedShift();
    toggleModal(true);
  };

  const resetSelectedShift = useCallback(() => {
    setSelectedShift(null);
  }, []);

  const handleModalClose = useCallback(() => {
    toggleModal(false);
    setSelectedShift(null);
  }, [toggleModal]);

  const handleModalSubmit = async (event) => {
    event.preventDefault()
    try {
      if (selectedShift && selectedShift.id) {
        const updatedShift = await dispatch(
          updateShift({
            shiftID: selectedShift.id,
            shiftDetails: {
              ...shiftDetails,
              MedicalSpecialistID: specialistID,
            },
          }),
        ).unwrap();
        setFeedback(updatedShift.message);
      } else {
        const creatingNewShift = await dispatch(
          addShift({ ...shiftDetails, MedicalSpecialistID: specialistID }),
        ).unwrap();
        setFeedback(creatingNewShift.message);
      }
      dispatch(fetchShiftsForSpecialist(specialistID));
      setTimeout(() => {
        handleModalClose();
      }, 2000);
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
        dispatch(fetchShiftsForSpecialist(specialistID));
        setFeedback(shiftDeleted.message); // Update feedback with the message
        setTimeout(() => {
          handleModalClose();
        }, 1000);
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
      <Calendar
        handleDateSelect={handleDateSelect}
        handleEventClick={handleEventClick}
      />
      {isModalOpen && (
        <Modal open={isModalOpen} onClose={handleModalClose}>
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
          <Button label={'Cancel'} handleClick={handleModalClose} />
          {selectedShift?.id && (
            <Button label={'Remove Shift'} handleClick={handleRemoveShift} />
          )}
          {feedback && <p>{feedback}</p>}
        </Modal>
      )}
    </article>
  );
};

export default ManageShifts;
