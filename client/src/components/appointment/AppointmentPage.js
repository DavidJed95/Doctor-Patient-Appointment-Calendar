import React, { Component } from 'react';
import AppointmentCalendar from './AppointmentCalendar';
import Navbar from '../layout/Navbar'
import Footer from '../footer/Footer'

export default class AppointmentPage extends Component {
  render() {
    return (
      <div>
        <Navbar siteTitle = 'Appointments'/>
        <h1>Appointment Calendar</h1>

        <AppointmentCalendar />
        <Footer name='David Jedwabsky' />
      </div>
    );
  }
}
