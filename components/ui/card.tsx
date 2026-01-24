import { Ionicons } from '@expo/vector-icons';
import { View, Text, useColorScheme, Image } from 'react-native';
import { Subscription } from '@/types';

type CardProps = {
  subscription: Subscription;
};

export const Card = ({ subscription }: CardProps) => {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'dark' ? 'white' : 'black';
  const { company, amount, frequency, currency } = subscription;

  return (
    <View className="flex flex-row items-center rounded-lg border border-[#502615] bg-card p-4 mb-2">
      {company.icon ? (
        <Image
          source={{ uri: company.icon }}
          style={{ width: 40, height: 40, borderRadius: 10 }}
        />
      ) : (
        <Ionicons name="cube-outline" color={iconColor} size={24} />
      )}
      <View className="ml-4 flex-1">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-base font-medium text-card-foreground">{company.name}</Text>
            <Text className="text-sm text-muted-foreground">{company.domain}</Text>
          </View>
          <View className="items-end">
            <Text className="text-base font-bold text-card-foreground">
              {currency === 'USD' ? '$' : currency}{amount.toFixed(2)}
            </Text>
            <Text className="text-xs text-muted-foreground capitalize">/{frequency}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
