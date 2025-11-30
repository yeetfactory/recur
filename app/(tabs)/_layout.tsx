import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: 'rgba(147, 51, 234, 1)',
    }}>
      <Tabs.Screen name="index" options={{
        title: 'Home', headerShown: false, tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
        ),
      }} />
      <Tabs.Screen name="settings" options={{
        title: 'Settings', headerShown: false, tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'cog' : 'cog-outline'} color={color} size={24} />
        ),
      }} />
    </Tabs>
  );
}
