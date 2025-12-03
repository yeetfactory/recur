import { Card, sampleData } from '@/components/ui/card';
import { Chart } from '@/components/ui/chart';
import { Stack } from 'expo-router';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { AddSubscriptionDialog } from '@/components/AddSubscriptionDialog';

export default function Screen() {
  return (
    <>
      <Stack.Screen />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between p-4 mt-[30px]">
          <Text className="text-3xl font-recoleta-semibold text-foreground">Recur.</Text>
          <AddSubscriptionDialog />
        </View>
        <View className="flex-1 items-center justify-center p-4">
          <View className="w-full gap-4">
            <Chart
              total={`$${sampleData
                .reduce((acc, curr) => {
                  const price = parseFloat(
                    curr.price.replace('$', '').replace('/month', '')
                  );
                  return acc + price;
                }, 0)
                .toFixed(2)}`}
            />
            {sampleData.map((card, index) => (
              <Card key={index} {...card} />
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}