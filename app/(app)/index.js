import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function Dashboard() {
  const { user } = useSelector(state => state.user);

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <View className="bg-white rounded-lg p-4 mb-4">
        <Text className="text-lg font-semibold mb-2">Bienvenido, {user?.email}</Text>
        <Text className="text-gray-600">Este es tu dashboard</Text>
      </View>
      
      <View className="flex-row justify-between">
        <View className="bg-white rounded-lg p-4 flex-1 mr-2">
          <Text className="text-sm text-gray-500">Gasto Diario</Text>
          <Text className="text-lg font-bold">$0</Text>
        </View>
        
        <View className="bg-white rounded-lg p-4 flex-1 mx-2">
          <Text className="text-sm text-gray-500">Gasto Semanal</Text>
          <Text className="text-lg font-bold">$0</Text>
        </View>
        
        <View className="bg-white rounded-lg p-4 flex-1 ml-2">
          <Text className="text-sm text-gray-500">Gasto Mensual</Text>
          <Text className="text-lg font-bold">$0</Text>
        </View>
      </View>
    </View>
  );
} 