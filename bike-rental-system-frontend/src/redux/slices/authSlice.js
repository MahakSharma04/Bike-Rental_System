import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  authToken: localStorage.getItem('authToken'),
  tokenType: localStorage.getItem('tokenType'),
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('authToken')
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, access_token, token_type } = action.payload;
      localStorage.setItem('authToken', access_token);
      localStorage.setItem('tokenType', token_type);
      localStorage.setItem('user', JSON.stringify(user));
      state.authToken = access_token;
      state.tokenType = token_type;
      state.user = user;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenType');
      localStorage.removeItem('user');
      state.authToken = null;
      state.tokenType = null;
      state.user = null;
      state.isAuthenticated = false;
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer; 