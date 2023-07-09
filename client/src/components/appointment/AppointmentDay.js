import React, { Component } from 'react';
import Button from '../button/Button'


export default class AppointmentDay extends Component {
  state = {
    appointment: '',
  };


/**
 * @method: This method handles adding a new appointment to the calendar
 */
  handleAddAppointment = async () => {
    try {
      const { date } = this.props;
      if (this.state.appointment) {
        throw new Error('An Appointment already exists for this date!');
      }

      // Make an API call or perform any asynchronous operations here
      // For simplicity, let's simulate an asynchronous operation with a setTimeout
      const timeToWait = 1000;
      await new Promise(resolve => setTimeout(resolve, timeToWait));
      this.setState({ appointment: ' Appointment scheduled' });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { date } = this.props;
    const { appointment } = this.state;
    return (
      <div className='appointment-day'>
        <span>{date}</span>
        {appointment ? (
          <span>{appointment}</span>
        ) : (
          <Button text='+' onClick={this.handleAddAppointment}/>
        )}
      </div>
    );
  }
}
