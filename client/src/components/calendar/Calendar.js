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
  const processedEvents = events.map(event => {
    const datePart = event.ShiftDate.split('T')[0];

    const startDateTime = datePart + 'T' + event.StartTime;
    const endDateTime = datePart + 'T' + event.EndTime;
console.log('datePart: ', datePart);
    console.log('startDateTime: ', startDateTime);
    console.log('endDateTime: ', endDateTime);

    console.log('event.StartTime: ',event.StartTime)
    console.log('event.EndTime: ' ,event.EndTime)
    console.log('event.ShiftDate: ', event.ShiftDate);
console.log(event.ShiftDate);
    return {
      id: event.SpecialistHourID,
      title: event.Type,
      start: startDateTime,
      end: endDateTime,
    };
  });

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
