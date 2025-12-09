import { Card } from '@/components/ui/card';
import { Chart } from '@/components/ui/chart';
import { Stack, useFocusEffect } from 'expo-router';
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
import { getSubscriptions } from '@/actions/subscription';
import { Subscription } from '@/types';

export default function Screen() {
  const userName = getUserName();
  const greeting = getGreeting();

  const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadSubscriptions = () => {
        const data = getSubscriptions();
        setSubscriptions(data);
      };
      loadSubscriptions();
    }, [])
  );

  const totalMonthly = React.useMemo(() => {
    return subscriptions.reduce((acc, curr) => {
      // Simple normalization: if yearly, divide by 12
      const amount = curr.frequency === 'yearly' ? curr.amount / 12 : curr.amount;
      return acc + amount;
    }, 0);
  }, [subscriptions]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false} className="bg-background">
        <View className="mt-[60px] flex-row items-center justify-between p-4 px-6">
          <View>
            <Text className="text-base text-muted-foreground">{greeting},</Text>
            <Text className="font-recoleta-bold text-3xl text-foreground">
              {userName || 'there'} 👋
            </Text>
          </View>
          <AddSubscriptionDialog />
        </View>
        <View className="flex-1 items-center justify-center p-4">
          <View className="w-full gap-4">
            <Chart
              total={`$${totalMonthly.toFixed(2)}`}
            />
            {subscriptions.length === 0 ? (
              <View className="items-center justify-center p-8">
                <Text className="text-muted-foreground">No subscriptions yet.</Text>
                <Text className="text-muted-foreground text-sm">Add one to get started!</Text>
              </View>
            ) : (
              subscriptions.map((sub) => (
                <Card key={sub.id} subscription={sub} />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
