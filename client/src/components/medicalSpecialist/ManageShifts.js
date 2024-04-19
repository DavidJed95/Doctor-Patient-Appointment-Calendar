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

  
  const handleEventClick = useCallback((clickInfo) => {
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
    setModalOpen(true);
  },[]);
  
  const handleDateSelect = useCallback((selectInfo) => {
    const startDate = new Date(selectInfo.start);
    const endDate = new Date(selectInfo.end);
    
    if (isValid(startDate) && isValid(endDate)) {
      const formattedShiftDate = format(startDate, 'yyyy-MM-dd');
      const formattedStartTime = format(startDate, 'HH:mm');
      const formattedEndTime = format(endDate, 'HH:mm');
      
      setShiftDetails({
        ShiftDate: formattedShiftDate,
        StartTime: formattedStartTime,
        EndTime: formattedEndTime,
        Type: 'Working Hour', // Default type, adjust as needed
      });
      
      setSelectedShift(null);
      handleModalOpen();
    } else {
      console.error('Selected dates are invalid:', selectInfo);
    }
  },[]);
  
  /**
   * Reset the selected shift upon closing modal
   */
  const resetSelectedShift = useCallback(() => {
    setSelectedShift(null);
  }, [])
  
  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    resetSelectedShift();
  }, [resetSelectedShift]);
  
  
  const handleModalOpen = useCallback(() => {
    setModalOpen(true);
  }, []);

  // TODO: This function shouldn't use updateShift function because it should be called from eventsSlice.js correctly first
  // TODO: Continue looking at the update function in server for passing correct values because of getting undefined without the ability to update
  const handleModalSubmit = useCallback(() => {
    if (selectedShift && selectedShift.id) {
      // Editing an existing shift
      dispatch(
        updateShift({
          shiftID: selectedShift.shiftID,
          shiftDetails: { ...shiftDetails, MedicalSpecialistID: specialistID },
        }),
      );
    } else {
      // Adding a new shift
      dispatch(
        addShift({ ...shiftDetails, MedicalSpecialistID: specialistID }),
      );
    }
    handleModalClose();
  }, [selectedShift, shiftDetails, specialistID, dispatch, handleModalClose]);

  const handleRemoveShift = useCallback(() => {
    if (selectedShift && selectedShift.id) {
      dispatch(deleteShift(selectedShift.id));
    }
    handleModalClose();
  }, [selectedShift, dispatch, handleModalClose]);
  
  if (loading) return <div>Loading...</div>;

  return (
    <article>
      <Calendar
        handleDateSelect={handleDateSelect}
        handleEventClick={handleEventClick}
      />
      {feedback && <p>{feedback}</p>}
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
