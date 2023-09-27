import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import userReducer from './reducers/userSlice';
import eventsReducer from './reducers/eventsSlice'
import notificationsReducer from './reducers/notificationsSlice';


const store = configureStore({
  reducer: {
    user: userReducer,
    events: eventsReducer,
    
    notifications: notificationsReducer,
    
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;
