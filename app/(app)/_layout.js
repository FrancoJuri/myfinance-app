import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { View } from "react-native";
import { useSelector } from "react-redux";

export default function AppLayout() {

  const { isAuthenticated, loading } = useSelector((state) => state.user);

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
  } 

  if(!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }


  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#f0f0f0",
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Controla tus gastos",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={focused ? "#000" : "#888"} />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "Historial",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? "time" : "time-outline"} size={24} color={focused ? "#000" : "#888"} />
          ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: "Asistente IA",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "chatbubble" : "chatbubble-outline"}
              size={24}
              color={focused ? "#000" : "#888"}
            />
          ),
        }}
      />

      {/* Pantallas adicionales de la navegación fuera del navbar */}
      <Tabs.Screen
        name="addExpense"
        options={{
          href: null, // Esto evita que aparezca en la navegación
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="categories"
        options={{
          href: null,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  )
}
