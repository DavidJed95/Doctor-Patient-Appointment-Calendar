import React, { useState } from 'react'

const TreatmentSelector = ({treatments , onTreatmentSelect}) => {
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  /**
   * Handles treatment selection
   * @param {*} event 
   */
  const handleSelectChange = (event) => {
    setSelectedTreatment(event.target.value)
    onTreatmentSelect(event.target.value);
  }

  return (
    <select value={selectedTreatment} onChange={handleSelectChange}></select>
  )
}

export default TreatmentSelector

