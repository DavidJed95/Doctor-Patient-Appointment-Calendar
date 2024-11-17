import { useMemo, useRef } from "react";
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

  const processedEvents = useMemo(
    () =>
      events.map((event) => {
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
          className: event.isAvailable ? "available" : "unavailable",
        };
      }),
    [events, timeZone]
  );

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

  const displayEvents = useMemo(
    () =>
      user.UserType === "Medical Specialist"
        ? processedEvents
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
