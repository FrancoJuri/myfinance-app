import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

export default function AuthLayout() {
  return (
    <View className="flex-1 bg-gray-950">
      <StatusBar style="light" />
      <Stack 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: {
            backgroundColor: '#1b263b',
          }
        }}
      >
        <Stack.Screen 
          name="login"
          options={{
            title: "Iniciar sesión"
          }}
        />
        <Stack.Screen 
          name="register"
          options={{
            title: "Crear cuenta"
          }}
        />
      </Stack>
    </View>
  );
}