import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import userReducer from './reducers/userSlice';
import eventsReducer from './reducers/eventsSlice'
import medicalSpecialistsSlice from './reducers/medicalSpecialistsSlice';
import notificationsReducer from './reducers/notificationsSlice';
import appointmentsReducer from './reducers/AppointmentsSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    events: eventsReducer,
    appointments: appointmentsReducer,
    medicalSpecialists: medicalSpecialistsSlice,
    notifications: notificationsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
