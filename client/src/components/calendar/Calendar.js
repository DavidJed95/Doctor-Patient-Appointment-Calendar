import React, { useRef } from 'react';
import Fullcalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { useSelector, useDispatch } from 'react-redux';
import { addEvent, updateEvent, removeEvent } from '../slices/eventsSlice'; // Adjust path accordingly

const Calendar = () => {
  const dispatch = useDispatch();
  const events = useSelector(state => state.events);
  const calendarRef = useRef(null); // Add useRef for calendar reference

  const handleDateSelect = selectInfo => {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

    if (title) {
      const newEvent = {
        id: Date.now(), // Remember to call the Date.now function
        title: title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      };

      dispatch(addEvent(newEvent));
    }
  };

  const handleEventClick = clickInfo => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`,
      )
    ) {
      clickInfo.event.remove();
      dispatch(removeEvent({ id: clickInfo.event.id }));
    }
  };

  const handleEventResize = resizeInfo => {
    const updatedEvent = {
      id: resizeInfo.event.id,
      title: resizeInfo.event.title,
      start: resizeInfo.event.start,
      end: resizeInfo.event.end,
      allDay: resizeInfo.event.allDay,
    };

    dispatch(updateEvent(updatedEvent));
  };

  const handleEventDrop = dropInfo => {
    const updatedEvent = {
      id: dropInfo.event.id,
      title: dropInfo.event.title,
      start: dropInfo.event.start,
      end: dropInfo.event.end,
      allDay: dropInfo.event.allDay,
    };

    dispatch(updateEvent(updatedEvent));
  };

  return (
    <Fullcalendar
      ref={calendarRef}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView={'timeGridWeek'}
      headerToolbar={{
        start: 'today prev,next',
        center: 'title',
        end: 'timeGridDay,timeGridWeek,dayGridMonth',
      }}
      selectable={true} // Allow date selection
      editable={true} // Allow event resizing and dragging
      events={events}
      select={handleDateSelect} // Handle date selection
      eventClick={handleEventClick} // Handle event click (for deletion)
      eventResize={handleEventResize} // Handle event resize
      eventDrop={handleEventDrop} // Handle event dragging
      height={'90dvh'}
    />
  );
};

export default Calendar;
