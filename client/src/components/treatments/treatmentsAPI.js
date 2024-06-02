import { BASE_URL } from "../../config";

export const fetchTreatmentAPI = async () => {
  const response = await fetch(`${BASE_URL}/treatments`);
  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.message || "Error loading treatment.");
  }
  return response.json();
};
