import { useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { toZonedTime, format } from "date-fns-tz";
// import { getDay } from 'date-fns';
import "./Calendar.module.css";

const Calendar = ({ handleDateSelect, handleEventClick }) => {
  const calendarRef = useRef(null);
  const events = useSelector((state) => state.events.SpecialistAvailability);
  const appointments = useSelector((state) => state.appointments.appointments);
  const user = useSelector((state) => state.user.userInfo);
  const timeZone = "Asia/Jerusalem";

  /**
   * Displaying all the Shifts of the Specialist
   */
  const processedEvents = useMemo(
    () =>
      events
        .map((event) => {
          // console.log("Event data:", event);
          // Check if ShiftDate, StartTime, and EndTime are valid
          if (!event.ShiftDate || !event.StartTime || !event.EndTime) {
            console.error("Invalid event date or time:", event);
            return null; // Skip this event if any of the values are invalid
          }
          // // console.log(`ShiftDate: ${ event.ShiftDate}`)
          const formattedDate = event.ShiftDate.split("T")[0];
          // // console.log(`ShiftDateTime: ${ shiftDateTime}`)
          // const startDate = format(shiftDateTime, "yyyy-MM-dd", { timeZone });
          // const startDateTime = `${startDate}T${event.StartTime}`;
          // const endDateTime = `${startDate}T${event.EndTime}`;
          // // console.log(`startDate: ${startDate}, startDateTime`)
          return {
            // id: event.SpecialistHourID,
            // title: event.Type,
            // start: startDateTime,
            // end: endDateTime,
            // extendedProps: { ...event },
            // className: event.isAvailable ? "available" : "unavailable",
            id: event.SpecialistHourID,
            title: event.Type,
            start: `${formattedDate}T${event.StartTime}`,
            end: `${formattedDate}T${event.EndTime}`,
            extendedProps: { ...event },
            // className
          };
        })
        .filter(Boolean),
    [events, timeZone]
  );

  /**
   * Displaying all the appointments of the Patient
   */
  const processedAppointments = useMemo(
    () =>
      appointments
        .map((appointment) => {
          if (
            !appointment.Date ||
            !appointment.StartTime ||
            !appointment.EndTime
          ) {
            console.error("Invalid appointment date or time:", appointment);
            return null; // Skip this appointment if any of the values are invalid
          }
          // console.log(`AppointmentID: ${appointment.AppointmentID} in Calendar.js`);
          const formattedDate = appointment.Date.split("T")[0];
          console.log(`formattedDate: ${formattedDate}`);
          return {
            id: appointment.AppointmentID,
            title: appointment.TreatmentName,
            start: `${formattedDate}T${appointment.StartTime}`,
            end: `${formattedDate}T${appointment.EndTime}`,
            textColor: "black",
            backgroundColor: "green",
            borderColor: "yellow",

            extendedProps: { ...appointment },
            //   className: appointment.isPayedFor
            //   ? "fc-event-available"
            //   : "fc-event-unavailable", // Color coding for booked appointments
            // backgroundColor: appointment.isPayedFor ? "#3788d8" : "#ff0000", // Example colors
            // borderColor: appointment.isPayedFor ? "#3788d8" : "#ff0000",
            // textColor: "#ffffff", // Text color for better readability
          };
        })
        .filter((appointment) => appointment !== null),
    // .filter(Boolean),
    [appointments]
  );

  const displayEvents = useMemo(
    () =>
      user.UserType === "Medical Specialist"
        ? [processedEvents, processedAppointments] // Show both shifts and appointments
        : processedAppointments,
    [user.UserType, processedEvents, processedAppointments]
  );

  return (
    <div
      style={{
        border: "cyan solid .2rem",
        borderStyle: "ridge",
        marginTop: "2rem",
      }}
    >
      <Fullcalendar
        timeZone={timeZone}
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        validRange={(nowDate) => {
          return { start: nowDate };
        }}
        slotMinTime="08:00"
        slotMaxTime="17:00"
        nowIndicator
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "timeGridDay,timeGridWeek,dayGridMonth",
        }}
        selectable={true}
        editable={true}
        allDaySlot={false}
        events={displayEvents}
        select={handleDateSelect}
        eventClick={handleEventClick}
        contentHeight={"auto"}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        dayHeaderFormat={{
          weekday: "long",
          day: "2-digit",
          month: "numeric",
          omitCommas: true,
        }}
        locale="en-IL"
        selectMirror
      />
    </div>
  );
};

export default Calendar;
