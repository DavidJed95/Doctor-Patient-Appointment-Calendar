import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userSlice';
import eventsReducer from './reducers/eventsSlice'
import specialistAvailabilityReducer from './reducers/specialistAvailabilitySlice';
import notificationsReducer from './reducers/notificationsSlice';
import patientProfileReducer from './reducers/patientProfileSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    events: eventsReducer,
    specialistAvailability: specialistAvailabilityReducer,
    notifications: notificationsReducer,
    patientProfile: patientProfileReducer,
  },
});

// const store = createStore(rootReducer);

export default store;
