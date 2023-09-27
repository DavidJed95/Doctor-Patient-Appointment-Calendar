import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import userReducer from './reducers/userSlice';
import eventsReducer from './reducers/eventsSlice'
import medicalSpecialistsSlice from './reducers/medicalSpecialistsSlice';
import notificationsReducer from './reducers/notificationsSlice';


const store = configureStore({
  reducer: {
    user: userReducer,
    events: eventsReducer,
    medicalSpecialists: medicalSpecialistsSlice,
    notifications: notificationsReducer,
    
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;
