import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
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
  const events = useSelector(state => state.events.SpecialistAvailability);
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventStart = new Date(clickInfo.event.start);

    if (eventStart < today) {
      setFeedback("Can't modify past shifts");
      return;
    }

    setSelectedShift({
      id: clickInfo.event.id,
      ...clickInfo.event.extendedProps,
    });
    setModalOpen(true);
  };

  const handleDateSelect = selectInfo => {
    const startDate = selectInfo.start;
    const endDate = selectInfo.end;

    // Format the dates for the input fields in the modal
    const formattedShiftDate = format(startDate, 'yyyy-MM-dd');
    const formattedStartTime = format(startDate, 'HH:mm');
    const formattedEndTime = format(endDate, 'HH:mm');

    // Update the shiftDetails state to populate the modal inputs
    setShiftDetails({
      ...shiftDetails,
      ShiftDate: formattedShiftDate,
      StartTime: formattedStartTime,
      EndTime: formattedEndTime,
      Type: 'Working Hour', // Default type, can adjust as needed
    });

    // Open the modal after setting the state
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedShift(null);
    setModalOpen(false);
  };

  const handleModalSubmit = () => {
    if (selectedShift && selectedShift.id) {
      dispatch(
        updateShift({
          shiftID: selectedShift.id,
          shiftDetails: { ...shiftDetails, MedicalSpecialistID: specialistID },
        }),
      );
    } else {
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
    <section>
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
          <div>
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
          </div>
          <div>
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
          </div>
          <div>
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
          </div>
          <div>
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
          </div>
          {selectedShift?.id && (
            <button onClick={handleRemoveShift}>Remove Shift</button>
          )}
        </Modal>
      )}
    </section>
  );
};

export default ManageShifts;
