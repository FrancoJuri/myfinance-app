import { configureStore } from '@reduxjs/toolkit';
import devtoolsEnhancer from 'redux-devtools-expo-dev-plugin';
import transactionsReducer from './slices/transactionsSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    transactions: transactionsReducer,
  },
  devTools: false,
  enhancers: getDefaultEnhancers => getDefaultEnhancers().concat(devtoolsEnhancer()),
});

export default store; 