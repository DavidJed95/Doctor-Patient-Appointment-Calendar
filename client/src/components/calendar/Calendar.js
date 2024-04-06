import React, { useRef } from 'react';

import { useSelector } from 'react-redux';

import Fullcalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { utcToZonedTime, format } from 'date-fns-tz';

const Calendar = ({ handleDateSelect, handleEventClick }) => {
  const calendarRef = useRef(null);
  const events = useSelector(state => state.events.SpecialistAvailability);

  const timeZone = 'Asia/Jerusalem';

  console.log('Events in Calendar:', events, 'events Type: ', typeof events); // Debugging log
  // Inside your useEffect or wherever you fetch the events

  console.log(typeof events, Array.isArray(events), events);

 // Simplified mapping, now converting to and assuming local time zone
const processedEvents = events.map(event => {
  if (!event.ShiftDate || !event.StartTime || !event.EndTime) return null;

  const shiftDateTime = utcToZonedTime(event.ShiftDate, timeZone);
  const startDate = format(shiftDateTime, 'yyyy-MM-dd', { timeZone });
  const startDateTime = `${startDate}T${event.StartTime}`;
  const endDateTime = `${startDate}T${event.EndTime}`;

  return {
    id: event.SpecialistHourID,
    title: event.Type,
    start: startDateTime,
    end: endDateTime,
  };
});

  console.log(`processedEvents of the Calendar.js: ${processedEvents}`);

  return (
    <Fullcalendar
      timeZone={timeZone}
      ref={calendarRef}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView='timeGridWeek'
      nowIndicator
      headerToolbar={{
        start: 'today prev,next',
        center: 'title',
        end: 'timeGridDay,timeGridWeek,dayGridMonth',
      }}
      selectable={true}
      editable={true}
      events={processedEvents}
      select={handleDateSelect}
      eventClick={handleEventClick}
      height='90vh'
      slotLabelFormat={{
        hour: '2-digit', // 2-digit hour representation
        minute: '2-digit', // 2-digit minute representation
        hour12: false, // Use 24-hour format
      }}
      dayHeaderFormat={{
        weekday: 'long', // Full name of the day of the week
        day: '2-digit', // 2-digit day of the month
        month: 'numeric', // Numeric month (without leading zeros)
        omitCommas: true, // Omit commas in the format
      }}
      locale='en-GB'
    />
  );
};

export default Calendar;
