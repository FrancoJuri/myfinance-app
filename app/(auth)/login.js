import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { setError, setLoading, setUser } from '../../redux/slices/userSlice';
import { signInWithGoogle } from '../../services/supabase';

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    dispatch(setLoading(true));
    try {
      const { data, error } = await signInWithGoogle();
      if (error) throw error;
      
      dispatch(setUser(data.user));
      router.replace('/(app)');
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <View style={{ flex: 1 }} className="items-center justify-center bg-white p-4">
      <Text className="text-2xl font-bold mb-8">Finance App</Text>
      <TouchableOpacity 
        onPress={handleGoogleLogin}
        className="bg-blue-500 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">Iniciar sesión con Google</Text>
      </TouchableOpacity>
    </View>
  );
} 