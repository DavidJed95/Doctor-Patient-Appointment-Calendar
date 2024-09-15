import React, { useRef } from "react";
import { useSelector } from "react-redux";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { utcToZonedTime, format } from "date-fns-tz";
// import { getDay } from 'date-fns';
import "./Calendar.module.css";

const Calendar = ({ handleDateSelect, handleEventClick }) => {
  const calendarRef = useRef(null);
  const events = useSelector((state) => state.events.SpecialistAvailability);
  const appointments = useSelector((state) => state.appointments.appointments);
  const user = useSelector((state) => state.user.userInfo);
  const timeZone = "Asia/Jerusalem";

  const processedEvents = events
    .map((event) => {
      if (!event || !event.ShiftDate || !event.StartTime || !event.EndTime)
        return null;

      const shiftDateTime = utcToZonedTime(event.ShiftDate, timeZone);
      const startDate = format(shiftDateTime, "yyyy-MM-dd", { timeZone });
      const startDateTime = `${startDate}T${event.StartTime}`;
      const endDateTime = `${startDate}T${event.EndTime}`;

      return {
        id: event.SpecialistHourID,
        title: event.Type,
        start: startDateTime,
        end: endDateTime,
        extendedProps: { ...event },
        className: event.isAvailable ? "available" : "unavailable", // Color coding for availability
      };
    })
    .filter((event) => event !== null);

  const processedAppointments = appointments
    .map((appointment) => ({
      id: appointment.id,
      title: appointment.TreatmentName,
      start: `${appointment.Date}T${appointment.StartTime}`,
      end: `${appointment.Date}T${appointment.EndTime}`,
      extendedProps: { ...appointment },
      className: "appointment", // Color coding for booked appointments
    }))
    .filter((appointment) => appointment !== null);

  const displayEvents =
    user.UserType === "Medical Specialist"
      ? processedEvents
      : processedAppointments;

  return (
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
      height="90dvh"
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
  );
};

export default Calendar;
