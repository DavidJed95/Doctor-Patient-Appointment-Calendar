import React, { useState } from 'react';

export const UserType = Object.freeze({
  Patient: 'Patient',
  MedicalSpecialist: 'Medical Specialist',
});

const UserSelector = () => {
  const [userType, setUserType] = useState(UserType.Patient);

  const handleChange = event => {
    setUserType(event.target.value);
  };

  return (
    <select value={userType} onChange={handleChange} name={userType}>
      <option value={UserType.Patient}>{UserType.Patient}</option>
      <option value={UserType.MedicalSpecialist}>
        {UserType.MedicalSpecialist}
      </option>
    </select>
  );
};
export default UserSelector;
