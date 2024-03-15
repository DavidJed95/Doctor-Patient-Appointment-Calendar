import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import Fullcalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const Calendar = ({ handleDateSelect, handleEventClick }) => {
  const calendarRef = useRef(null);
  // Assuming state.events.specialistAvailability correctly fetches the needed events
  const events = useSelector(state => state.events.SpecialistAvailability);
  console.log('Events in Calendar:', events, 'events Type: ', typeof events); // Debugging log
  // Simplified mapping, since all events are assumed to be of the correct type
  const processedEvents =
    events.map(event => ({
      id: event.SpecialistHourID, // use SpecialistHourID if id is undefined
      title: event.Type,
      // Ensures dates are treated as UTC to prevent timezone shifts
      start: new Date(
        event.ShiftDate + 'T' + event.StartTime
      ), // Append time and 'Z' to indicate UTC
      end: new Date(
        event.ShiftDate + 'T' + event.EndTime
      ), // Use end of day for the event's end date
    })) || [];

  return (
    <Fullcalendar
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
