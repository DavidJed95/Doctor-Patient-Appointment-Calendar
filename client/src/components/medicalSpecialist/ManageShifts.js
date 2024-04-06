import React, { useState, useEffect } from 'react';

import { format, parseISO } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

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

  if (loading) return <div>Loading...</div>;

  const handleEventClick = clickInfo => {
    // Assuming clickInfo.event.start and clickInfo.event.end are Date objects
    const formattedShiftDate = format(clickInfo.event.start, 'yyyy-MM-dd');
    const formattedStartTime = format(clickInfo.event.start, 'HH:mm');
    const formattedEndTime = format(clickInfo.event.end, 'HH:mm');

    // Populate the shiftDetails state with the clicked event's details
    setShiftDetails({
      ShiftDate: formattedShiftDate,
      StartTime: formattedStartTime,
      EndTime: formattedEndTime,
      Type: clickInfo.event.extendedProps.type, // Ensure this matches your event object structure
    });

    // Set the selected shift for identification, and open the modal for editing
    setSelectedShift({
      id: clickInfo.event.id,
      ...clickInfo.event.extendedProps, // This might include other properties you need
    });
    setModalOpen(true);
  };

  const handleDateSelect = selectInfo => {
    const startDate = selectInfo.start;
    const endDate = selectInfo.end;

    // Format the dates for the input fields in the modal for a new shift
    const formattedShiftDate = format(startDate, 'yyyy-MM-dd');
    const formattedStartTime = format(startDate, 'HH:mm');
    const formattedEndTime = format(endDate, 'HH:mm');

    // Prepare the shiftDetails state for a new shift
    setShiftDetails({
      ShiftDate: formattedShiftDate,
      StartTime: formattedStartTime,
      EndTime: formattedEndTime,
      Type: 'Working Hour', // Default type, adjust as needed
    });

    // Reset selectedShift to ensure we're in "add new" mode
    setSelectedShift(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedShift(null);
    setModalOpen(false);
  };
  // TODO: This function shouldn't use updateShift function because it should be called from eventsSlice.js correctly first
  // TODO: Continue looking at the update function in server for passing correct values because of getting undefined without the ability to update
  const handleModalSubmit = () => {
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
  };

  const handleRemoveShift = () => {
    if (selectedShift && selectedShift.id) {
      dispatch(deleteShift(selectedShift.id));
    }
    handleModalClose();
  };

  return (
    <article>
      <Calendar
        eventType='specialistAvailability'
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
