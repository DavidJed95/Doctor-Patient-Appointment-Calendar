import { LOGIN, LOGOUT, UPDATE_USER } from '../actions/userActions';

const initialState = {
  userInfo: {},
  isLoggedIn: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        userInfo: action.payload,
        isLoggedIn: true,
      };
    case LOGOUT:
      return {
        ...state,
        userInfo: {},
        isLoggedIn: false,
      };
    case UPDATE_USER:
      return {
        ...state,
        userInfo: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
