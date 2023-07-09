import React, { Component } from 'react'
import AppointmentDay from './AppointmentDay'
import styles from './AppointmentCalendar.module.css';

export default class AppointmentCalendar extends Component {
  render() {
    return (
      <div>
        {/* Render 30 days */}
        {Array.from({ length: 30 }, (_, index) => {
          const date = index + 1;
          const formattedDate = `2023-05-${date < 10 ? '0' + date : date}`; // Maybe my desired date will be replaced and formatted here
          return <AppointmentDay key={formattedDate} date={formattedDate} />;
        })}
      </div>
    );
  }
}
