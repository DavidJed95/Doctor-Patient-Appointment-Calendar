import { createSlice } from '@reduxjs/toolkit';
/**
 * The initial state of the user while he's not logged in
 */
const initialState = {
  userInfo: {},
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.userInfo = action.payload;
      state.isLoggedIn = true;
    },
    logoutUser: () => dispatch => {
      // Reset user information and set isLoggedIn to false
      dispatch(setUser({}));
      dispatch(updateLoginStatus(false));
    },

    updateLoginStatus: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setUser: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

export const { loginUser, logoutUser, updateLoginStatus, setUser } =
  userSlice.actions;
export default userSlice.reducer;
