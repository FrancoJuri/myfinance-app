import { Redirect, Stack } from 'expo-router';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

export default function AppLayout() {

  const { isAuthenticated, loading } = useSelector((state) => state.user);

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
  } 

  if(!isAuthenticated) {
    return <Redirect href="/(auth)" />;
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