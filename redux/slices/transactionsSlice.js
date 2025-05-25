import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  movements: [],
  loading: false,
  error: null
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setTransactions: (state, action) => {
      state.movements = action.payload;
      state.error = null;
    },
    addTransaction: (state, action) => {
      state.movements.push(action.payload);
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const { setLoading, setTransactions, addTransaction, setError } = transactionsSlice.actions;
export default transactionsSlice.reducer; 