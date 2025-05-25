import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useSelector } from "react-redux"
import { fetchCategories } from "../../services/supabase"

export default function AddExpense() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [type, setType] = useState("expense") // "expense" o "income"
  const [note, setNote] = useState("")
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const user = useSelector((state) => state.user.user)

  useEffect(() => {
    if (user?.id) {
      fetchCategories({ userId: user.id, setCategories, setLoading })
    }
  }, [user?.id])


  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className={`px-5 pt-6 pb-2 ${insets.top > 0 ? "mt-2" : "mt-6"} flex-row items-center`}>
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold">Añadir Gasto</Text>
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
              className="flex-1 text-xl"
              style={{
                height: 48,
                paddingHorizontal: 16,
                textAlignVertical: 'center',
                includeFontPadding: false,
                textAlign: 'left',
                lineHeight: undefined
              }}
              placeholder="0.00"
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
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

          {loading ? (
            <ActivityIndicator size="large" color="#000" className="py-4" />
          ) : (
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
          )}
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

        {/* Botón guardar */}
        <TouchableOpacity className="bg-black py-4 rounded-xl items-center mb-8">
          <Text className="text-white font-semibold text-base">Guardar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
