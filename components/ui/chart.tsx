import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import type { SubscriptionFrequency } from '@/types';

type ChartProps = {
  total: string;
  viewMode?: SubscriptionFrequency;
};

export const Chart = ({ total, viewMode = 'monthly' }: ChartProps) => {
  return (
    <View className="mb-6 h-[25vh] w-full overflow-hidden rounded-2xl shadow-lg">
      <Image
        source={require('../../assets/images/ChartBG.png')}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        contentFit="cover"
        cachePolicy="memory-disk"
      />
      <View className="h-full w-full items-center justify-center">
        <Text className="text-lg font-medium text-white opacity-80">Total Spending</Text>
        <View className="mt-2 flex-row items-baseline">
          <Text className="text-5xl font-bold text-white">{total}</Text>
          <Text className="ml-1 text-lg font-medium text-white opacity-50">
            {viewMode === 'monthly' ? '/mo' : '/yr'}
          </Text>
        </View>
      </View>
    </View>
  );
};
