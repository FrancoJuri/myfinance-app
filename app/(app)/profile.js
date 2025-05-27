import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { setTransactions } from "../../redux/slices/transactionsSlice";
import { setUser } from "../../redux/slices/userSlice";
import { signOut } from "../../services/supabase";

export default function Profile() {

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const onSignOut = async () => {
    await signOut();
    dispatch(setUser(null));
    dispatch(setTransactions([]));
    router.replace("/(auth)");
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className={`px-5 pt-6 pb-2 ${insets.top > 0 ? "mt-2" : "mt-6"} flex-row items-center`}>
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold">Perfil</Text>
      </View>

      <View className="px-5 pt-8">
        {/* Información del usuario */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-gray-200 items-center justify-center mb-4">
            <Ionicons name="person" size={40} color="#555" />
          </View>
          <Text className="text-xl font-bold">Tu usuario</Text>
          <Text className="text-gray-500">{user.email}</Text>
        </View>

        {/* Opciones */}
        <View className="space-y-4">
          {/* Gestionar categorías */}
          <TouchableOpacity
            onPress={() => router.push("/(app)/categories")}
            className="flex-row items-center py-4 px-4 bg-gray-100 rounded-xl"
          >
            <Ionicons name="pricetag-outline" size={24} color="#000" className="mr-3" />
            <View>
              <Text className="text-base font-medium">Gestionar categorías</Text>
              <Text className="text-gray-500 text-sm">Añadir o editar categorías de gastos</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" className="ml-auto" />
          </TouchableOpacity>

          {/* Cerrar sesión */}
          <TouchableOpacity className="flex-row items-center py-4 px-4 bg-gray-100 rounded-xl mt-3" onPress={onSignOut}>
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" className="mr-3" />
            <Text className="text-base font-medium text-red-500">Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
