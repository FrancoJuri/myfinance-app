import { router } from 'expo-router';
import { Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Logo from '../../components/Logo';

export default function Login() {
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        
        <View className="flex-1">
          {/* Header Content */}
          <View className="px-6 pt-20 pb-28">
            <Logo size={72} color="#ffeb3b" />
            <Text className="text-3xl font-bold text-white mb-2 mt-4">
              Inicia Sesión en My Finance
            </Text>
            <Text className="text-gray-400 text-base">
              Tu asistente inteligente para el control de gastos. Mejora tus finanzas con ayuda de la inteligencia artificial.
            </Text>
          </View>

          {/* Form Container */}
          <View className="flex-1 bg-white rounded-t-[32px] pt-8 px-6">
            <View className="space-y-6">
              <View className="space-y-2">
                <Text className="text-sm font-medium text-gray-700">
                  Email
                </Text>
                <TextInput
                  className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-900 mt-1"
                  placeholder="tu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View className="space-y-2 mt-5">
                <Text className="text-sm font-medium text-gray-700">
                  Contraseña
                </Text>
                <TextInput
                  className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-900 mt-1"
                  placeholder="••••••••"
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                className="w-full bg-gray-900 py-3.5 rounded-2xl active:opacity-80 mt-6"
              >
                <Text className="text-white text-center font-semibold">
                  Iniciar sesión
                </Text>
              </TouchableOpacity>

              <View className="flex-row justify-center gap-2 mt-6">
                <Text className="text-gray-500">
                  ¿No tienes una cuenta?
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/register')}
                  className="active:opacity-60"
                >
                  <Text className="text-gray-900 font-semibold">
                    Regístrate
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

      </TouchableWithoutFeedback>
  
    </KeyboardAvoidingView>
  );
} 