import { View, Text, ImageBackground } from "react-native";

type ChartProps = {
    total: string;
};

export const Chart = ({ total }: ChartProps) => {
    return (
        <View className="w-full h-[25vh] mb-6 shadow-lg">
            <ImageBackground
                source={require("../../assets/images/ChartBG.png")}
                className="w-full h-full rounded-2xl items-center justify-center overflow-hidden"
                resizeMode="cover"
            >
                <Text className="text-white text-lg font-medium opacity-80">Total Spending</Text>
                <Text className="text-white text-5xl font-bold mt-2">{total}</Text>
            </ImageBackground>
        </View>
    );
};
