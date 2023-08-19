import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function Home({ userGreeting }) {
  return (
    <div>
      <h1>{userGreeting}</h1>
      {/* <h2></h2> */}
      <DemoApp />
    </div>
  );
}

const events = [{ title: 'Meeting', start: new Date() }];

export function DemoApp() {
  return (
    <div>
      <h2>Appointment Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView='dayGridMonth'
        weekends={true}
        events={events}
        eventContent={renderEventContent}
      />
    </div>
  );
}

// a custom render function
function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}
