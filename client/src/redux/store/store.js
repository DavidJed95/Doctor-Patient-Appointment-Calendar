// 
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer';
// import other reducers as you create them...

const store = configureStore({
  user: userReducer,
  // other reducers...
});

// const store = createStore(rootReducer);

export default store;
