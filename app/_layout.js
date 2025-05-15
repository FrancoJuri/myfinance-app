import { Redirect, Stack, router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import '../global.css';
import { supabase } from '../lib/supabase';
import { setLoading, setUser } from '../redux/slices/userSlice';
import store from '../redux/store';

function RootLayoutNav() {
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  // No realizamos redirecciones mientras está cargando
  if (loading) {
    return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
  }

  // Si está autenticado y está en cualquier ruta de auth (login o register), redirigir a app
  if (isAuthenticated && router.pathname?.startsWith('/(auth)')) {
    return <Redirect href="/(app)" />;
  }

  // Si NO está autenticado y está en rutas de app, redirigir a login
  if (!isAuthenticated && router.pathname?.startsWith('/(app)')) {
    return <Redirect href="/login" />;
  }

  return (
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
  );
}

export default function RootLayout() {
  useEffect(() => {
    // Get initial session
    store.dispatch(setLoading(true));
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        store.dispatch(setUser(session.user));
        // Si está en cualquier ruta de auth, redirigir a app
        if (router.pathname?.startsWith('/(auth)')) {
          router.replace('/(app)');
        }
      }
      store.dispatch(setLoading(false));
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        store.dispatch(setUser(session.user));
        // Si está en cualquier ruta de auth, redirigir a app
        if (router.pathname?.startsWith('/(auth)')) {
          router.replace('/(app)');
        }
      } else {
        store.dispatch(setUser(null));
        // Si está en rutas de app, redirigir a login
        if (router.pathname?.startsWith('/(app)')) {
          router.replace('/login');
        }
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
} 