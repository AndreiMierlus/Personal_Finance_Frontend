import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { createIncome, deleteIncome, editIncome, getIncome, getIncomeLastDate } from './income.reducer';
const initialState = {
  incomes: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
  incomeLastDate:""
};
export const incomeSlice = createSlice({
  name: 'income',
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
    builder.addCase(getIncome.pending, (state) => {
      console.log('getIncome.pending', state);
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(getIncome.fulfilled, (state, action) => {
      console.log('getIncome.fulfilled', action);
      const { data } = action?.payload;
      state.isLoading = false;
      state.isError = false;
      state.incomes = data;
    });
    builder.addCase(getIncomeLastDate.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.error = action.error;
    });
    builder.addCase(getIncomeLastDate.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(getIncomeLastDate.fulfilled, (state, action) => {
      const { date } = action?.payload;
      console.log("data===",date)
      state.isLoading = false;
      state.isError = false;
      state.incomeLastDate = date;
    });
    builder.addCase(getIncome.rejected, (state, action) => {
      console.log('getIncomeLastDate', action);
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.error = action.error;
    });
    builder.addCase(createIncome.pending, (state) => {
      console.log("state",createIncome.pending)
      console.log('createIncome.pending', state);
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(createIncome.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.incomes.unshift(action.payload.data);
      toast.success('Income has been created', {
        position: toast.BOTTOM_RIGHT,
      });
    });
    builder.addCase(createIncome.rejected, (state, action) => {
      console.log('createIncome.rejected', action);
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.error = action.error;
      toast.error('Something went wrong', {
        position: toast.BOTTOM_RIGHT,
      });
    });
    builder.addCase(editIncome.pending, (state) => {
      console.log('editIncome.pending', state);
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(editIncome.fulfilled, (state, action) => {
      const updatedIncome = action.payload.data;
      console.log('editIncome.fulfilled', action);
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = true;
      const index = state.incomes.findIndex((item) => item?._id === action.meta.arg);
      if (index != -1) {
        state.incomes[index] = updatedIncome;
      }
      toast.success('Income has been Updated', {
        position: toast.BOTTOM_RIGHT,
      });
    });
    builder.addCase(editIncome.rejected, (state, action) => {
      console.log('editIncome.rejected', action);
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.error = action.error;
      toast.error('Something went wrong', {
        position: toast.BOTTOM_RIGHT,
      });
    });
    builder.addCase(deleteIncome.fulfilled, (state, action) => {
      console.log(action, 'deleteIncome.fulfilled');
      state.isLoading = false;
      state.isError = false;
      state.incomes = state.incomes.filter((item) => item?._id !== action.meta.arg);
      toast.success('Income has been deleted', {
        position: toast.BOTTOM_RIGHT,
      });
    });
    builder.addCase(deleteIncome.rejected, (state, action) => {
      console.log(action, 'action');
      state.isLoading = false;
      state.isError = false;
      state.isError = true;
      toast.success('Something went wrong', {
        position: toast.BOTTOM_RIGHT,
      });
    });
  },
});
export const { clearState, clearSuccess } = incomeSlice.actions;
export default incomeSlice.reducer;
