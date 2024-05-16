import { createSlice } from '@reduxjs/toolkit';
import { createExpense, deleteExpense, editExpense, getExpense } from './expense.reducer';
import { toast } from 'react-toastify';
const initialState = {
  expenses: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};
export const expenseSlice = createSlice({
  name: 'expense',
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
    builder.addCase(getExpense.pending, (state) => {
      console.log(state, 'getExpense.pending');
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(getExpense.fulfilled, (state, action) => {
      console.log(action, 'getExpense.fulfilled');
      const { data } = action?.payload;
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = true;
      state.expenses = data;
    });
    builder.addCase(getExpense.rejected, (state, action) => {
      console.log(action, 'getExpense.rejected');
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.error = action.error;
    });
    builder.addCase(createExpense.pending, (state) => {
      console.log('createExpense.pending', state);
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(createExpense.fulfilled, (state, action) => {
      console.log(action?.payload, 'createExpense.fulfilled');
      state.isLoading = false;
      state.isError = false;
      state.expenses.unshift(action.payload.data);
      toast.success('Expense has been created', {
        position: toast.BOTTOM_RIGHT,
      });
    });
    builder.addCase(createExpense.rejected, (state, action) => {
      console.log('createExpense.rejected', action);
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.error = action.error;
      toast.error('Someting went wrong', {
        position: toast.BOTTOM_RIGHT,
      });
    });
    builder.addCase(editExpense.pending, (state) => {
      console.log('editEx.pending', state);
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(editExpense.fulfilled, (state, action) => {
      const updatedExpense = action.payload.data;
      console.log(action?.payload, 'editExpense.fulfilled');
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = true;
      const index = state.expenses.findIndex((item) => item?._id === action.payload.data._id);
      if (index != -1) {
        state.expenses[index] = updatedExpense;
      }
      toast.success('Expense has been updated', {
        position: toast.BOTTOM_RIGHT,
      });
    });
    builder.addCase(editExpense.rejected, (state, action) => {
      console.log('editExpense.rejected', action);
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.error = action.error;
      toast.error('Someting went wrong', {
        position: toast.BOTTOM_RIGHT,
      });
    });
    builder.addCase(deleteExpense.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      debugger
      state.expenses = state.expenses.filter((item) => item?.date !== action.meta.arg);
      toast.success('Expense has been deleted', {
        position: toast.BOTTOM_RIGHT,
      });
    });
  },
});
export const { clearState, clearSuccess } = expenseSlice.actions;
export default expenseSlice.reducer;
