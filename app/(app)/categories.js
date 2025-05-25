import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useSelector } from 'react-redux'
import { createCategory, deleteCategory, fetchCategories } from "../../services/supabase"


export default function Categories() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const user = useSelector((state) => state.user.user)
  const [categoryName, setCategoryName] = useState("")
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Colores predefinidos para elegir
  const colors = ["#FF3B30", "#FF9500", "#FFCC00", "#34C759", "#5AC8FA", "#007AFF", "#5856D6", "#AF52DE"]
  const [selectedColor, setSelectedColor] = useState(colors[0])

  useEffect(() => {
    if (user?.id) {
      fetchCategories({ userId: user.id, setCategories, setLoading })
    }
  }, [user?.id])

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      Alert.alert("Error", "Por favor ingresa un nombre para la categoría")
      return
    }

    setSaving(true)
    try {
      const { data, error } = await createCategory({
        userId: user.id,
        name: categoryName,
        color: selectedColor
      })

      if (error) throw error

      // Actualizar el estado local con la nueva categoría
      if (data && data[0]) {
        setCategories(currentCategories => [...currentCategories, data[0]])
      }
      
      // Limpiar formulario
      setCategoryName("")
      setSelectedColor(colors[0])
      Alert.alert("¡Éxito!", "Categoría creada correctamente")
    } catch (error) {
      console.error('Error saving category:', error)
      Alert.alert("Error", "No se pudo guardar la categoría")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    Alert.alert(
      "Eliminar categoría",
      "¿Estás seguro que deseas eliminar esta categoría?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await deleteCategory({ categoryId })
              if (error) throw error

              // Actualizar el estado local eliminando la categoría
              setCategories(currentCategories => 
                currentCategories.filter(category => category.id !== categoryId)
              )

              Alert.alert("¡Éxito!", "Categoría eliminada correctamente")
            } catch (error) {
              console.error('Error deleting category:', error)
              Alert.alert("Error", "No se pudo eliminar la categoría")
            }
          }
        }
      ]
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className={`px-5 pt-6 pb-2 ${insets.top > 0 ? "mt-2" : "mt-6"} flex-row items-center`}>
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold">Categorías</Text>
      </View>

      <ScrollView className="flex-1 px-5">
        {/* Categorías existentes */}
        <View className="py-6">
          <Text className="text-base font-medium mb-4">Categorías existentes</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : categories.length === 0 ? (
            <Text className="text-gray-500 text-center py-4">No hay categorías creadas</Text>
          ) : (
            <View className="flex-row flex-wrap">
              {categories.map((category) => (
                <View
                  key={category.id}
                  className="w-1/2 p-2"
                >
                  <View className="bg-gray-100 rounded-xl p-3 flex-row items-center">
                    <View
                      style={{ backgroundColor: category.color }}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <Text className="flex-1 font-medium">{category.name}</Text>
                    <TouchableOpacity 
                      className="p-2"
                      onPress={() => handleDeleteCategory(category.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Formulario nueva categoría */}
        <View className="py-6">
          <Text className="text-xl font-semibold mb-4">Agregar nueva categoría</Text>
          <View className="space-y-6">
            {/* Nombre de categoría */}
            <View>
              <Text className="text-base font-medium mb-2">Nombre de la categoría</Text>
              <TextInput
                className="bg-gray-100 rounded-xl text-base"
                style={{
                  height: 48,
                  paddingHorizontal: 16,
                  textAlignVertical: 'center',
                  includeFontPadding: false,
                  textAlign: 'left',
                  lineHeight: undefined
                }}
                placeholder="Ej: Comida, Transporte, Ocio..."
                placeholderTextColor="#9CA3AF"
                value={categoryName}
                onChangeText={setCategoryName}
              />
            </View>

            {/* Selector de color */}
            <View className='mt-4'>
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
            <TouchableOpacity 
              className={`bg-black py-4 rounded-xl items-center mt-4 ${saving ? 'opacity-50' : ''}`}
              onPress={handleSaveCategory}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">Guardar categoría</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
