import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function Chat() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className={`px-5 pt-6 pb-2 ${insets.top > 0 ? "mt-2" : "mt-6"} flex-row justify-between items-center`}>
        <Text className="text-2xl font-semibold">Asistente IA</Text>

        {/* Icono de perfil */}
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
        >
          <Ionicons name="person" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center items-center px-5">
        <Text className="text-gray-500 text-center mb-4">
          Tu asistente financiero personal. Te ayudaré a analizar tus gastos y a tomar mejores decisiones.
        </Text>
        <Text className="text-gray-400 text-sm text-center">
          &quot;Este mes gastaste más en delivery que el mes pasado.&quot;
        </Text>
      </View>
    </SafeAreaView>
  )
}