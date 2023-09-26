import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import userReducer from './reducers/userSlice';
import eventsReducer from './reducers/eventsSlice'
import specialistAvailabilityReducer from './reducers/specialistAvailabilitySlice';
import notificationsReducer from './reducers/notificationsSlice';
import patientAppointmentsReducer from './reducers/patientAppointmentsSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    events: eventsReducer,
    specialistAvailability: specialistAvailabilityReducer,
    notifications: notificationsReducer,
    patientAppointments: patientAppointmentsReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

// const store = createStore(rootReducer);

export default store;
