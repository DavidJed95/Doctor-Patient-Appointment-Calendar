import React, { Component } from 'react';
import LoginForm from '../loginForm/LoginForm';
import RegistrationForm from '../registrationForm/RegistrationForm';
import PasswordResetForm from '../passwordResetForm/PasswordResetForm';

export default class AuthPage extends Component {
  state = {
    currentForm: 'login', //Will be the default form, we can choose either 'login', or 'register' and 'reset password'
  };

  /**
   * This method handles the form:
   * there will be no flickery jumps between the forms
   */
  handleFormSubmit = event => {
    event.preventDefault();
  };

  render() {
    let form;

    switch (this.state.currentForm) {
      case 'register':
        form = <RegistrationForm onSubmit={this.handleFormSubmit} />;
        break;
      case 'reset':
        form = <PasswordResetForm onSubmit={this.handleFormSubmit} />;
        break;
      default:
        form = <LoginForm onSubmit={this.handleFormSubmit} />;
        break;
    }
    return (
      <div>
        {form}
        <button onClick={() => this.setState({ currentForm: 'login' })}>
          Login
        </button>
        <button onClick={() => this.setState({ currentForm: 'register' })}>
          Register
        </button>
        <button onClick={() => this.setState({ currentForm: 'reset' })}>
          Reset Password
        </button>
      </div>
    );
  }
}
