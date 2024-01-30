import React, { useRef } from 'react';
import Fullcalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const Calendar = ({
  handleDateSelect,
  handleEventClick,
  events,
  eventType,
}) => {
  const calendarRef = useRef(null);

  const processedEvents = events
    .filter(event => !eventType || event.eventType === eventType)
    .map(event => ({
      id: event.id || event.SpecialistHourID, // use SpecialistHourID if id is undefined
      title: event.title,
      start: new Date(event.start || event.ShiftDate), // use ShiftDate if start is undefined
      end: event.end,
    }));

  console.log(`Processed events in the Calendar.js: `, processedEvents);

  return (
    <div>
      <Fullcalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={'timeGridWeek'}
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
        height={'90dvh'}
      />
    </div>
  );
};

export default Calendar;
