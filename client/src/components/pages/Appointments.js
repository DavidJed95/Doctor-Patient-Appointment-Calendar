import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import Calendar from '../calendar/Calendar';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
// import {
//   addAppointmentToPatient,
//   removeAppointmentFromPatient,
//   updateAppointment,
// } from '../../redux/reducers/patientAppointmentsSlice.js';
import Modal from '../common/Modal';
// import {
//   addAppointmentAPI,
//   updateAppointmentAPI,
// deleteAppointmentAPI
// } from '../patient/AppointmentsAPI';
const Appointments = () => {
  const [initiatePayment, setInitiatePayment] = useState(false);
  const [selectedAppointmentCost, setSelectedAppointmentCost] = useState(null);

  const initialOptions = {
    'client-id':
      'AY5d8OdBxfs1C4My3bBlOHzcBHInULIZKK1IM8sje0assoOp-ukCwDqSaOIU3E7wa-Y8OwN-E7ITZ5Sg',
    currency: 'ILS',
    intent: 'capture',
  };
  const { ID: PatientID } = useSelector(state => state.user.userInfo);
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
  const [appointmentDate, setAppointmentDate] = useState(
    format(new Date(), 'yyyy-MM-dd'),
  );

  //   useEffect(() => {
  //   const fetchShifts = async () => {
  //     try {
  //       const data = await fetchShiftsAPI();
  //       data.forEach(shift => dispatch(setAvailability(shift)));
  //     } catch (error) {
  //       setFeedback(error.message);
  //     }
  //   };
  //   fetchShifts();
  // }, [dispatch]);


    const handleInitiatePayment = cost => {
      setSelectedAppointmentCost(cost); // set the cost for the selected appointment
      setInitiatePayment(true);
    };

    const handlePaymentFailure = error => {
      // Handle payment failure, show error to user
      setInitiatePayment(false); // reset the payment initiation
      // Show an error message to the user
    };
  const isPastDate = date => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleEventClick = useCallback(clickInfo => {
    if (isPastDate(clickInfo.event.start)) {
      setFeedback("Can't modify past shifts");
      return;
    }
    // setShiftDate(format(clickInfo.event.start, 'yyyy-MM-dd')); // Set the date here
    setSelectedDate(clickInfo.event);
    setModalOpen(true);
  }, []);

  const handleDateSelect = useCallback(
    selectInfo => {
      const overlappingEvent = specialistAvailability.find(
        event =>
          selectInfo.start >= new Date(event.start) &&
          selectInfo.end <= new Date(event.end),
      );

      if (!overlappingEvent) {
        setFeedback('The specialist is not available at this time.');
        return;
      }

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
    // if (eventTitle && startTime && endTime) {
    //   const startDateTime = new Date(selectedDate.startStr);
    //   const endDateTime = new Date(selectedDate.startStr);
    //   startDateTime.setHours(parseInt(startTime.split(':')[0]));
    //   startDateTime.setMinutes(parseInt(startTime.split(':')[1]));
    //   endDateTime.setHours(parseInt(endTime.split(':')[0]));
    //   endDateTime.setMinutes(parseInt(endTime.split(':')[1]));
    //   const newEvent = {
    //     MedicalSpecialistID: specialistID,
    //     DayOfWeek: startDateTime.getDay(),
    //     StartTime: format(startDateTime, 'HH:mm'),
    //     EndTime: format(endDateTime, 'HH:mm'),
    //     Type: eventType,
    //     ShiftDate: format(startDateTime, 'yyyy-MM-dd'),
    //   };
    //   try {
    //     const response = await addShiftAPI(newEvent);
    //     setFeedback(response.message);
    //     dispatch(setAvailability(response.shift));
    //     handleModalClose();
    //   } catch (error) {
    //     setFeedback(error.message);
    //   }
    // }
  };

  const handleEditSubmit = async () => {
    // if (eventTitle && selectedDate) {
    //   const updatedEvent = {
    //     MedicalSpecialistID: specialistID,
    //     Type: eventType,
    //     DayOfWeek: new Date(selectedDate.start).getDay(),
    //     StartTime: new Date(selectedDate.start).toISOString(),
    //     EndTime: new Date(selectedDate.end).toISOString(),
    //   };

    //   try {
    //     await updateShiftAPI(selectedDate.id, updatedEvent);
    //     dispatch(updateAvailability(updatedEvent)); // Update the event in local state
    //     setFeedback('Shift updated successfully.');
    //   } catch (error) {
    //     setFeedback(error.message);
    //   }
    // }
    handleModalClose();
  };

  //   const handleRemoveShift = async () => {
  //     if (selectedDate) {
  //       try {
  //         await deleteShiftAPI(selectedDate.id);
  //         dispatch(removeAvailability({ id: selectedDate.id })); // Remove the event from local state
  //         setFeedback('Shift deleted successfully.');
  //       } catch (error) {
  //         setFeedback(error.message);
  //       }
  //     }
  //     handleModalClose();
  //   };

const handleBookAppointment = (selectedDate, cost) => {
  handleInitiatePayment(cost);
  // Any other logic that you wish to implement when booking is clicked
};


  const h1Heading = 'Appointments';
  return (
    <PayPalScriptProvider options={initialOptions}>
      <div>
        {initiatePayment && (
          <PayPalPayment
            amount={selectedAppointmentCost}
            onSuccess={handlePaymentSuccess}
            onFailure={handlePaymentFailure}
          />
        )}
        {/* <PayPalButtons /> */}
        <h1>{h1Heading}</h1>
        <Calendar
          eventType='patientAppointment'
          handleDateSelect={handleDateSelect}
          handleEventClick={handleEventClick}
          events={specialistAvailability}
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
            <h2>
              {selectedDate?.SpecialistHourID ? 'Edit Event' : 'Add Event'}
            </h2>
            {/* <div>
                <label>
                  Shift Date:
                  <input
                    type='date'
                    value={shiftDate}
                    onChange={e => setShiftDate(e.target.value)}
                  />
                </label>
              </div> */}
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
            {/* {selectedDate?.SpecialistHourID && (
                <button onClick={handleRemoveShift}>Remove</button>
              )} */}
          </Modal>
        )}
      </div>
    </PayPalScriptProvider>
  );
};
export default Appointments;
