
const TreatmentSelector = ({ treatments, onTreatmentSelect }) => {
  /**
   * Handles treatment selection
   * @param {*} event - The event object that contains the selected treatment
   */
  const handleSelectChange = (event) => {
    const selectedTreatment = treatments.find(
      (treatment) => treatment.TreatmentID === parseInt(event.target.value)
    );
    onTreatmentSelect(selectedTreatment);
  };

  return (
    <>
      <label>Treatment:</label>
      <select onChange={handleSelectChange} name="treatmentSelector" defaultValue="">
        <option value="" disabled>Select a Treatment</option>
        {treatments.map((treatment) => (
          <option key={treatment.TreatmentID} value={treatment.TreatmentID}>
            {treatment.TreatmentName}
          </option>
        ))}
      </select>
    </>
  );
};

export default TreatmentSelector;
