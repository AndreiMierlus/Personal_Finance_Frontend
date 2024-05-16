import { createAsyncThunk } from '@reduxjs/toolkit';
import { makeRequest } from '../../utils/makeRequest';

export const createGoal = createAsyncThunk('goal/createGoal', async (data, thunkAPI) => {
  console.log(data, 'data');
  try {
    let response = await makeRequest(`api/v1/goal/add-goal/`, 'POST', data);
    if (response) {
      return response;
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response);
  }
});
export const getGoal = createAsyncThunk('goal/getGoal', async (UserId, thunkAPI) => {
  try {
    let response = await makeRequest(`api/v1/goal/get-goal/${UserId}`, 'GET', '');
    if (response) {
      return response;
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response);
  }
});
export const editGoal = createAsyncThunk('goal/editGoal', async (payload, thunkAPI) => {
  console.log(payload, 'payload===');
  const { UserId } = payload;
  try {
    let response = await makeRequest(`api/v1/goal/edit-goal/${UserId}`, 'PATCH', payload);
    if (response) {
      return response;
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response);
  }
});
export const deleteGoal = createAsyncThunk('goal/deleteGoal', async (id, thunkAPI) => {
  console.log(id, 'id');
  try {
    let response = await makeRequest(`api/v1/goal/delete-goal/${id}`, 'DELETE', {});
    if (response) {
      return response;
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response);
  }
});
