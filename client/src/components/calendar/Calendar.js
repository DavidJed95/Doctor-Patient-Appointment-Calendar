import React, { useRef } from "react";

import { useSelector } from "react-redux";

import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { utcToZonedTime, format } from "date-fns-tz";

const Calendar = ({ handleDateSelect, handleEventClick }) => {
  const calendarRef = useRef(null);
  const events = useSelector((state) => state.events.SpecialistAvailability);
  const appointments = useSelector((state) => state.appointments.appointments);
  const user = useSelector((state) => state.user.userInfo);
  const timeZone = "Asia/Jerusalem";

  // Simplified mapping, now converting to and assuming local time zone
  const processedEvents = events
    .map((event) => {
      if (!event || !event.ShiftDate || !event.StartTime || !event.EndTime)
        return null;

      const shiftDateTime = utcToZonedTime(event.ShiftDate, timeZone);

      if (isNaN(shiftDateTime)) {
        console.error("Invalid shift date time: ", event.ShiftDate);
        return null; // Skip this event if the date is invalid
      }

      const startDate = format(shiftDateTime, "yyyy-MM-dd", { timeZone });
      const startDateTime = `${startDate}T${event.StartTime}`;
      const endDateTime = `${startDate}T${event.EndTime}`;

      if (isNaN(new Date(startDateTime)) || isNaN(new Date(endDateTime))) {
        console.error(
          "Invalid start or end date time",
          startDateTime,
          endDateTime
        );
        return null; // Skip this event if start or end times are invalid
      }

      return {
        id: event.SpecialistHourID,
        title: event.Type,
        start: startDateTime,
        end: endDateTime,
      };
    })
    .filter((event) => event !== null);

  const processedAppointments = appointments
    .map((appointment) => ({
      id: appointment.id,
      title: appointment.TreatmentName,
      start: `${appointment.Date}T${appointment.StartTime}`,
      end: `${appointment.Date}T${appointment.EndingTime}`,
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
      nowIndicator
      headerToolbar={{
        start: "today prev,next",
        center: "title",
        end: "timeGridDay,timeGridWeek,dayGridMonth",
      }}
      selectable={true}
      editable={true}
      events={displayEvents}
      select={handleDateSelect}
      eventClick={handleEventClick}
      height="59dvh"
      slotLabelFormat={{
        hour: "2-digit", // 2-digit hour representation
        minute: "2-digit", // 2-digit minute representation
        hour12: false, // Use 24-hour format
      }}
      dayHeaderFormat={{
        weekday: "long", // Full name of the day of the week
        day: "2-digit", // 2-digit day of the month
        month: "numeric", // Numeric month (without leading zeros)
        omitCommas: true, // Omit commas in the format
      }}
      locale="en-IL"
    />
  );
};

export default Calendar;
