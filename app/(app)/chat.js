import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useSelector } from "react-redux"
import { supabase } from "../../lib/supabase"

export default function Chat() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const user = useSelector((state) => state.user.user)
  const [loading, setLoading] = useState(false)
  const [lastAnalysis, setLastAnalysis] = useState(null)
  const [error, setError] = useState(null)
  const [canRequestAnalysis, setCanRequestAnalysis] = useState(true)

  useEffect(() => {
    checkLastAnalysis()
  }, [])

  const checkLastAnalysis = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_analysis')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) throw error

      if (data && data.length > 0) {
        setLastAnalysis(data[0])
        
        // Verificar si han pasado 30 días desde el último análisis
        const lastAnalysisDate = new Date(data[0].created_at)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        
        setCanRequestAnalysis(lastAnalysisDate < thirtyDaysAgo)
      }
    } catch (err) {
      console.error('Error checking last analysis:', err)
      setError('Error al cargar el análisis anterior')
    }
  }

  const handleAnalysis = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Llamar a la Edge Function
      const { data: functionData, error: functionError } = await supabase.functions.invoke('analyze-finances', {
        body: { user_id: user.id }
      })

      console.log('functionData', functionData);

      if (functionError) throw functionError;

      // Obtener el primer día del mes anterior
      const firstDayPreviousMonth = new Date()
      firstDayPreviousMonth.setMonth(firstDayPreviousMonth.getMonth() - 1)
      firstDayPreviousMonth.setDate(1)
      firstDayPreviousMonth.setHours(0, 0, 0, 0)

      const newAnalysis = {
        user_id: user.id,
        analysis_text: functionData.analysis,
        period_start: firstDayPreviousMonth.toISOString(),
        period_end: new Date().toISOString() // Día actual
      }

      // Guardar el análisis en la base de datos
      const { error: insertError } = await supabase
        .from('ai_analysis')
        .insert(newAnalysis)

      if (insertError) throw insertError

      // Actualizar el estado local directamente
      setLastAnalysis(newAnalysis)
      setCanRequestAnalysis(false)
    } catch (err) {
      console.error('Error in analysis:', err)
      setError('Error al generar el análisis')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className={`px-5 pt-6 pb-2 ${insets.top > 0 ? "mt-2" : "mt-6"} flex-row justify-between items-center`}>
        <Text className="text-2xl font-semibold">Asistente IA</Text>
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
        >
          <Ionicons name="person" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 mt-10">
        {/* Sección de Análisis */}
        <View className="items-center my-6">
          <Text className="text-lg font-semibold mb-2">Análisis Mensual con IA</Text>
          <Text className="text-gray-500 text-center mb-4">
            Obtén un análisis detallado y recomendaciones en base a tus gastos del mes actual comparados con el mes anterior.
          </Text>
          
          {error && (
            <Text className="text-red-500 text-center mb-4">{error}</Text>
          )}

          {!canRequestAnalysis && (
            <Text className="text-orange-500 text-center mb-4">
              Debes esperar 30 días desde tu último análisis para solicitar uno nuevo.
            </Text>
          )}

          <TouchableOpacity
            onPress={handleAnalysis}
            disabled={loading || !canRequestAnalysis}
            className={`px-6 py-3 rounded-md ${loading || !canRequestAnalysis ? 'bg-gray-300' : 'bg-blue-500'}`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-medium">
                {canRequestAnalysis ? 'Solicitar Análisis' : 'Análisis no disponible'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Mostrar último análisis */}
        {lastAnalysis && (
          <View className="bg-gray-50 p-6 rounded-2xl mb-6">
            <Text className="text-sm text-gray-500 mb-2">
              Análisis del {formatDate(lastAnalysis.created_at)}
            </Text>
            <Text className="text-gray-700">{lastAnalysis.analysis_text}</Text>
          </View>
        )}

        {/* Sección Chat - Próximamente */}
        <View className="items-center bg-gray-50 p-6 rounded-2xl mb-6">
          <Ionicons name="chatbubbles-outline" size={32} color="#6B7280" />
          <Text className="text-lg font-semibold mt-3 mb-2">Chat IA - Próximamente</Text>
          <Text className="text-gray-500 text-center text-sm">
            Pronto podrás chatear directamente con tu asistente financiero personal para obtener consejos y análisis en tiempo real.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}