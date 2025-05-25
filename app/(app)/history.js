import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"
import { formatDate } from "../../helpers/formatDate"
import { setError, setLoading, setTransactions } from "../../redux/slices/transactionsSlice"
import { fetchTransactions } from "../../services/supabase"

export default function History() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const dispatch = useDispatch()
  const [expandedTransaction, setExpandedTransaction] = useState(null)

  const user = useSelector((state) => state.user.user)
  const { movements, loading } = useSelector((state) => state.transactions)

  useEffect(() => {
    const loadTransactions = async () => {
      if (!user?.id) return;
      
      dispatch(setLoading(true));
      const { data, error } = await fetchTransactions({ userId: user.id });
      
      if (error) {
        dispatch(setError(error.message));
        dispatch(setLoading(false));
        return;
      }
      
      dispatch(setTransactions(data));
      dispatch(setLoading(false));
    };

    loadTransactions();
  }, [user?.id, dispatch]);

  const formatAmount = (amount) => {
    return amount.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className={`px-5 pt-6 pb-2 ${insets.top > 0 ? "mt-2" : "mt-6"} flex-row justify-between items-center`}>
        <Text className="text-2xl font-semibold">Historial (30 días)</Text>

        {/* Icono de perfil */}
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
        >
          <Ionicons name="person" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : movements.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">No hay gastos registrados</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-5 pt-4">
          {movements.map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              onPress={() => transaction.note ? setExpandedTransaction(expandedTransaction === transaction.id ? null : transaction.id) : null}
              className="bg-gray-50 rounded-xl p-4 mb-3"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View
                    style={{ backgroundColor: transaction.categories?.color || '#000' }}
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  >
                    <Ionicons name="pricetag" size={16} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium">{transaction.categories?.name || 'Sin categoría'}</Text>
                    <Text className="text-sm text-gray-500">{formatDate(transaction.created_at)}</Text>
                  </View>
                </View>
                <View className="items-end pr-6">
                  <Text className="font-semibold text-base">
                    ${formatAmount(transaction.amount)}
                  </Text>
                </View>
              </View>
              
              {/* Nota expandible */}
              {transaction.note && expandedTransaction === transaction.id && (
                <View className="mt-3 pt-3 border-t border-gray-200">
                  <Text className="text-gray-600">{transaction.note}</Text>
                </View>
              )}
              
              {/* Indicador de nota */}
              {transaction.note && (
                <View className="absolute top-1/2 right-3 -translate-y-1/2">
                  <Ionicons 
                    name={expandedTransaction === transaction.id ? "chevron-up" : "chevron-down"} 
                    size={16} 
                    color="#666" 
                  />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}
