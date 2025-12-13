import { Card, sampleData } from '@/components/ui/card';
import { Chart } from '@/components/ui/chart';
import { Stack } from 'expo-router';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { AddSubscriptionDialog } from '@/components/add-subscriptions-dialog';
import { getUserName } from '@/actions/user';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Screen() {
  const userName = getUserName();
  const greeting = getGreeting();

  return (
    <>
      <Stack.Screen />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mt-[30px] flex-row items-center justify-between p-4">
          <View>
            <Text className="text-base text-muted-foreground">{greeting},</Text>
            <Text className="font-recoleta-semibold text-3xl text-foreground">
              {userName || 'there'} 👋
            </Text>
          </View>
          <AddSubscriptionDialog />
        </View>
        <View className="flex-1 items-center justify-center p-4">
          <View className="w-full gap-4">
            <Chart
              total={`$${sampleData
                .reduce((acc, curr) => {
                  const price = parseFloat(curr.price.replace('$', '').replace('/month', ''));
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
