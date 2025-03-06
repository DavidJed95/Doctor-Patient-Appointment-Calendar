import React, { useState, useEffect, useCallback } from "react";
import { BASE_URL } from "../../config";
import { format } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import usePageTitle from "../../hooks/usePageTitle";
import Calendar from "../calendar/Calendar";
import Modal from "../common/Modal";
import Button from "../common/Button";
import {
  // createOrder,
  // capturePaymentAndSaveAppointment,
  cancelAppointment,
  updateAppointment,
  fetchAppointments,
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
    amount: 0,
    description: ``,
  });

  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(() => null);
  
  usePageTitle("Appointments Calendar");

  useEffect(() => {
    if (patientID) {
      dispatch(fetchAppointments(patientID));
    }
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
      amount: selectedTreatment.Price,
      description: `Appointment for ${selectedTreatment.TreatmentName}`,
    }));
    console.log(
      `Appointment Details in handleTreatmentSelect When Selecting Date in AppointmentManagement.js: AppointmentID ${appointmentDetails.AppointmentID}, Date: ${appointmentDetails.Date}, StartTime: ${appointmentDetails.StartTime}, EndTime: ${appointmentDetails.EndTime}`
    );
    setTreatmentDetails(selectedTreatment);
  };

  const handleSpecialistSelect = async (specialist) => {
    if (!specialist) {
      console.error("No specialist selected");
      setFeedback("Please select a special");
      return;
    }
    setSelectedSpecialist(specialist);
    setAppointmentDetails((prev) => ({
      ...prev,
      MedicalSpecialistID: specialist.ID,
    }));

    const shifts = await dispatch(
      fetchShiftsForSpecialist(specialist.ID)
    ).unwrap();
    setAvailableDates(extractAvailableDates(shifts));
    setAvailableTimes(extractAvailableTimes(shifts, appointmentDetails.Date));
  };

  const handleTimeSelect = (selectedTime) => {
    if (!(selectedTime instanceof Date && !isNaN(selectedTime))) {
      return;
    }
    const [hours, minutes] = treatmentDetails.Duration.split(":").map(Number);
    const endTime = addMinutesToDate(selectedTime, hours * 60 + minutes);
    const formattedEndTime = formatToHHMMSS(endTime);

    setSelectedDateTime(selectedTime);

    setAppointmentDetails((prev) => ({
      ...prev,
      StartTime: format(selectedTime, "HH:mm"),
      EndTime: formattedEndTime,
    }));
    console.log(
      `AppointmentDetails in handleTimeSelect: StartTime ${
        appointmentDetails.StartTime
      } ${typeof appointmentDetails.StartTime}, EndTime ${
        appointmentDetails.EndTime
      } ${typeof appointmentDetails.EndTime}, Date ${
        appointmentDetails.Date
      } ${typeof appointmentDetails.Date}`
    );
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
      AppointmentID: event.id,
      MedicalSpecialistID: extendedProps.MedicalSpecialistID || "",
      TreatmentID: extendedProps.TreatmentID || "",
      StartTime: formattedStartTime,
      EndTime: formattedEndTime,
      Date: formattedDate,
      isPayedFor: extendedProps.isPayedFor || false,
      PatientID: patientID,
    });

    setSelectedAppointment({
      id: event.id,
      ...extendedProps
    })

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
    console.log(
      `Appointment Details in handleDateSelect When Selecting Date in AppointmentManagement.js: AppointmentID ${appointmentDetails.AppointmentID}, Date: ${appointmentDetails.Date}, StartTime: ${appointmentDetails.StartTime}, EndTime: ${appointmentDetails.EndTime}`
    );
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
  // TODO: handleAppointmentUpdate
  const handleModalSubmit = async (event) => {
    event.preventDefault();

    if (
      !dateValidation(
        "Cannot modify an appointment less than 1 day before meeting."
      )
    ) {
      return;
    }
    if (appointmentDetails.AppointmentID) {
      // Update existing appointment
      try {
        const updatedAppointment = await dispatch(
          updateAppointment({
            appointmentID: appointmentDetails.AppointmentID,
            appointmentDetails,
          })
        ).unwrap();
        setFeedback(updatedAppointment.message);
        dispatch(fetchAppointments(patientID));
      } catch (error) {
        setFeedback("Error updating appointment: " + error.message);
      }
    }

    setTimeout(() => {
      handleModalClose();
    }, 2000);
  };

  const handleRemoveAppointment = useCallback(
    async (event) => {
      event.preventDefault();

      if (
        !dateValidation("Cannot delete an appointment less than 1 day before.")
      ) {
        return;
      }

      try {
        const appointmentDeleted = await dispatch(
          cancelAppointment(appointmentDetails.AppointmentID)
        ).unwrap();
        setFeedback(appointmentDeleted.message);
        dispatch(fetchAppointments(patientID));
        setTimeout(() => {
          handleModalClose();
        }, 2000);
        if (
          appointmentDeleted.error ||
          appointmentDeleted.message === "failure"
        ) {
          setFeedback(
            "Error processing refund. Please try again.",
            appointmentDeleted.message
          );
          return;
        }
      } catch (error) {
        setFeedback("Error deleting appointment: " + error.message);
      }
    },
    [appointmentDetails, dispatch, patientID, handleModalClose]
  );

  const handlePaymentSuccess = async () => {
    setFeedback("Appointment saved successfully.");
    dispatch(fetchAppointments(patientID));
    setTimeout(() => {
      handleModalClose();
    }, 2000);
  };

  const handlePaymentError = (error) => {
    setFeedback("Payment failed. Please try again.");
    console.error(error);
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
          {treatmentDetails &&
            appointmentDetails.MedicalSpecialistID &&
            treatmentDetails.Price && (
              <PayPalPayment
                amount={treatmentDetails.Price}
                // description={appointmentDetails.description}
                appointmentDetails={appointmentDetails}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            )}
          {!paymentInProgress && (
            <>
              {/* <Button
                label={"Save"}
                type={"submit"}
                handleClick={handleCreateOrder}
              /> */}
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
