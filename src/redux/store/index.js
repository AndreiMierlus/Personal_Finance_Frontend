// import { configureStore } from '@reduxjs/toolkit';
// import { combineReducers } from 'redux';
// import { persistReducer, persistStore } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import authSlice from '../features/auth/auth.slice';
// import incomeSlice from '../features/income/income.slice';
// import expenseSlice from '../features/expense/expense.slice';
// import goalSlice from '../features/goal.slice';
// const persistConfig = {
//   key: 'root',
//   storage,
// };
// const rootReducer = combineReducers({
//   auth: authSlice,
//   income: incomeSlice,
//   expense: expenseSlice,
//   goal: goalSlice,
// });
// const persistedReducer = persistReducer(persistConfig, rootReducer);
// export const store = configureStore({
//   reducer: persistedReducer,
// });
// export const persistor = persistStore(store);
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// Import your slices
import authSlice from '../features/auth/auth.slice';
import incomeSlice from '../features/income/income.slice';
import expenseSlice from '../features/expense/expense.slice';
import goalSlice from '../features/goal.slice';

const rootReducer = combineReducers({
  auth: authSlice,
  income: incomeSlice,
  expense: expenseSlice,
  goal: goalSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});
