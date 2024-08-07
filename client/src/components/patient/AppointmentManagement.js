import React, { useState, useEffect, useCallback } from "react";
import { format, addMinutes } from "date-fns";
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
import TreatmentSelector from "../treatments/TreatmentSelector";
import { fetchTreatmentAPI } from "../treatments/treatmentsAPI";
import { fetchAvailableSpecialists } from "./appointmentsAPI";
import { MY_PAYPAL_CLIENT_ID } from "../../config";

/**
 * Utility function to convert HH:MM:SS to total minutes
 * @param {*} duration - to convert to minutes
 * @returns the converted String representation to minutes
 */
const durationToMinutes = (duration) => {
  const [hours, minutes, seconds] = duration.split(":").map(Number);
  return hours * 60 + minutes + Math.floor(seconds / 60);
};

/**
 * Utility function to add minutes to a date
 * @param {*} date - the date to add time to
 * @param {*} minutes - the minutes that are added to the date
 * @returns a new date time with minutes addition
 */
const addMinutesToDate = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
};

/**
 * Utility function to format a date to HH:MM:SS
 * @param {*} date - the date to format
 * @returns the formatted String representation to HH:MM:SS
 */
const formatToHHMMSS = (date) => {
  return date.toTimeString().split(' ')[0];
};

const AppointmentManagement = () => {
  const dispatch = useDispatch();
  const { ID: patientID } = useSelector((state) => state.user.userInfo);
  const appointments = useSelector((state) => state.appointments.appointments);
  const loading = useSelector((state) => state.appointments.loading);

  const [feedback, setFeedback] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const [treatments, setTreatments] = useState([]);
  const [availableSpecialists, setAvailableSpecialists] = useState([]);

  const [treatmentDetails, setTreatmentDetails] = useState({
    TreatmentID: "",
    TreatmentName: "",
    Duration: "",
    Price: "",
    TreatmentType: "",
  });

  const initialOptions = {
    "client-id": MY_PAYPAL_CLIENT_ID,
    currency: "ILS",
    intent: "CAPTURE",
  };

  useEffect(() => {
    dispatch(fetchAppointments(patientID));
  }, [dispatch, patientID]);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const data = await fetchTreatmentAPI();
        setTreatments(data);
      } catch (error) {
        setFeedback(error.message);
      }
    };

    const fetchSpecialists = async () => {
      try {
        const data = await fetchAvailableSpecialists();
        setAvailableSpecialists(data.specialists);
      } catch (error) {
        setFeedback(error.message);
      }
    };

    fetchTreatments();
    fetchSpecialists();
  }, []);

  const toggleModal = useCallback((open) => {
    setFeedback("");
    setIsModalOpen(open);
  }, []);

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

  const resetSelectedAppointment = useCallback(() => {
    setSelectedAppointment(null);
  }, []);

  const handleModalClose = useCallback(() => {
    toggleModal(false);
    setSelectedAppointment(null);
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

    const [hours, minutes, seconds] = selectedTreatment.Duration.split(":").map(Number);

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

  const handleSpecialistSelect = (event) => {
    const specialistId = event.target.value;
    setAppointmentDetails((prev) => ({
      ...prev,
      MedicalSpecialistID: specialistId,
    }));
  };

  //: TODO: 1) handle calling the api's for the search field
  //: TODO: 2) we will need to Do a JOIN on medical specialists table, Users(information: first,last names. Id's), treatments (Treatments.TreatmentName = MedicalSpecialist.specialization)
  const handleSearch = (query) => {
    console.log(`Search query: ${query}`);
  };

  const searchBarsStyle = {
    display: "flex",
    justifyContent: "space-around",
  };

  // Ensure unique keys and proper filtering
  // const availableSpecialistsOptions = [...new Set(availableSpecialists
  //   .filter(
  //     (specialist) =>
  //       specialist.Specialization === treatmentDetails.TreatmentName
  //   )
  //   .map((specialist) => (
  //     <option key={specialist.ID} value={specialist.ID}>
  //       Dr. {specialist.FirstName} {specialist.LastName}
  //     </option>
  //   )))];

  const availableSpecialistsOptions = availableSpecialists
  .filter((specialist) => specialist.Specialization === treatmentDetails.TreatmentName)
  .map((specialist, index) => (
    <option key={`${specialist.ID}-${index}`} value={specialist.ID}>
      Dr. {specialist.FirstName} {specialist.LastName}
    </option>
  ));
  if (loading) return <div>Loading...</div>;

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
              <label>
                Date:
                <input
                  type="date"
                  value={appointmentDetails.Date}
                  onChange={(e) =>
                    setAppointmentDetails((prev) => ({
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
                  type="time"
                  value={appointmentDetails.StartTime}
                  onChange={(e) =>
                    setAppointmentDetails((prev) => ({
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
                  type="time"
                  value={appointmentDetails.EndTime}
                  onChange={(e) =>
                    setAppointmentDetails((prev) => ({
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
                <TreatmentSelector
                  treatments={treatments}
                  onTreatmentSelect={handleTreatmentSelect}
                />
              </label>
              {treatmentDetails.TreatmentName && (
                <div>
                  <p>
                    <strong>Price:</strong> {treatmentDetails.Price} ILS
                  </p>
                  <p>
                    <strong>Duration:</strong> {treatmentDetails.Duration}{" "}
                    minutes
                  </p>
                  <p>
                    <strong>Treatment Name:</strong>{" "}
                    {treatmentDetails.TreatmentName}
                  </p>
                </div>
              )}
            </section>
            {treatmentDetails.TreatmentName && (
              <section>
                <label>
                  Specialist:
                  <select onChange={handleSpecialistSelect} defaultValue="">
                    <option value="" disabled>
                      Select a specialist
                    </option>
                    {availableSpecialistsOptions}
                  </select>
                </label>
              </section>
            )}
            {treatmentDetails.TreatmentName &&
              appointmentDetails.MedicalSpecialistID && (
                <PayPalPayment
                  amount={treatmentDetails.Price}
                  description={`Appointment for ${treatmentDetails.TreatmentName}`}
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
// {treatmentDetails.TreatmentName &&
  //               appointmentDetails.MedicalSpecialistID && (
  //                 <PayPalPayment
  //                   amount={treatmentDetails.Price}
  //                   description={`Appointment for ${treatmentDetails.TreatmentName}`}
  //                   onSuccess={handlePaymentSuccess}
  //                   onFailure={handlePaymentError}
  //                 />
  //               )}
  //             {!paymentInProgress && (
  //               <>
  //                 <Button
  //                   label={"Save"}
  //                   type={"submit"}
  //                   handleClick={handleModalSubmit}
  //                 />
  //                 <Button label={"Cancel"} handleClick={handleModalClose} />
  //               </>
  //             )}
  //             {selectedAppointment?.AppointmentID && (
  //               <Button
  //                 label={"Remove Appointment"}
  //                 handleClick={handleRemoveAppointment}
  //               />
  //             )}
  //             {feedback && <p>{feedback}</p>}
  //           </Modal>
          // )}