import { BASE_URL } from "../../config";

export const fetchTreatmentAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/appointment/treatments`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Fetched treatments in API: ", data); // Debug log
    return data;
  } catch (error) {
    console.error("Error in fetchTreatmentAPI: ", error); // Debug log
    throw error;
  }
};
