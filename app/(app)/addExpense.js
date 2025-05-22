import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState } from "react"
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function AddExpense() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [type, setType] = useState("expense") // "expense" o "income"
  const [note, setNote] = useState("")

  // Categorías de ejemplo
  const categories = [
    { id: 1, name: "Comida", color: "#FF3B30" },
    { id: 2, name: "Transporte", color: "#FF9500" },
    { id: 3, name: "Ocio", color: "#FFCC00" },
    { id: 4, name: "Hogar", color: "#34C759" },
    { id: 5, name: "Salud", color: "#5AC8FA" },
  ]
  const [selectedCategory, setSelectedCategory] = useState(null)

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className={`px-5 pt-6 pb-2 ${insets.top > 0 ? "mt-2" : "mt-6"} flex-row items-center`}>
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold">Añadir movimiento</Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-6">
        {/* Selector de tipo */}
        <View className="flex-row bg-gray-100 rounded-xl p-1 mb-6">
          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg items-center ${type === "expense" ? "bg-black" : ""}`}
            onPress={() => setType("expense")}
          >
            <Text className={`font-medium ${type === "expense" ? "text-white" : "text-gray-500"}`}>Gasto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg items-center ${type === "income" ? "bg-black" : ""}`}
            onPress={() => setType("income")}
          >
            <Text className={`font-medium ${type === "income" ? "text-white" : "text-gray-500"}`}>Ingreso</Text>
          </TouchableOpacity>
        </View>

        {/* Monto */}
        <View className="mb-6">
          <Text className="text-base font-medium mb-2">Monto</Text>
          <View className="flex-row items-center bg-gray-100 rounded-xl px-4">
            <Text className="text-xl mr-2">$</Text>
            <TextInput
              className="flex-1 py-3 text-xl"
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        {/* Categorías */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-base font-medium">Categoría</Text>
            <TouchableOpacity onPress={() => router.push("/(app)/categories")}>
              <Text className="text-blue-500">+ Nueva</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className={`mr-3 items-center ${selectedCategory?.id === category.id ? "opacity-100" : "opacity-60"}`}
                onPress={() => setSelectedCategory(category)}
              >
                <View
                  style={{ backgroundColor: category.color }}
                  className="w-12 h-12 rounded-full items-center justify-center mb-1"
                >
                  {selectedCategory?.id === category.id && <Ionicons name="checkmark" size={20} color="white" />}
                </View>
                <Text className="text-xs">{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Nota */}
        <View className="mb-6">
          <Text className="text-base font-medium mb-2">Nota (opcional)</Text>
          <TextInput
            className="bg-gray-100 py-3 px-4 rounded-xl text-base"
            placeholder="Ej: Compra en supermercado"
            value={note}
            onChangeText={setNote}
            multiline
          />
        </View>

        {/* Fecha */}
        <TouchableOpacity className="flex-row items-center justify-between bg-gray-100 py-3 px-4 rounded-xl mb-8">
          <Text className="text-base">Hoy</Text>
          <Ionicons name="calendar-outline" size={20} color="#555" />
        </TouchableOpacity>

        {/* Botón guardar */}
        <TouchableOpacity className="bg-black py-4 rounded-xl items-center mb-8">
          <Text className="text-white font-semibold text-base">Guardar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
