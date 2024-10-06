import { useEffect } from "react";

/**
 * Custom hook that changes the title of the page
 * @param {String} title - Title of the page
 */
const usePageTitle = (title) => {
  useEffect(() => {
    document.title = `${title} | Doctor Patient Appointment Calendar`;
  }, [title]);
};
export default usePageTitle;
