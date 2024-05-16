import { createSlice } from '@reduxjs/toolkit';
import { logout, userRegister, userlogin } from './auth.reducer';
import { toast } from 'react-toastify';
const initialState = {
  auth:JSON.parse(localStorage.getItem("user"))?? [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};
export const authSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    clearState: () => initialState,
    clearSuccess: (state) => {
      return {
        ...state,
        isSuccess: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userlogin.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(userlogin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = true;
      state.auth = action.payload.data;
      localStorage.setItem("user",JSON.stringify(action.payload.data))
      toast.success('Login has been succesfull', {
        position: toast.BOTTOM_RIGHT,
      });
    });
    builder.addCase(userlogin.rejected, (state, action) => {
      //const response = JSON.parse(action?.payload?.request?.response);
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.error = action.error;
      toast.error('Something went wrong', {
        position: toast.BOTTOM_RIGHT,
      });
    });
    builder.addCase(userRegister.pending, (state) => {
      console.log('userRegister.rejected', state);
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(userRegister.fulfilled, (state, action) => {
      console.log('userRegister.fulfilled', action);
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = true;
    });
    builder.addCase(userRegister.rejected, (state, action) => {
      console.log('userRegister.rejected', action);
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.error = action.error;
      toast.error(action.payload.data.message, {
        position: toast.BOTTOM_RIGHT,
      });
    });
  },
});
export const { clearState, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
