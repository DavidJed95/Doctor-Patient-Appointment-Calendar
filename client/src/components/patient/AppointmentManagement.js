import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
// import { utcToZonedTime } from 'date-fns-tz';
import { useSelector, useDispatch } from "react-redux";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Calendar from "../calendar/Calendar";
import Modal from "../common/Modal";
import Button from "../button/Button";
import SearchBar from "./SearchBar";
import {
  fetchAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} from "../../redux/reducers/AppointmentsSlice";
import PayPalPayment from "../payPalPayment/PayPalPayment";
import { fetchTreatmentAPI } from "../treatments/treatmentsAPI";
import { MY_PAYPAL_CLIENT_ID } from "../../config";

const AppointmentManagement = () => {
  const dispatch = useDispatch();
  const { ID: patientID } = useSelector((state) => state.user.userInfo);
  const appointments = useSelector((state) => state.appointments.appointments);
  const loading = useSelector((state) => state.appointments.loading);
  // const treatmentPrice = useSelector(state => state.treatments.price);
  const [feedback, setFeedback] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState({
    Date: "",
    StartTime: "",
    EndTime: "",
    isPayedFor: false,
    TreatmentID: "",
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [treatmentPrice, setTreatmentPrice] = useState(0);
  const [treatmentDescription, setTreatmentDescription] = useState("");

  const initialOptions = {
    "client-id": MY_PAYPAL_CLIENT_ID,
    currency: "ILS",
    intent: "capture",
  };

  useEffect(() => {
    dispatch(fetchAppointments(patientID));
  }, [dispatch, patientID]);

  const toggleModal = useCallback((open) => {
    setFeedback("");
    setIsModalOpen(open);
  }, []);

  const handleEventClick = (clickInfo) => {
    // TODO: if startLocal and end Local are wrong we will use the formation from ManageShifts.js with 'Str'
    const startLocal = new Date(clickInfo.event.startStr);
    const endLocal = new Date(clickInfo.event.endStr);

    const formattedDate = format(startLocal, "yyyy-MM-dd");
    const formattedStartTime = format(startLocal, "HH:mm");
    const formattedEndTime = format(endLocal, "HH:mm");

    setAppointmentDetails({
      Date: formattedDate,
      StartTime: formattedStartTime,
      EndTime: formattedEndTime,
      isPayedFor: clickInfo.event.extendedProps.isPayedFor,
      TreatmentID: clickInfo.event.extendedProps.TreatmentID || "",
    });

    setSelectedAppointment({
      id: clickInfo.event.id,
      ...clickInfo.event.extendedProps,
    });

    if (clickInfo.event.extendedProps.TreatmentID) {
      fetchTreatmentAPI(clickInfo.event.extendedProps.TreatmentID);
    }

    toggleModal(true);
  };

  const handleDateSelect = (selectInfo) => {
    const startDate = new Date(selectInfo.startStr);
    const endDate = new Date(selectInfo.endStr);

    const formattedDate = format(startDate, "yyyy-MM-dd");
    const formattedStartTime = format(startDate, "HH:mm");
    const formattedEndTime = format(endDate, "HH:mm");

    setAppointmentDetails({
      Date: formattedDate,
      StartTime: formattedStartTime,
      EndTime: formattedEndTime,
      isPayedFor: false,
      TreatmentID: "",
    });

    resetSelectedAppointment();
    toggleModal(true);
  };

  const resetSelectedAppointment = useCallback(() => {
    setSelectedAppointment(null);
  }, []);

  const handleModalClose = useCallback(() => {
    toggleModal(false);
    setSelectedAppointment(null);
  }, [toggleModal]);

  // const handleModalSubmit = async event => {
  //   event.preventDefault();
  //   try {
  //     if (selectedAppointment && selectedAppointment.id) {
  //       const updatedAppointment = await dispatch(
  //         updateAppointment({
  //           appointmentID: selectedAppointment.id,
  //           appointmentDetails: {
  //             ...appointmentDetails,
  //             PatientID: patientID,
  //           },
  //         }),
  //       ).unwrap();
  //       setFeedback(updatedAppointment.message);
  //     } else {
  //       const newAppointment = await dispatch(
  //         addAppointment({ ...appointmentDetails, PatientID: patientID }),
  //       ).unwrap();
  //       setFeedback(newAppointment.message);
  //     }
  //     dispatch(fetchAppointments(patientID));
  //     setTimeout(() => {
  //       handleModalClose();
  //     }, 2000);
  //   } catch (error) {
  //     console.error('Error submitting appointment:', error);
  //     setFeedback('Error updating appointment: ' + error.message);
  //   }
  // };

  const handleModalSubmit = async (event) => {
    event.preventDefault();
    if (!appointmentDetails.isPayedFor) {
      setPaymentInProgress(true);
      return;
    }
    try {
      if (selectedAppointment && selectedAppointment.id) {
        const updatedAppointment = await dispatch(
          updateAppointment({
            appointmentID: selectedAppointment.id,
            appointmentDetails: {
              ...appointmentDetails,
              PatientID: patientID,
            },
          })
        ).unwrap();
        setFeedback(updatedAppointment.message);
      } else {
        const newAppointment = await dispatch(
          addAppointment({ ...appointmentDetails, PatientID: patientID })
        ).unwrap();
        setFeedback(newAppointment.message);
      }
      dispatch(fetchAppointments(patientID));
      setTimeout(() => {
        handleModalClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting appointment:", error);
      setFeedback("Error updating appointment: " + error.message);
    }
  };

  // const handleModalSubmit = async event => {
  //   event.preventDefault();
  //   try {
  //     if (selectedAppointment && selectedAppointment.id) {
  //       const updatedAppointment = await dispatch(
  //         updateAppointment({
  //           appointmentID: selectedAppointment.id,
  //           appointmentDetails: {
  //             ...appointmentDetails,
  //             PatientID: patientID,
  //           },
  //         }),
  //       ).unwrap();
  //       setFeedback(updatedAppointment.message);
  //     } else {
  //       setPaymentInProgress(true);
  //     }
  //   } catch (error) {
  //     console.error('Error submitting appointment:', error);
  //     setFeedback('Error updating appointment: ' + error.message);
  //   }
  // };

  const handleRemoveAppointment = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        const appointmentDeleted = await dispatch(
          deleteAppointment(selectedAppointment.id)
        ).unwrap();
        dispatch(fetchAppointments(patientID));
        setFeedback(appointmentDeleted.message);
        setTimeout(() => {
          handleModalClose();
        }, 1000);
      } catch (error) {
        console.error("Error deleting appointment:", error);
        setFeedback("Error deleting appointment: " + error.message);
      }
    },
    [selectedAppointment, dispatch, patientID, handleModalClose]
  );

  // const handlePaymentSuccess = async details => {
  //   try {
  //     const newAppointment = await dispatch(
  //       addAppointment({ ...appointmentDetails, PatientID: patientID }),
  //     ).unwrap();
  //     setFeedback('Payment successful! ' + newAppointment.message);
  //     dispatch(fetchAppointments(patientID));
  //     handleModalClose();
  //   } catch (error) {
  //     console.error('Error creating appointment:', error);
  //     setFeedback('Error creating appointment: ' + error.message);
  //   }
  // };

  const handlePaymentSuccess = (details) => {
    setFeedback("Payment successful!");
    setAppointmentDetails((prev) => ({
      ...prev,
      isPayedFor: true,
    }));
    setPaymentInProgress(false);
    handleModalSubmit(); // Proceed with appointment creation after successful payment
  };

  const handlePaymentError = (error) => {
    console.error("Payment Error:", error);
    setFeedback("Payment failed. Please try again.");
    setPaymentInProgress(false);
  };

  const fetchTreatmentPrice = async (treatmentID) => {
    try {
      const treatment = await fetchTreatmentAPI(treatmentID);
      setTreatmentPrice(treatment.Price);
      setTreatmentDescription(treatment.TreatmentName);
    } catch (error) {
      console.error("Error fetching treatment price:", error);
      setFeedback("Error fetching treatment price");
    }
  };

  if (loading) return <div>Loading...</div>;

  const handleSearch = (query) => {
    // TODO: Implement search functionality to find medical specialists based on the query if he is available
    console.log(`Search query: ${query}`);
  };

  const searchBarsStyle = {
    display: "flex",
    justifyContent: "space-around",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <article>
        <div style={searchBarsStyle}>
          <SearchBar
            onSearch={handleSearch}
            placeholder={'Medical specialists name'}
          />
          <SearchBar
            onSearch={handleSearch}
            placeholder={'Medical specialist spoken language'}
          />
          <SearchBar
            onSearch={handleSearch}
            placeholder={'Medical specialist Specialization'}
          />
        </div>
        <Calendar
          handleDateSelect={handleDateSelect}
          handleEventClick={handleEventClick}
          events={appointments}
        />
        {isModalOpen && (
          <Modal open={isModalOpen} onClose={handleModalClose}>
            <h2>
              {selectedAppointment?.id
                ? 'Edit Appointment'
                : 'Create Appointment'}
            </h2>
            <section>
              <label>
                Date:
                <input
                  type='date'
                  value={appointmentDetails.Date}
                  onChange={e =>
                    setAppointmentDetails(prev => ({
                      ...prev,
                      Date: e.target.value,
                    }))
                  }
                />
              </label>
            </section>
            <section>
              <label>
                Start Time:
                <input
                  type='time'
                  value={appointmentDetails.StartTime}
                  onChange={e =>
                    setAppointmentDetails(prev => ({
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
                  value={appointmentDetails.EndTime}
                  onChange={e =>
                    setAppointmentDetails(prev => ({
                      ...prev,
                      EndTime: e.target.value,
                    }))
                  }
                />
              </label>
            </section>
            <section>
              <label>
                Treatment:
                <select
                  value={appointmentDetails.TreatmentID}
                  onChange={e => {
                    const treatmentID = e.target.value;
                    setAppointmentDetails(prev => ({
                      ...prev,
                      TreatmentID: treatmentID,
                    }));
                    fetchTreatmentPrice(treatmentID);
                  }}
                >
                  <option value="">Select Treatment</option>
                  {/* Populate options with treatments from your database */}
                </select>
              </label>
            </section>
            {paymentInProgress && (
              <PayPalPayment
                amount={treatmentPrice}
                description={treatmentDescription}
                onSuccess={handlePaymentSuccess}
                onFailure={handlePaymentError}
              />
            )}
            {!paymentInProgress && (
              <>
                <Button
                  label={'Save'}
                  type={'submit'}
                  handleClick={handleModalSubmit}
                />
                <Button label={'Cancel'} handleClick={handleModalClose} />
              </>
            )}
            {selectedAppointment?.id && (
              <Button
                label={'Remove Appointment'}
                handleClick={handleRemoveAppointment}
              />
            )}
            {feedback && <p>{feedback}</p>}
          </Modal>
        )}
      </article>
    </PayPalScriptProvider>
  );
};
export default AppointmentManagement;
