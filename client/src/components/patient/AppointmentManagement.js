import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} from "../../redux/reducers/AppointmentsSlice";
import { fetchTreatments } from "../../redux/reducers/treatmentSlice";
// import { fetchTreatments } from "../treatments/treatmentsAPI";
import { fetchShiftsForSpecialist } from "../../redux/reducers/eventsSlice";
import { format } from "date-fns";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Calendar from "../calendar/Calendar";
import Modal from "../common/Modal";
import Button from "../common/Button";
import TreatmentSelector from "../treatments/TreatmentSelector";
import SpecialistSelector from "./SpecialistSelector";
import TimeInput from "../common/TimeInput";
import PayPalPayment from "../payPalPayment/PayPalPayment";
import { fetchAvailableSpecialists } from "./appointmentsAPI";
import usePageTitle from "../../hooks/usePageTitle";
import {
  addMinutesToDate,
  durationToMinutes,
  formatToHHMMSS,
  exatctAvailableDates,
  extractAvailableTimes,
} from "../../utils/dateTimeUtils";
import { BASE_URL, MY_PAYPAL_CLIENT_ID } from "../../config";
import SearchBar from "./SearchBar";

/**
 * AppointmentManagement component for managing patient appointments.
 * Includes appointment creation, update, deletion, and PayPal payment handling.
 * @returns {JSX.Element} AppointmentManagement component.
 */
const AppointmentManagement = () => {
  const dispatch = useDispatch();

  const today = new Date();
  const minDate = new Date(today.setDate(today.getDate())); // Disable today and past dates
  const minTime = new Date().setHours(8, 0, 0, 0); // Start times from 08:00
  const maxStartTime = new Date().setHours(16, 30, 0, 0); // Start times up to 16:30
  const maxEndTime = new Date().setHours(17, 0, 0, 0); // End times up to 17:00

  const { ID: patientID } = useSelector((state) => state.user.userInfo);
  const appointments = useSelector((state) => state.appointments.appointments);
  const treatments = useSelector((state) => state.treatments.treatments);
  console.log("Treatments in AppointmentManagement:", treatments); // Add this log
  // const [treatments, setTreatments] = useState([])
  const loading = useSelector((state) => state.appointments.loading);

  const [feedback, setFeedback] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [specialistShifts, setSpecialistShifts] = useState([]); // Store shifts for the selected specialist
  const [availableDates, setAvailableDates] = useState([]); // Store available dates
  const [availableTimes, setAvailableTimes] = useState([]); // Store available times for the selected date
  const [appointmentDetails, setAppointmentDetails] = useState({
    PatientID: patientID,
    MedicalSpecialistID: "",
    TreatmentID: "",
    StartTime: "",
    EndTime: "",
    Date: "",
    isPayedFor: false,
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [availableSpecialists, setAvailableSpecialists] = useState([]);
  const [treatmentDetails, setTreatmentDetails] = useState({});

  // console.log(`treatments in the appointment manager: ${treatments}`);

  const initialOptions = {
    "client-id": MY_PAYPAL_CLIENT_ID,
    currency: "ILS",
    intent: "CAPTURE",
  };

  usePageTitle("Appointment Management");

  // Fetch appointments and treatments on component mount
  useEffect(() => {
    dispatch(fetchAppointments(patientID));
    dispatch(fetchTreatments());
  }, [dispatch, patientID, fetchTreatments]);
  // console.log(`specialists in the appointment manager: ${specialists}`)

  /**
   * Toggle the modal open or close.
   * @param {Boolean} open - Whether to open or close the modal.
   */
  const toggleModal = useCallback((open) => {
    setFeedback("");
    setIsModalOpen(open);
  }, []);

  /**
   * Handle event click in the calendar (edit an appointment).
   * @param {Object} clickInfo - Information about the clicked event.
   */
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

    setSelectedAppointment({
      AppointmentID: event.id,
      ...extendedProps,
    });

    const treatment = treatments.find(
      (t) => t.TreatmentID === extendedProps.TreatmentID
    );

    if (treatment) {
      setTreatmentDetails(treatment);
    }

    toggleModal(true);
  };

  /**
   * Handle date selection in the calendar (create a new appointment).
   * @param {Object} selectInfo - Information about the selected date.
   */
  const handleDateSelect = (selectInfo) => {
    const startDate = new Date(selectInfo.startStr);
    const endDate = new Date(selectInfo.endStr);

    const formattedDate = format(startDate, "yyyy-MM-dd");
    const formattedStartTime = format(startDate, "HH:mm");
    const formattedEndTime = format(endDate, "HH:mm");

    setAppointmentDetails({
      MedicalSpecialistID: "",
      TreatmentID: "",
      StartTime: formattedStartTime,
      Date: formattedDate,
      EndTime: formattedEndTime,
      isPayedFor: false,
      PatientID: patientID,
    });

    resetSelectedAppointment();
    setTreatmentDetails({
      TreatmentID: "",
      TreatmentName: "",
      Duration: 0,
      Price: 0,
      TreatmentType: "",
    });

    toggleModal(true);
  };

  /**
   * Reset the selected appointment state.
   */
  const resetSelectedAppointment = useCallback(() => {
    setSelectedAppointment(null);
  }, []);

  /**
   * Close the modal and reset appointment state.
   */
  const handleModalClose = useCallback(() => {
    toggleModal(false);
    setSelectedAppointment(null);
  }, [toggleModal]);

  /**
   * Validate if the selected date is more than 1 day away.
   * @param {String} wrongDateFeedback - Feedback message to show if validation fails.
   * @returns {Boolean} Whether the date is valid.
   */
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

  /**
   * Handle form submission to create or update an appointment.
   * @param {Object} event - The form submission event.
   */
  const handleModalSubmit = async (event) => {
    event.preventDefault();

    if (
      !dateValidation("Cannot modify an appointment less than 1 day before.")
    ) {
      return;
    }

    if (!appointmentDetails.isPayedFor) {
      setPaymentInProgress(true);
      return;
    }

    try {
      if (selectedAppointment && selectedAppointment.AppointmentID) {
        const updatedAppointment = await dispatch(
          updateAppointment({
            AppointmentID: selectedAppointment.AppointmentID,
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

      try {
        const appointmentDeleted = await dispatch(
          deleteAppointment(selectedAppointment.AppointmentID)
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
    [selectedAppointment, dispatch, patientID, handleModalClose]
  );

  const handlePaymentSuccess = (details) => {
    setFeedback("Payment successful!");
    setAppointmentDetails((prev) => ({
      ...prev,
      isPayedFor: true,
    }));
    setPaymentInProgress(false);
  };

  const handlePaymentError = (error) => {
    setFeedback("Payment failed. Please try again.");
    setPaymentInProgress(false);
  };

  const handleTreatmentSelect = (selectedTreatment) => {
    if (!selectedTreatment) {
      setTreatmentDetails({
        TreatmentID: "",
        TreatmentName: "",
        Duration: "",
        Price: "",
        TreatmentType: "",
      });
      setFeedback("Must provide a Treatment name to submit the appointment");
      return;
    }
    setFeedback("");

    const [hours, minutes, seconds] =
      selectedTreatment.Duration.split(":").map(Number);

    const startTime = new Date(
      `${appointmentDetails.Date}T${appointmentDetails.StartTime}`
    );

    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + hours);
    endTime.setMinutes(endTime.getMinutes() + minutes);
    endTime.setSeconds(endTime.getSeconds() + seconds);
    const formattedEndTime = formatToHHMMSS(endTime);

    setAppointmentDetails((prev) => ({
      ...prev,
      TreatmentID: selectedTreatment.TreatmentID,
      EndTime: formattedEndTime,
    }));
    setTreatmentDetails(selectedTreatment);
  };

  // const fetchShifts = async (specialistId) => {
  //   try {
  //     const response = await fetch(
  //       `${BASE_URL}/appointment/shifts?medicalSpecialistID=${specialistId}`
  //     );
  //     const data = await response.json;
  //     setAvailableShifts(data);
  //   } catch (error) {
  //     setFeedback("Error loading specialist shifts.");
  //   }
  // };

  const handleSpecialistSelect = async (event) => {
    const specialistId = event.target.value;
    setAppointmentDetails((prev) => ({
      ...prev,
      MedicalSpecialistID: specialistId,
    }));
    try {
      const shifts = await dispatch(
        fetchShiftsForSpecialist(appointmentDetails.MedicalSpecialistID)
      ).unwrap(); // Fetch specialist shifts
      setSpecialistShifts(shifts); // Store shifts
      // setAvailableDates(extractAvailableDates(shifts)); // Extract available dates
    } catch (error) {
      setFeedback(error.message);
    }
  };

  const handleTimeSelect = (selectedTime) => {
    setAppointmentDetails((prev) => ({
      ...prev,
      StartTime: format(selectedTime, "HH:mm"),
    }));
  };
  //: TODO: 1) handle calling the api's for the search field
  //: TODO: 2) we will need to Do a JOIN on medical specialists table, Users(information: first,last names. Id's), treatments (Treatments.TreatmentName = MedicalSpecialist.specialization)
  const handleSearch = (query) => {
    console.log(`Search query: ${query}`);
  };

  if (loading) return <div>Loading...</div>;

  const searchBarsStyle = {
    display: "flex",
    justifyContent: "space-around",
  };
  return (
    <PayPalScriptProvider options={initialOptions}>
      <article>
        <section style={searchBarsStyle}>
          <SearchBar
            onSearch={handleSearch}
            placeholder={"Medical specialists name"}
          />
          <SearchBar
            onSearch={handleSearch}
            placeholder={"Medical specialist spoken language"}
          />
          <SearchBar
            onSearch={handleSearch}
            placeholder={"Medical specialist Specialization"}
          />
        </section>
        <Calendar
          handleDateSelect={handleDateSelect}
          handleEventClick={handleEventClick}
        />
        {isModalOpen && (
          <Modal open={isModalOpen} onClose={handleModalClose}>
            <h2>
              {selectedAppointment?.AppointmentID
                ? "Edit Appointment"
                : "Create Appointment"}
            </h2>
            <section>
              <label>Date:</label>
              <TimeInput
                selected={
                  appointmentDetails.Date
                    ? new Date(appointmentDetails.Date)
                    : null
                }
                onChange={(date) =>
                  setAppointmentDetails((prev) => ({
                    ...prev,
                    Date: format(date, "yyyy-MM-dd"),
                  }))
                }
                includeDate={true}
                availableDates={availableDates}
              />
            </section>

            {availableTimes.length > 0 && (
              <section>
                <label>Start Time:</label>
                <TimeInput
                  selected={
                    appointmentDetails.StartTime
                      ? new Date(
                          `${appointmentDetails.Date}T${appointmentDetails.StartTime}`
                        )
                      : null
                  }
                  onChange={handleTimeSelect}
                  includeTime={true}
                  availableTimes={availableTimes}
                />
              </section>
            )}
            {treatments.length > 0 && (
              <section>
                <TreatmentSelector
                  treatments={treatments}
                  onTreatmentSelect={handleTreatmentSelect}
                />
              </section>
            )}

            <section>
              <SpecialistSelector
                availableSpecialists={availableSpecialists}
                treatmentDetails={treatmentDetails}
                onSpecialistSelect={handleSpecialistSelect}
              />
            </section>

            {appointmentDetails.MedicalSpecialistID && (
              <PayPalPayment
                amount={treatmentDetails.Price}
                description={`Appointment for ${treatmentDetails.TreatmentName}`}
                onSuccess={handlePaymentSuccess}
                onFailure={handlePaymentError}
              />
            )}

            {!paymentInProgress && (
              <>
                <Button label={"Save"} handleClick={handleModalSubmit} />
                <Button label={"Cancel"} handleClick={handleModalClose} />
              </>
            )}

            {selectedAppointment?.AppointmentID && (
              <Button
                label={"Remove Appointment"}
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
