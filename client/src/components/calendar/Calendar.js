// import React, { useState, useRef } from 'react';
// import Fullcalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';

// import { useSelector, useDispatch } from 'react-redux';
// import {
//   addEvent,
//   updateEvent,
//   removeEvent,
// } from '../../redux/reducers/eventsSlice'; // Adjust path accordingly

// import Modal from '../common/Modal';

// const Calendar = () => {
//   const dispatch = useDispatch();
//   const events = useSelector(state => state.events);
//   const calendarRef = useRef(null);

//   const [isModalOpen, setModalOpen] = useState(false);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [eventTitle, setEventTitle] = useState('');
//   const [startTime, setStartTime] = useState('');
//   const [endTime, setEndTime] = useState('');
  

//   const handleDateSelect = selectInfo => {
//     const calendarApi = selectInfo.view.calendar;

//     // If the modal is already open, just close it and exit the callback
//     if (isModalOpen) {
//       setModalOpen(false);
//       return;
//     }

//     // If it reaches here, it means the modal was not already open, so we can open it
//     setSelectedDate(selectInfo);
//     setModalOpen(true);

//     calendarApi.unselect();
//   };

//   const handleModalClose = () => {
//     setModalOpen(false);
//     setSelectedDate(null);
//     setEventTitle('');
//   };

//   const handleModalSubmit = () => {
//     if (eventTitle && startTime && endTime) {
//       const startDateTime = new Date(selectedDate.startStr);
//       const endDateTime = new Date(selectedDate.startStr);

//       startDateTime.setHours(parseInt(startTime.split(':')[0]));
//       startDateTime.setMinutes(parseInt(startTime.split(':')[1]));

//       endDateTime.setHours(parseInt(endTime.split(':')[0]));
//       endDateTime.setMinutes(parseInt(endTime.split(':')[1]));

//       const newEvent = {
//         id: Date.now(),
//         title: eventTitle,
//         start: startDateTime.toISOString(),
//         end: endDateTime.toISOString(),
//         allDay: selectedDate.allDay,
//       };

//       dispatch(addEvent(newEvent));
//       handleModalClose();
//     }
//   };

//   const handleEventClick = clickInfo => {
//     setSelectedEvent(clickInfo.event);
//     setDeleteModalOpen(true);
//   };

//   const confirmDelete = () => {
//     setSelectedEvent(null);
//     dispatch(removeEvent({ id: selectedEvent.id }));
//     setDeleteModalOpen(false);
//   };

//   const cancelDelete = () => {
//     setSelectedEvent(null);
//     setDeleteModalOpen(false);
//   };

//   const handleEventResize = resizeInfo => {
//     const updatedEvent = {
//       id: resizeInfo.event.id,
//       title: resizeInfo.event.title,
//       start: resizeInfo.event.start,
//       end: resizeInfo.event.end,
//       allDay: resizeInfo.event.allDay,
//     };

//     dispatch(updateEvent(updatedEvent));
//   };

//   const handleEventDrop = dropInfo => {
//     const updatedEvent = {
//       id: dropInfo.event.id,
//       title: dropInfo.event.title,
//       start: dropInfo.event.start,
//       end: dropInfo.event.end,
//       allDay: dropInfo.event.allDay,
//     };

//     dispatch(updateEvent(updatedEvent));
//   };

//   return (
//     <div>
//       <Fullcalendar
//         ref={calendarRef}
//         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//         initialView={'timeGridWeek'}
//         headerToolbar={{
//           start: 'today prev,next',
//           center: 'title',
//           end: 'timeGridDay,timeGridWeek,dayGridMonth',
//         }}
//         selectable={true} // Allow date selection
//         editable={true} // Allow event resizing and dragging
//         events={events}
//         select={handleDateSelect} // Handle date selection
//         eventClick={handleEventClick} // Handle event click (for deletion)
//         eventResize={handleEventResize} // Handle event resize
//         eventDrop={handleEventDrop} // Handle event dragging
//         height={'90dvh'}
//       />
//       {isModalOpen && (
//         <Modal
//           show={isModalOpen}
//           onClose={handleModalClose}
//           onSubmit={handleModalSubmit}
//         >
//           <h2>Add Event</h2>
//           <div>
//             <label>
//               Event Title:
//               <input
//                 type='text'
//                 value={eventTitle}
//                 onChange={e => setEventTitle(e.target.value)}
//               />
//             </label>
//           </div>
//           <p>Selected Date: {selectedDate?.startStr}</p>
//         </Modal>
//       )}
//       {deleteModalOpen && (
//         <Modal show={deleteModalOpen} onClose={cancelDelete} showSubmit={false}>
//           <p>
//             Are you sure you want to delete the event '{selectedEvent?.title}'?
//           </p>
//           <button onClick={confirmDelete}>Delete</button>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default Calendar;
import React, { useState, useRef } from 'react';
import Fullcalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { useSelector, useDispatch } from 'react-redux';
import {
  addEvent,
  updateEvent,
  removeEvent,
} from '../../redux/reducers/eventsSlice'; // Adjust path accordingly

import Modal from '../common/Modal';

const Calendar = ({ handleDateSelect, handleEventClick, events }) => {
  const calendarRef = useRef(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

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
        selectable={true} // Allow date selection
        editable={true} // Allow event resizing and dragging
        events={events}
        select={handleDateSelect} // Handle date selection
        eventClick={handleEventClick} // Handle event click (for deletion)
        height={'90dvh'}
      />
    </div>
  );
};

export default Calendar;