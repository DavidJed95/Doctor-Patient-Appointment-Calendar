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

  /**
   * Calculates the end time of an event.
   * @param {string} startTime - The start time of the event in ISO 8601 format.
   * @param {string} endTime - The end time of the event in 'HH:mm:ss' format.
   * @returns {string} - The end time in ISO 8601 format.
   */
  function calculateEndTime(startTime, endTime) {
    const startDate = new Date(startTime); // Assuming startTime is in ISO format
    const [hours, minutes, seconds] = endTime.split(':').map(Number);

    // Create a new Date object for the end time using the start date
    const endDate = new Date(startDate.getTime());
    endDate.setUTCHours(hours, minutes, seconds, 0);

    // Check if the end date is before the start date and adjust by adding a day if necessary
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }

    return endDate.toISOString().substring(0, 19); // Convert to ISO string and trim for consistency
  }

  // Simplified mapping, since all events are assumed to be of the correct type
  const processedEvents = events.map(event => {
    if (!event.ShiftDate || !event.StartTime || !event.EndTime) return null;

    // Assuming ShiftDate is like 'YYYY-MM-DDT21:00:00.000Z' and you need to extract 'YYYY-MM-DD'
    const datePart = event.ShiftDate.split('T')[0];

    const startDateTime = datePart + 'T' + event.StartTime;
    const endDateTime = datePart + 'T' + event.EndTime;

    return {
      id: event.SpecialistHourID.toString(), // Ensure ID is a string
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
    />
  );
};

export default Calendar;
