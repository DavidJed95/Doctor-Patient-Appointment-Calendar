import React, { useRef } from 'react';
import Fullcalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

// import { useSelector, useDispatch } from 'react-redux';
// import {
//   addEvent,
//   updateEvent,
//   removeEvent,
// } from '../../redux/reducers/eventsSlice';

const Calendar = ({ handleDateSelect, handleEventClick, events }) => {
  const calendarRef = useRef(null);

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
        events={events.map(event => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          
        }))}
        select={handleDateSelect}
        eventClick={handleEventClick}
        height={'90dvh'}
      />
    </div>
  );
};

export default Calendar;
