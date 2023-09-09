export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT';
export const UPDATE_USER = 'UPDATE_USER';

export const loginUser = user => {
  return {
    type: LOGIN,
    payload: user,
  };
};

export const logoutUser = () => {
  return {
    type: LOGOUT,
  };
};

export const updateUser = user => {
  return {
    type: UPDATE_USER,
    payload: user,
  };
};