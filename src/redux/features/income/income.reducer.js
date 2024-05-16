import { createAsyncThunk } from '@reduxjs/toolkit';
import { makeRequest } from '../../../utils/makeRequest';
export const getIncome = createAsyncThunk('income/getIncome', async (UserId, thunkAPI) => {
  try {
    let response = await makeRequest(`api/v1/income/get-income/${UserId}`, 'GET', {});
    if (response) {
      console.log(response, 'response=====');
      return response;
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response);
  }
});
export const getIncomeLastDate = createAsyncThunk('income/getLastDate', async (UserId, thunkAPI) => {
  try {
    let response = await makeRequest(`api/v1/income/getLastDate?userId=${UserId}`, 'GET', {});
    if (response) {
      console.log(response, 'response=====');
      return response;
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response);
  }
});
export const createIncome = createAsyncThunk('income/createIncome', async (data, thunkAPI) => {
  try {
    let response = await makeRequest(`api/v1/income/add-income/`, 'POST', data);
    if (response) {
      return response;
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response);
  }
});
export const editIncome = createAsyncThunk('income/editIncome', async (payload, thunkAPI) => {
  const { UserId, data } = payload;
  console.log(payload, 'payload');
  try {
    let response = await makeRequest(`api/v1/income/edit-income/${UserId}`, 'PATCH', data);
    if (response) {
      console.log(response, 'response');
      return response;
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response);
  }
});
export const deleteIncome = createAsyncThunk('income/deleteIncome', async (id, thunkAPI) => {
  try {
    let response = await makeRequest(`api/v1/income/delete-income/${id}`, 'DELETE', {});
    if (response) {
      console.log(response, 'response');
      return response;
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response);
  }
});
