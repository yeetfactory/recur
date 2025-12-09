import { Card } from '@/components/ui/card';
import { Chart } from '@/components/ui/chart';
import { Stack, useFocusEffect } from 'expo-router';
import * as React from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { AddSubscriptionDialog } from '@/components/add-subscriptions-dialog';
import { getUserName } from '@/actions/user';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
import { getSubscriptions, removeSubscription } from '@/actions/subscription';
import { Subscription } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Ionicons } from '@expo/vector-icons';

export default function Screen() {
  const userName = getUserName();
  const greeting = getGreeting();

  const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([]);
  const [subscriptionToDelete, setSubscriptionToDelete] = React.useState<Subscription | null>(null);

  const loadSubscriptions = React.useCallback(() => {
    const data = getSubscriptions();
    setSubscriptions(data);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadSubscriptions();
    }, [loadSubscriptions])
  );

  const confirmDelete = () => {
    if (subscriptionToDelete) {
      removeSubscription({ subscription: subscriptionToDelete });
      loadSubscriptions();
      setSubscriptionToDelete(null);
    }
  };

  const totalMonthly = React.useMemo(() => {
    return subscriptions.reduce((acc, curr) => {
      // Simple normalization: if yearly, divide by 12
      const amount = curr.frequency === 'yearly' ? curr.amount / 12 : curr.amount;
      return acc + amount;
    }, 0);
  }, [subscriptions]);

  const renderRightActions = (subscription: Subscription, progress: any, dragX: any) => {
    return (
      <View className="flex-row items-center justify-end pl-2 mb-2">
        <TouchableOpacity
          className="bg-destructive w-16 h-full items-center justify-center rounded-lg"
          onPress={() => setSubscriptionToDelete(subscription)}
        >
          <Ionicons name="trash-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Alert Dialog */}
      <AlertDialog open={!!subscriptionToDelete} onOpenChange={(open) => !open && setSubscriptionToDelete(null)}>
        <AlertDialogContent className="border border-[#502615]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-recoleta-medium text-foreground">Remove Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <Text className="font-bold text-foreground">{subscriptionToDelete?.company.name}</Text>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onPress={() => setSubscriptionToDelete(null)}>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={confirmDelete} className="bg-destructive">
              <Text className="text-white">Remove</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ScrollView showsVerticalScrollIndicator={false} className="bg-background">
        <View className="mt-[60px] flex-row items-center justify-between p-4 px-6">
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
              total={`$${totalMonthly.toFixed(2)}`}
            />
            {subscriptions.length === 0 ? (
              <View className="items-center justify-center p-8">
                <Text className="text-muted-foreground">No subscriptions yet.</Text>
                <Text className="text-muted-foreground text-sm">Add one to get started!</Text>
              </View>
            ) : (
              subscriptions.map((sub) => (
                <Swipeable
                  key={sub.id}
                  renderRightActions={(progress, dragX) => renderRightActions(sub, progress, dragX)}
                >
                  <Card subscription={sub} />
                </Swipeable>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
