import { View, Text } from "react-native";

type ChartProps = {
    total: string;
};

export const Chart = ({ total }: ChartProps) => {
    return (
        <View className="w-full h-[25vh] bg-purple-600 rounded-2xl items-center justify-center mb-6 shadow-lg">
            <Text className="text-white text-lg font-medium opacity-80">Total Spending</Text>
            <Text className="text-white text-5xl font-bold mt-2">{total}</Text>
        </View>
    );
};
