import { View, Text, ImageBackground } from 'react-native';

type ChartProps = {
  total: string;
  viewMode?: 'monthly' | 'yearly';
};

export const Chart = ({ total, viewMode = 'monthly' }: ChartProps) => {
  return (
    <View className="mb-6 h-[25vh] w-full shadow-lg">
      <ImageBackground
        source={require('../../assets/images/ChartBG.png')}
        className="h-full w-full items-center justify-center overflow-hidden rounded-2xl"
        resizeMode="cover">
        <Text className="text-lg font-medium text-white opacity-80">Total Spending</Text>
        <View className="mt-2 flex-row items-baseline">
          <Text className="text-5xl font-bold text-white">{total}</Text>
          <Text className="ml-1 text-lg font-medium text-white opacity-50">
            {viewMode === 'monthly' ? '/mo' : '/yr'}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};
