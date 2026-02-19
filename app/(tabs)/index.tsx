import { Card } from '@/components/ui/card';
import { Chart } from '@/components/ui/chart';
import { Stack, useFocusEffect } from 'expo-router';
import * as React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { AddSubscriptionDialog } from '@/components/add-subscriptions-dialog';
import { EditSubscriptionDialog } from '@/components/edit-subscription-dialog';
import { getUserName } from '@/actions/user';
import { getSubscriptions, removeSubscription, saveSubscriptions } from '@/actions/subscription';
import { getDefaultCurrency } from '@/actions/currency';

import { useLists } from '@/hooks/use-lists';
import { SUBSCRIPTION_FREQUENCIES, Subscription, SubscriptionFrequency } from '@/types';
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
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { getCurrencySymbol } from '@/lib/currency';
import { toTestIdSegment } from '@/lib/utils';

// Hoisted styles for list performance (avoid inline objects in renderItem)
const listItemPadding = { paddingHorizontal: 16 };
const draggableContainerStyle = { flex: 1, backgroundColor: 'transparent' };
const draggableContentContainerStyle = { paddingBottom: 100 };

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Screen() {
  const userName = getUserName();
  const greeting = getGreeting();

  const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([]);
  const { lists, fetchLists } = useLists();
  const [selectedListId, setSelectedListId] = React.useState<string | null>(null);
  const [subscriptionToDelete, setSubscriptionToDelete] = React.useState<Subscription | null>(null);
  const [editingSubscription, setEditingSubscription] = React.useState<Subscription | null>(null);
  const [viewMode, setViewMode] = React.useState<SubscriptionFrequency>('monthly');
  const defaultCurrency = getDefaultCurrency() ?? 'USD';
  const currencySymbol = getCurrencySymbol(defaultCurrency);

  React.useEffect(() => {
    if (selectedListId && !lists.some((list) => list.id === selectedListId)) {
      setSelectedListId(null);
    }
  }, [lists, selectedListId]);

  const loadData = React.useCallback(() => {
    const subsData = getSubscriptions();
    setSubscriptions(subsData);
    fetchLists();
  }, [fetchLists]);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [loadData])
  );

  const confirmDelete = () => {
    if (subscriptionToDelete) {
      removeSubscription({ subscription: subscriptionToDelete });
      loadData();
      setSubscriptionToDelete(null);
    }
  };

  const handleDragEnd = ({ data }: { data: Subscription[] }) => {
    // Only update order if we are showing all subscriptions
    if (selectedListId === null) {
      setSubscriptions(data);
      saveSubscriptions(data);
    }
  };

  const filteredSubscriptions = React.useMemo(() => {
    if (!selectedListId) return subscriptions;
    return subscriptions.filter((sub) => sub.listId === selectedListId);
  }, [subscriptions, selectedListId]);

  const totalAmount = React.useMemo(() => {
    return filteredSubscriptions.reduce((acc, curr) => {
      let amount = curr.amount;
      if (viewMode === 'monthly' && curr.frequency === 'yearly') {
        amount = curr.amount / 12;
      } else if (viewMode === 'yearly' && curr.frequency === 'monthly') {
        amount = curr.amount * 12;
      }
      return acc + amount;
    }, 0);
  }, [filteredSubscriptions, viewMode]);

  const renderItem = React.useCallback(
    ({ item, drag, isActive }: RenderItemParams<Subscription>) => {
      return (
        <ScaleDecorator>
          <View style={listItemPadding}>
            <Card
              subscription={item}
              onEdit={() => setEditingSubscription(item)}
              onDelete={() => setSubscriptionToDelete(item)}
              drag={selectedListId === null ? drag : undefined}
              isActive={isActive}
              viewMode={viewMode}
            />
          </View>
        </ScaleDecorator>
      );
    },
    [selectedListId, viewMode]
  );

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Alert Dialog */}
      <AlertDialog
        open={!!subscriptionToDelete}
        onOpenChange={(open) => !open && setSubscriptionToDelete(null)}>
        <AlertDialogContent className="border border-brand-brown">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-recoleta-medium text-foreground">
              Remove Subscription?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{' '}
              <Text className="font-bold text-foreground">{subscriptionToDelete?.name}</Text>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onPress={() => setSubscriptionToDelete(null)}>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction
              testID="subscription-delete-confirm"
              onPress={confirmDelete}
              className="bg-destructive">
              <Text className="text-white">Remove</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DraggableFlatList
        data={filteredSubscriptions}
        onDragEnd={handleDragEnd}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        containerStyle={draggableContainerStyle}
        contentContainerStyle={draggableContentContainerStyle}
        showsVerticalScrollIndicator={false}
        activationDistance={20}
        autoscrollThreshold={50}
        autoscrollSpeed={100}
        ListHeaderComponent={
          <View className="bg-background">
            <View className="mt-[60px] flex-row items-center justify-between p-4 px-6">
              <View>
                <Text className="text-base text-muted-foreground">{greeting},</Text>
                <Text className="font-recoleta-semibold text-3xl text-foreground">
                  {userName || 'there'} 👋
                </Text>
              </View>
              <AddSubscriptionDialog onSubscriptionCreated={loadData} />
            </View>

            <View className="gap-4 px-4 pb-4">
              {/* View Mode Toggle */}
              <View className="flex-row justify-center">
                <View className="flex-row rounded-full border border-border bg-card p-1">
                  {SUBSCRIPTION_FREQUENCIES.map((mode) => (
                    <Text
                      testID={`view-mode-${mode}`}
                      key={mode}
                      onPress={() => setViewMode(mode)}
                      className={`overflow-hidden rounded-full px-6 py-2 text-sm font-medium ${
                        viewMode === mode
                          ? 'bg-foreground text-background'
                          : 'text-muted-foreground'
                      }`}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Text>
                  ))}
                </View>
              </View>

              <Chart total={`${currencySymbol}${totalAmount.toFixed(2)}`} viewMode={viewMode} />

              {/* Filter Chips */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row"
                contentContainerStyle={{ gap: 8 }}>
                <Pressable
                  testID="filter-chip-all"
                  onPress={() => setSelectedListId(null)}
                  className={`rounded-full border px-4 py-1.5 ${
                    selectedListId === null
                      ? 'border-foreground bg-foreground'
                      : 'border-input bg-background'
                  }`}>
                  <Text
                    className={`text-sm font-medium ${
                      selectedListId === null ? 'text-background' : 'text-foreground'
                    }`}>
                    All
                  </Text>
                </Pressable>
                {lists.map((list) => (
                  <Pressable
                    key={list.id}
                    testID={`filter-chip-${toTestIdSegment(list.name)}`}
                    onPress={() => setSelectedListId(list.id)}
                    className={`rounded-full border px-4 py-1.5 ${
                      selectedListId === list.id
                        ? 'border-foreground bg-foreground'
                        : 'border-input bg-background'
                    }`}>
                    <Text
                      className={`text-sm font-medium ${
                        selectedListId === list.id ? 'text-background' : 'text-foreground'
                      }`}>
                      {list.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {filteredSubscriptions.length === 0 && (
              <View className="items-center justify-center p-8">
                <Text className="text-muted-foreground">
                  {selectedListId ? 'No subscriptions in this list.' : 'No subscriptions yet.'}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {selectedListId ? 'Add a subscription to this list.' : 'Add one to get started!'}
                </Text>
              </View>
            )}
          </View>
        }
      />

      {/* Edit Subscription Dialog */}
      <EditSubscriptionDialog
        open={!!editingSubscription}
        onOpenChange={(open) => !open && setEditingSubscription(null)}
        subscription={editingSubscription}
        onUpdate={() => {
          loadData();
          setEditingSubscription(null);
        }}
      />
    </View>
  );
}
