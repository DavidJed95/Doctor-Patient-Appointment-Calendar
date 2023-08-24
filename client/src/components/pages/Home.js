import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function Home({ user, userGreeting }) {
  const [greeting, setGreeting] = useState(userGreeting);

  useEffect(() => {
    if (user && user.UserType) {
      const userTypePrefix =
        user.UserType === 'Medical Specialist' ? 'Doctor ' : '';
      setGreeting(
        `Welcome ${userTypePrefix}${user.FirstName} ${user.LastName}`,
      );
    }
  }, [user]);
  return (
    <div>
      <h1>{greeting}</h1>
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
