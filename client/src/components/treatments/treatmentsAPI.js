import { BASE_URL } from "../../config";
/**
 * Fetches treatments from the server url `${BASE_URL}/appointment/treatments`
 * @returns all the treatments from the server
 */
export const fetchTreatments = async () => {
  try {
    const response = await fetch(`${BASE_URL}/appointment/treatments`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
