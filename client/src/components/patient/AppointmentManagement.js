import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import Calendar from "../calendar/Calendar";
import Modal from "../common/Modal";
import Button from "../common/Button";
import {
  fetchAppointments,
  addAppointment,
  initiatePayPalPayment,
  initiatePayPalRefund,
  updateAppointment,
  deleteAppointment,
  fetchSpecialistsForTreatment,
} from "../../redux/reducers/AppointmentsSlice";
import { fetchShiftsForSpecialist } from "../../redux/reducers/eventsSlice";
import { fetchTreatments as fetchTreatmentsAPI } from "../../redux/reducers/treatmentSlice";
import PayPalPayment from "../payPalPayment/PayPalPayment";
import TreatmentSelector from "../treatments/TreatmentSelector";
import SpecialistSelector from "./SpecialistSelector";
import TimeInput from "../common/TimeInput";
import {
  addMinutesToDate,
  formatToHHMMSS,
  extractAvailableDates,
  extractAvailableTimes,
} from "../../utils/dateTimeUtils";

const AppointmentManagement = () => {
  const dispatch = useDispatch();
  const { ID: patientID } = useSelector((state) => state.user.userInfo);
  const treatments = useSelector((state) => state.treatments.treatments);
  const appointments = useSelector((state) => state.appointments.appointments);
  const loading = useSelector((state) => state.appointments.loading);

  const [feedback, setFeedback] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableSpecialists, setAvailableSpecialists] = useState([]);
  const [treatmentDetails, setTreatmentDetails] = useState({});
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [appointmentDetails, setAppointmentDetails] = useState({
    PatientID: patientID,
    MedicalSpecialistID: "",
    TreatmentID: "",
    StartTime: "",
    EndTime: "",
    Date: "",
    isPayedFor: false,
  });
  const [specialistShifts, setSpecialistShifts] = useState([]);

  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());

  useEffect(() => {
    patientID && dispatch(fetchAppointments(patientID));
    dispatch(fetchTreatmentsAPI());
  }, [dispatch, patientID]);

  useEffect(() => {
    treatmentDetails.TreatmentName &&
      dispatch(fetchSpecialistsForTreatment(treatmentDetails.TreatmentName));
  }, [dispatch, treatmentDetails.TreatmentName]);

  const toggleModal = useCallback((open) => {
    setFeedback("");
    setIsModalOpen(open);
  }, []);

  const handleTreatmentSelect = (selectedTreatment) => {
    if (!selectedTreatment) {
      setFeedback("Please select a treatment.");
      return;
    }

    const [hours, minutes] = selectedTreatment.Duration.split(":").map(Number);
    const startTime = new Date(
      `${appointmentDetails.Date}T${appointmentDetails.StartTime}`
    );
    const endTime = addMinutesToDate(startTime, hours * 60 + minutes);
    const formattedEndTime = formatToHHMMSS(endTime);

    setAppointmentDetails((prev) => ({
      ...prev,
      TreatmentID: selectedTreatment.TreatmentID,
      EndTime: formattedEndTime,
    }));
    setTreatmentDetails(selectedTreatment);
  };

  const handleSpecialistSelect = async (specialist) => {
    if (!specialist) {
      console.error("No specialist selected");
      setFeedback("No Specialist selected, please select a special");
      return;
    }
    setAppointmentDetails((prev) => ({
      ...prev,
      MedicalSpecialistID: specialist.ID,
    }));

    setSelectedSpecialist(specialist);
    console.log(`Selected Specialist in appointment management:`, specialist);
    console.log(
      `Selected Specialist in appointmentDetails specialist ID:`,
      appointmentDetails.MedicalSpecialistID
    ); // TODO: This is the specialist properties which are passed from the specialist selector: Selected Specialist in appointment management: {ID: 123456788, FirstName: 'Lilian', LastName: 'Shefer', Specialization: 'Family Doctor', ShiftDate: '2024-11-07T22:00:00.000Z', …} for some reason when we click the date 8/11 we get 7/11
    const shifts = await dispatch(
      fetchShiftsForSpecialist(specialist.ID)
    ).unwrap();
    setAvailableDates(extractAvailableDates(shifts));
    setAvailableTimes(extractAvailableTimes(shifts, appointmentDetails.Date));
    console.log("Selected date-time:", selectedDateTime);
  };

  const handleTimeSelect = (selectedTime) => {
    if (!(selectedTime instanceof Date && !isNaN(selectedTime))) {
      console.error("Invalid selectedTime:", selectedTime);
      return;
    }
    const [hours, minutes] = treatmentDetails.Duration.split(":").map(Number);
    const endTime = addMinutesToDate(selectedTime, hours * 60 + minutes);
    const formattedEndTime = formatToHHMMSS(endTime);

    setSelectedDateTime(selectedTime);
    console.log(`selectedTime: ${selectedTime}`);

    setAppointmentDetails((prev) => ({
      ...prev,
      StartTime: format(selectedTime, "HH:mm"),
      EndTime: formattedEndTime,
    }));
  };

  const handleEventClick = (clickInfo) => {
    const { event } = clickInfo;
    if (!event) return;

    const startLocal = new Date(event.startStr);
    const endLocal = new Date(event.endStr);

    const formattedDate = format(startLocal, "yyyy-MM-dd");
    const formattedStartTime = format(startLocal, "HH:mm");
    const formattedEndTime = format(endLocal, "HH:mm");

    const extendedProps = event.extendedProps || {};

    setAppointmentDetails({
      MedicalSpecialistID: extendedProps.MedicalSpecialistID || "",
      TreatmentID: extendedProps.TreatmentID || "",
      StartTime: formattedStartTime,
      EndTime: formattedEndTime,
      Date: formattedDate,
      isPayedFor: extendedProps.isPayedFor || false,
      PatientID: patientID,
    });

    const treatment = treatments.find(
      (t) => t.TreatmentID === extendedProps.TreatmentID
    );

    if (treatment) {
      setTreatmentDetails(treatment);
    }

    toggleModal(true);
  };

  const handleDateSelect = (selectInfo) => {
    const startDate = new Date(selectInfo.startStr);
    const endDate = new Date(selectInfo.endStr);

    const formattedDate = format(startDate, "yyyy-MM-dd");
    const formattedStartTime = format(startDate, "HH:mm");
    const formattedEndTime = format(endDate, "HH:mm");

    setAppointmentDetails((prev) => ({
      ...prev,
      StartTime: formattedStartTime,
      Date: formattedDate,
      EndTime: formattedEndTime,
      isPayedFor: false,
      PatientID: patientID,
    }));
    setSelectedDateTime(startDate);
    setTreatmentDetails({
      TreatmentID: "",
      TreatmentName: "",
      Duration: 0,
      Price: null,
      TreatmentType: "",
    });

    toggleModal(true);
  };

  const handleModalClose = useCallback(() => {
    toggleModal(false);
  }, [toggleModal]);

  const dateValidation = (wrongDateFeedback) => {
    const appointmentDate = new Date(
      `${appointmentDetails.Date}T${appointmentDetails.StartTime}`
    );
    const now = new Date();

    if (appointmentDate - now < 24 * 60 * 60 * 1000) {
      setFeedback(wrongDateFeedback);
      return false;
    }
    return true;
  };

  const handleModalSubmit = async (event) => {
    event.preventDefault();

    if (
      !dateValidation("Cannot modify an appointment less than 1 day before.")
    ) {
      return;
    }

    if (!appointmentDetails.isPayedFor) {
      // Initiate PayPal payment if appointment not paid yet
      const result = await dispatch(initiatePayPalPayment(appointmentDetails));
      if (result.payload && result.payload.approvalUrl) {
        window.location.href = result.payload.approvalUrl; // Redirect to PayPal for approval
        return;
      } else {
        setFeedback("Error initiating payment. Please try again.");
        return;
      }
    }

    // If already paid, proceed with saving or updating appointment
    try {
      if (appointmentDetails && appointmentDetails.AppointmentID) {
        const updatedAppointment = await dispatch(
          updateAppointment({
            AppointmentID: appointmentDetails.AppointmentID,
            appointmentDetails: appointmentDetails,
          })
        ).unwrap();
        setFeedback(updatedAppointment.message);
      } else {
        const newAppointment = await dispatch(
          addAppointment(appointmentDetails)
        ).unwrap();
        setFeedback(newAppointment.message);
      }
      dispatch(fetchAppointments(patientID));
      setTimeout(() => {
        handleModalClose();
      }, 2000);
    } catch (error) {
      setFeedback("Error updating appointment: " + error.message);
    }
  };

  const handleRemoveAppointment = useCallback(
    async (event) => {
      event.preventDefault();

      if (
        !dateValidation("Cannot delete an appointment less than 1 day before.")
      ) {
        return;
      }

      if (appointmentDetails.isPayedFor) {
        const refundResult = await dispatch(initiatePayPalRefund(appointmentDetails.AppointmentID));
        if (refundResult.error) {
          setFeedback("Error processing refund. Please try again.");
          return;
        }
        setFeedback("Refund processed successfully!");
      }

      try {
        const appointmentDeleted = await dispatch(
          deleteAppointment(appointmentDetails.AppointmentID)
        ).unwrap();
        dispatch(fetchAppointments(patientID));
        setFeedback(appointmentDeleted.message);
        setTimeout(() => {
          handleModalClose();
        }, 1000);
      } catch (error) {
        setFeedback("Error deleting appointment: " + error.message);
      }
    },
    [appointmentDetails, dispatch, patientID, handleModalClose]
  );

  const handlePaymentSuccess = (captureId) => {
    setFeedback("Payment successful!");
    setAppointmentDetails((prev) => ({
      ...prev,
      isPayedFor: true,
      AppointmentID: captureId,
    }));
    setPaymentInProgress(false);
  };

  const handlePaymentError = (error) => {
    setFeedback("Payment failed. Please try again.");
    setPaymentInProgress(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <article>
      <Calendar
        handleDateSelect={handleDateSelect}
        handleEventClick={handleEventClick}
      />
      {isModalOpen && (
        <Modal open={isModalOpen} onClose={handleModalClose}>
          <h2>
            {appointmentDetails.AppointmentID
              ? "Edit Appointment"
              : "Create Appointment"}
          </h2>

          <section>
            <TreatmentSelector
              treatments={treatments}
              onTreatmentSelect={handleTreatmentSelect}
            />
            {treatmentDetails.TreatmentName && (
              <div>
                <p>
                  <strong>Treatment Name:</strong>{" "}
                  {treatmentDetails.TreatmentName}
                </p>
                <p>
                  <strong>Duration:</strong> {treatmentDetails.Duration} minutes
                </p>
                <p>
                  <strong>Price:</strong> {treatmentDetails.Price} ILS
                </p>
              </div>
            )}
          </section>

          {treatmentDetails.TreatmentName && (
            <section>
              <SpecialistSelector
                treatmentDetails={treatmentDetails}
                onSpecialistSelect={handleSpecialistSelect}
              />
            </section>
          )}

          {selectedSpecialist && treatmentDetails && (
            <section>
              <TimeInput
                selected={selectedDateTime}
                onChange={handleTimeSelect}
                availableDates={availableDates}
                availableTimes={availableTimes}
              />
            </section>
          )}
          {treatmentDetails && appointmentDetails.MedicalSpecialistID && treatmentDetails.Price && (
            <PayPalPayment
              amount={treatmentDetails.Price}
              description={`Appointment for ${treatmentDetails.TreatmentName} with Dr. ${selectedSpecialist.FirstName} ${selectedSpecialist.LastName}`}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentError}
            />
          )}
          {!paymentInProgress && (
            <>
              <Button
                label={"Save"}
                type={"submit"}
                handleClick={handleModalSubmit}
              />
              <Button label={"Cancel"} handleClick={handleModalClose} />
            </>
          )}
          {appointmentDetails.AppointmentID && (
            <Button
              label={"Remove Appointment"}
              handleClick={handleRemoveAppointment}
            />
          )}
          {feedback && <p>{feedback}</p>}
        </Modal>
      )}
    </article>
  );
};

export default AppointmentManagement;
