import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userSlice';
// import other reducers as you create them...

const store = configureStore({
  reducer: {
    user: userReducer,
    // other reducers...
    // TODO: medicalSpecialist: medicalSpecialistReducer - containing shift related stuff like seeing patient who created appointments to him
    // TODO: patient: patientReducer - creating appointments and having reports that show him the appointments he has in range of dates
  },
});

// const store = createStore(rootReducer);

export default store;
