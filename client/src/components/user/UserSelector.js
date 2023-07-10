import React from 'react';
/**
 * Enum object represents the User Type
 */
export const UserType = Object.freeze({
  Patient: 'Patient',
  MedicalSpecialist: 'Medical Specialist',
});

/**
 * User Selector component for choosing the type of the user
 * @param {*} {onChange} - onChange is function we pass onto our child for changing the selection
 * @returns The selector for the user type
 */
const UserSelector = ({ onChange }) => {
  return (
    <select onChange={onChange} name='userType'>
      <option value={UserType.Patient}>{UserType.Patient}</option>
      <option value={UserType.MedicalSpecialist}>
        {UserType.MedicalSpecialist}
      </option>
    </select>
  );
};
export default UserSelector;
