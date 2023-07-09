import React, { Component } from 'react';
import User from '../user/User';

export default class MedicalSpecialist extends User {
  state = {
    MedicalLicense: Number,
    Specialization: '',
  };
}
