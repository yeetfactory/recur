import { Ionicons } from "@expo/vector-icons";
import { View, Text, useColorScheme } from "react-native";

type CardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  name: string;
  price: string;
};

export const sampleData: CardProps[] = [
  {
    icon: "logo-youtube",
    name: "Youtube Premium",
    price: "$14.99/month",
  },
  {
    icon: "logo-reddit",
    name: "Reddit Gold",
    price: "$4.99/month",
  },
  {
    icon: "film-outline",
    name: "Netflix",
    price: "$8.99/month",
  },
  {
    icon: "logo-youtube",
    name: "Youtube Premium",
    price: "$14.99/month",
  },
  {
    icon: "logo-reddit",
    name: "Reddit Gold",
    price: "$4.99/month",
  },
  {
    icon: "film-outline",
    name: "Netflix",
    price: "$8.99/month",
  },
  {
    icon: "logo-youtube",
    name: "Youtube Premium",
    price: "$14.99/month",
  },
  {
    icon: "logo-reddit",
    name: "Reddit Gold",
    price: "$4.99/month",
  },
  {
    icon: "film-outline",
    name: "Netflix",
    price: "$8.99/month",
  },
];

export const Card = ({ icon, name, price }: CardProps) => {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'dark' ? 'white' : 'black';
  return (
    <View className="flex flex-row items-center border border-border bg-card dark:bg-black rounded-lg p-4">
      <Ionicons name={icon} color={iconColor} size={24} />
      <View className="ml-4">
        <Text className="text-sm font-medium text-card-foreground dark:text-white">{name}</Text>
        <Text className="mt-1 text-sm text-muted-foreground dark:text-gray-400">{price}</Text>
      </View>
    </View>
  );
};
