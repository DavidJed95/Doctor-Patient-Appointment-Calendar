import React from "react";

/**
 * SpecialistSelector component for selecting available specialists based on treatment.
 * @param {Object[]} availableSpecialists - List of specialists filtered by treatment.
 * @param {Object} treatmentDetails - The selected treatment details.
 * @param {Function} onSpecialistSelect - Function to handle specialist selection.
 * @returns {JSX.Element} The SpecialistSelector component.
 */
const SpecialistSelector = ({
  availableSpecialists,
  treatmentDetails,
  onSpecialistSelect,
}) => {
  /**
   * Removing duplicates of the medical specialist by filtering his ID
   */
  const uniqueSpecialists = Array.from(
    new Set(availableSpecialists.map((specialist) => specialist.id))
  ).map((id) =>
    availableSpecialists.find((specialist) => specialist.ID === id)
  );

  /**
   * Filtering specialists by the selected treatment's specialization
   */
  const filteredSpecialists = uniqueSpecialists.filter(
    (specialist) => specialist.Specialization === treatmentDetails.TreatmentName
  );

  return (
    <>
      <label>Specialist:</label>
      <select onChange={onSpecialistSelect} defaultValue="">
        <option value="" disabled>
          Select a specialist
        </option>
        {filteredSpecialists.map((specialist) => (
          <option key={specialist.ID} value={specialist.ID}>
            Dr. {specialist.FirstName} {specialist.LastName}
          </option>
        ))}
      </select>
    </>
  );
};

export default SpecialistSelector;
