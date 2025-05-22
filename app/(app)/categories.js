import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState } from "react"
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function Categories() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [categoryName, setCategoryName] = useState("")

  // Colores predefinidos para elegir
  const colors = ["#FF3B30", "#FF9500", "#FFCC00", "#34C759", "#5AC8FA", "#007AFF", "#5856D6", "#AF52DE"]
  const [selectedColor, setSelectedColor] = useState(colors[0])

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className={`px-5 pt-6 pb-2 ${insets.top > 0 ? "mt-2" : "mt-6"} flex-row items-center`}>
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold">Añadir categoría</Text>
      </View>

      <View className="px-5 pt-8">
        {/* Formulario */}
        <View className="space-y-6">
          {/* Nombre de categoría */}
          <View>
            <Text className="text-base font-medium mb-2">Nombre de la categoría</Text>
            <TextInput
              className="bg-gray-100 py-3 px-4 rounded-xl text-base"
              placeholder="Ej: Comida, Transporte, Ocio..."
              value={categoryName}
              onChangeText={setCategoryName}
            />
          </View>

          {/* Selector de color */}
          <View>
            <Text className="text-base font-medium mb-2">Color</Text>
            <View className="flex-row flex-wrap">
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={{ backgroundColor: color }}
                  className={`w-12 h-12 rounded-full m-2 items-center justify-center ${selectedColor === color ? "border-4 border-gray-300" : ""}`}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && <Ionicons name="checkmark" size={20} color="white" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Botón guardar */}
          <TouchableOpacity className="bg-black py-4 rounded-xl items-center mt-4">
            <Text className="text-white font-semibold text-base">Guardar categoría</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
