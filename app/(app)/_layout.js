import { Redirect, Stack } from 'expo-router';
import { useSelector } from 'react-redux';

export default function AppLayout() {
  const { isAuthenticated } = useSelector(state => state.user);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Dashboard',
          headerShown: true 
        }} 
      />
      {/* Otras pantallas se agregarán aquí más adelante */}
    </Stack>
  );
} 