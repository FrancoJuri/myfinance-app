import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function Dashboard() {
  // Aquí puedes traer los valores reales de tus gastos
  const daily = 624
  const weekly = 1910
  const monthly = 12012

  const router = useRouter()
  const insets = useSafeAreaInsets()

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header con más espacio y saludo más notorio */}
      <View className={`px-5 pt-6 pb-2 ${insets.top > 0 ? "mt-2" : "mt-6"} flex-row justify-between items-center`}>
        <Text className="text-2xl font-semibold">Buenos días</Text>

        {/* Icono de perfil */}
        <TouchableOpacity
          onPress={() => router.push("/(app)/profile")}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
        >
          <Ionicons name="person" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-5 justify-center relative">
        {/* Gasto Diario */}
        <View className="py-6">
          <Text className="text-gray-500 text-sm font-medium mb-2">DÍA</Text>
          <Text className="text-5xl font-bold">${daily.toLocaleString()}</Text>
        </View>

        {/* Línea separadora */}
        <View className="h-px bg-gray-200 mx-0" />

        {/* Gasto Semanal */}
        <View className="py-6">
          <Text className="text-gray-500 text-sm font-medium mb-2">SEMANA</Text>
          <Text className="text-5xl font-bold">${weekly.toLocaleString()}</Text>
        </View>

        {/* Línea separadora */}
        <View className="h-px bg-gray-200 mx-0" />

        {/* Gasto Mensual */}
        <View className="py-6">
          <Text className="text-gray-500 text-sm font-medium mb-2">MES</Text>
          <Text className="text-5xl font-bold">${monthly.toLocaleString()}</Text>
        </View>

        {/* Floating Action Button (dentro de la pantalla principal) */}
        <TouchableOpacity
          onPress={() => router.push("/(app)/addExpense")}
          className="absolute bottom-8 right-8 bg-black w-12 h-12 rounded-full justify-center items-center shadow-md"
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}