import { Stack } from 'expo-router';

export default function AppLayout() {
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