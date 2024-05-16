import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { createGoal, deleteGoal, editGoal, getGoal } from './goal.reducer';
import { getLatestItem } from '../../utils/Utils';
const initialState = {
  goal: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
  totalSavings:"",
  remainingSavings:"",
  monthsToGoal:"",
  status:'pending',
  haveNotified:false
};
export const goalSlice = createSlice({
  name: 'goal',
  initialState,
  reducers: {
    clearState: () => initialState,
    goalSet:(state,action)=>{
      return {...state,...action.payload}},
    clearSuccess: (state) => {
      return {
        ...state,
        isSuccess: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getGoal.pending, (state) => {
      console.log('getGoal.pending', state);
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(getGoal.fulfilled, (state, action) => {
      console.log('getGoal.fulfilled', action);
   
      const item=getLatestItem(action?.payload?.data)

      state.isLoading = false;
      state.isError = false;
      state.isSuccess = true;
      state.goal = action?.payload?.data;
      state.status=item.status,
      state.haveNotified=item.haveNotified
      
    });
    builder.addCase(getGoal.rejected, (state, action) => {
      console.log('getGoal.rejected', action);
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.error = action.error;
    });
    builder.addCase(createGoal.pending, (state) => {
      console.log('createGoal.pending', state);
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(createGoal.fulfilled, (state, action) => {
      console.log('createGoal.fulfilled', action);
      state.isLoading = false;
      state.isError = false;
      state.goal.unshift(action?.payload?.data);
      toast.success('Goal has been created', {
        position: toast.BOTTOM_RIGHT,
      });
    });
    builder.addCase(createGoal.rejected, (state, action) => {
      console.log('createGoal.rejected', action);
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.error = action.error;
    });
    builder.addCase(editGoal.pending, (state) => {
      console.log('editGoal.pending', state);
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(editGoal.fulfilled, (state, action) => {
      console.log('editGoal.fulfilled', action);
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = true;
      const index = state.goal.findIndex((item) => item?._id === action.meta.arg);
      if (index != -1) {
        state.goal[index] = updatedIncome;
      }
      toast.success('Goal has been updated', {
        position: toast.BOTTOM_RIGHT,
      });
    });
    builder.addCase(editGoal.rejected, (state, action) => {
      console.log('editGoal.rejected', action);
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.error = action.error;
      toast.error('Something went wrong', {
        position: toast.BOTTOM_RIGHT,
      });
    });
    builder.addCase(deleteGoal.fulfilled, (state, action) => {
      console.log('deleteGoal.fulfilled', action);
      state.isLoading = false;
      state.isError = false;
      state.goal = state.goal.filter((item) => item?._id !== action.meta.arg);
      toast.success('Goal has been deleted', {
        position: toast.BOTTOM_RIGHT,
      });
    });
  },
});
export const { clearState, clearSuccess,goalSet } = goalSlice.actions;
export default goalSlice.reducer;
