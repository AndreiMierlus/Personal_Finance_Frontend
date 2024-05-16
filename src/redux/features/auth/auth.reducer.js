import { createAsyncThunk } from '@reduxjs/toolkit';
import { makeRequest } from '../../../utils/makeRequest';
import { toast } from 'react-toastify';
export const userlogin = createAsyncThunk('auth/userlogin', async (data, thunkAPI) => {
  try {
    let response = await makeRequest(`/api/v1/users/login/`, 'POST', data);
    if (response) {
      return response;
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response);
  }
});
export const userRegister = createAsyncThunk('/auth/userRegister', async (data, thunkAPI) => {
  try {
    let response = await makeRequest(`/api/v1/users/register`, 'POST', data);
    if (response) {
      return response;
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response);
  }
});
export const emailVerification = createAsyncThunk(
  '/auth/emailVerification',
  async (token, thunkAPI) => {
    try {
      let response = await makeRequest(`/api/v1/users/email-verify/${token}`, 'GET', null);
      if (response) {
        return response;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);
export const forgetPasswordEmail = createAsyncThunk(
  '/auth/forgetPasswordEmail',
  async (email, thunkAPI) => {
    try {
      let response = await makeRequest(`/api/v1/users/forget-password`, 'POST', email, null);
      if (response) {
        toast.success('Email has been sent successfully', {
          position: toast.POSITION.TOP_RIGHT,
        });
        return response;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);
export const resetPassword = createAsyncThunk('/auth/resetPassword', async (data, thunkAPI) => {
  const { token } = data;
  try {
    let response = await makeRequest(`/api/v1/users/change-password/${token}`, 'POST', data, null);
    if (response) {
      toast.success('Password has been reset successfully', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return response;
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response);
  }
});
export const logout = createAsyncThunk('/auth/logout', async (thunkAPI) => {
  try {
    let response = await makeRequest(`/api/v1/users/logout`, 'POST', {});
    if (response) {
      console.log(response, 'RESOPONSE============>');
      return response;
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response);
  }
});
