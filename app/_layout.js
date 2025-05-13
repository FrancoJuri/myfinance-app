import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import '../global.css';
import store from '../redux/store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen 
          name="(auth)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="(app)" 
          options={{ headerShown: false }} 
        />
      </Stack>
    </Provider>
  );
} 