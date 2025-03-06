import React, { useMemo } from "react";
import { useSelector } from "react-redux";

/**
 * SpecialistSelector component for selecting available specialists based on treatment.
 * @param {Object} treatmentDetails - The selected treatment details.
 * @param {Function} onSpecialistSelect - Function to handle specialist selection.
 * @returns {JSX.Element} The SpecialistSelector component.
 */
const SpecialistSelector = ({ treatmentDetails, onSpecialistSelect }) => {
  const availableSpecialists = useSelector(
    (state) => state.appointments.availableSpecialists
  );
  // Memoize the filtered and unique specialists
  const availableSpecialistsOptions = useMemo(() => {
    return Array.from(
      new Set(availableSpecialists.map((specialist) => specialist.ID))
    )
      .map((id) =>
        availableSpecialists.find((specialist) => specialist.ID === id)
      )
      .filter(
        (specialist) =>
          specialist.Specialization === treatmentDetails.TreatmentName
      );
  }, [availableSpecialists, treatmentDetails.TreatmentName]);

  const handleSpecialistChange = (event) => {
    const selectedId = event.target.value;
    const selectedSpecialist = availableSpecialistsOptions.find(
      (spec) => spec.ID === parseInt(selectedId)
    );
    onSpecialistSelect(selectedSpecialist); // Pass the full specialist object
  };

  return (
    <>
      <label>Specialist:</label>
      <select name="specialistSelector" onChange={handleSpecialistChange} defaultValue="">
        <option value="" disabled>
          Select a specialist
        </option>
        {availableSpecialistsOptions.map((specialist) => (
          <option key={specialist.ID} value={specialist.ID}>
            Dr. {specialist.FirstName} {specialist.LastName}
          </option>
        ))}
      </select>
    </>
  );
};

export default SpecialistSelector;
