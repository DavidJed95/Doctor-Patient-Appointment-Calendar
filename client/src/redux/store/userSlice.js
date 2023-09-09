import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: {},
    isLoggedIn: false,
    userShifts: [],
  },
  reducers: {
    login: (state, action) => {
      state.userInfo = action.payload;
      state.isLoggedIn = true;
    },
    logout: state => {
      state.userInfo = {};
      state.isLoggedIn = false;
    },
    setShifts: (state, action) => {
      state.userShifts = action.payload;
    },
  },
});

export const { login, logout, updateUser, setShift } = userSlice.actions;

export const selectUser = state => state.user.userInfo;
export const selectIsLoggedIn = state => state.user.isLoggedIn;
export const selectUserShifts = state => state.user.userShifts;
export default userSlice.reducer;
