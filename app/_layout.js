import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import '../global.css';
import { supabase } from '../lib/supabase';
import { setLoading, setUser } from '../redux/slices/userSlice';
import store from '../redux/store';


function LayoutWithSession() {
  const { loading } = useSelector((state) => state.user);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}


export default function RootLayout() {

  useEffect(() => {
    store.dispatch(setLoading(true));
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        store.dispatch(setUser(session.user));
      } else {
        store.dispatch(setUser(null));
      }
      store.dispatch(setLoading(false));
    });

    // Escucha cambios en autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        store.dispatch(setUser(session.user));
      } else {
        store.dispatch(setUser(null));
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <Provider store={store}>
      <LayoutWithSession />
    </Provider>
  );
} 