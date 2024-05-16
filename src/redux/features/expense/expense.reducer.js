import { createAsyncThunk } from '@reduxjs/toolkit';
import { makeRequest } from '../../../utils/makeRequest';
export const getExpense = createAsyncThunk('expense/getExpense', async (UserId, thunkAPI) => {
  try {
    let response = await makeRequest(`api/v1/expense/get-expense/${UserId}`, 'GET', {});
    if (response) {
      return response;
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response);
  }
});
export const createExpense = createAsyncThunk('expense/createExpense', async (data, thunkAPI) => {
  try {
    let response = await makeRequest(`api/v1/expense/add-expense`, 'POST', data);
    if (response) {
      return response;
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response);
  }
});
export const editExpense = createAsyncThunk('expense/editExpense', async (payload, thunkAPI) => {
  console.log(payload, 'payload===');
  // const { UserId, data } = payload;
  try {
    let response = await makeRequest(`api/v1/expense/edit-expense/${payload.UserId}`, 'PATCH', payload);
    if (response) {
      return response;
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response);
  }
});
export const deleteExpense = createAsyncThunk('expense/deleteExpense', async (id, thunkAPI) => {
  try {
    let response = await makeRequest(`api/v1/expense/delete-expense/${id}`, 'DELETE', {});
    if (response) {
      console.log(response, 'response=====');
      return response;
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response);
  }
});
