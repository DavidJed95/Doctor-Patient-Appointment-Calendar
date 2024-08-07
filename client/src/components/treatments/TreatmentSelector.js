import React from "react";

const TreatmentSelector = ({ treatments, onTreatmentSelect }) => {
  /**
   * Handles treatment selection
   * @param {*} event - The event object that contains the selected treatment
   */
  const handleSelectChange = (event) => {
    const selectedTreatment = treatments.find(treatment => treatment.TreatmentID === parseInt(event.target.value));
    onTreatmentSelect(selectedTreatment);
  };

console.log('The treatments in the TreatmentSelector.js line 13: ',treatments);
  return (
    <select onChange={handleSelectChange} name="treatmentSelector">
      <option value="">Select a Treatment</option>
      {treatments.map((treatment) => (
        <option key={treatment.TreatmentID} value={treatment.TreatmentID}>
          {treatment.TreatmentName}
        </option>
      ))}
    </select>
  );
};

export default TreatmentSelector;
