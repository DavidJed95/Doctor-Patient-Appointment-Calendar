import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import userReducer from './reducers/userSlice';
import eventsReducer from './reducers/eventsSlice'
import medicalSpecialistsReducer from './reducers/medicalSpecialistsSlice';
import notificationsReducer from './reducers/notificationsSlice';
import appointmentsReducer from './reducers/AppointmentsSlice'
import treatmentsReducer from './reducers/treatmentSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    events: eventsReducer,
    treatments:treatmentsReducer,
    appointments: appointmentsReducer,
    medicalSpecialists: medicalSpecialistsReducer,
    notifications: notificationsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
