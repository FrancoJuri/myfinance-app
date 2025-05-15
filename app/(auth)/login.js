import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Logo from '../../components/Logo';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        router.replace('/(app)');
      }
    } catch (error) {
      Alert.alert('Error', `Ocurrio un error al iniciar sesion: ${error}`);
    } finally {
      setLoading(false);
    }
  }

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
                  value={email}
                  onChangeText={setEmail}
                  editable={!loading}
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
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                className={`w-full bg-gray-900 py-3.5 rounded-2xl ${loading ? 'opacity-50' : 'active:opacity-80'} mt-6`}
                onPress={signInWithEmail}
                disabled={loading}
              >
                <Text className="text-white text-center font-semibold">
                  {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </Text>
              </TouchableOpacity>

              <View className="flex-row justify-center gap-2 mt-6">
                <Text className="text-gray-500">
                  ¿No tienes una cuenta?
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/register')}
                  className="active:opacity-60"
                  disabled={loading}
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