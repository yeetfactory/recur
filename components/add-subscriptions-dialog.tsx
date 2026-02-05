import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { Pressable, ScrollView, View } from 'react-native';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SubscriptionFrequency } from '@/types';
import { createSubscription } from '@/actions/subscription';
import { getDefaultCurrency } from '@/actions/currency';

import { useLists } from '@/hooks/use-lists';
import { SubscriptionAvatar } from '@/components/subscription-avatar';
import { EmojiPicker } from '@/components/emoji-picker';
import { router } from 'expo-router';
import { PlusIcon } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { getCurrencySymbol } from '@/lib/currency';

interface AddSubscriptionDialogProps {
  onSubscriptionCreated?: () => void;
}

export function AddSubscriptionDialog({ onSubscriptionCreated }: AddSubscriptionDialogProps) {
  const { colorScheme } = useColorScheme();
  const [isOpen, setIsOpen] = React.useState(false);

  // Form State
  const [name, setName] = React.useState('');
  const [icon, setIcon] = React.useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [errors, setErrors] = React.useState<{ name?: string }>({});

  // Details State
  const [frequency, setFrequency] = React.useState<SubscriptionFrequency>('monthly');
  const [amount, setAmount] = React.useState('');
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);

  // List State
  const { lists, createList } = useLists();
  const [selectedListId, setSelectedListId] = React.useState<string | null>(null);

  const defaultCurrency = getDefaultCurrency() ?? 'USD';
  const currencySymbol = getCurrencySymbol(defaultCurrency);

  React.useEffect(() => {
    if (isOpen) {
      if (lists.length > 0 && !selectedListId) {
        setSelectedListId(lists[0].id);
      }
    }
  }, [isOpen, lists]);

  const resetForm = () => {
    setName('');
    setIcon(null);
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setErrors({});
  };

  const handleCreate = () => {
    if (!name.trim()) {
      setErrors({ name: 'Name is required' });
      return;
    }

    let targetListId = selectedListId;

    if (!targetListId) {
      if (lists.length > 0) {
        targetListId = lists[0].id;
      } else {
        const newList = createList('Default');
        targetListId = newList.id;
      }
    }

    try {
      createSubscription({
        name: name.trim(),
        icon,
        frequency,
        amount: parseFloat(amount) || 0,
        currency: defaultCurrency,
        isFreeTrial: false,
        listId: targetListId,
        startDate: new Date(date),
      });
      setIsOpen(false);
      resetForm();
      onSubscriptionCreated?.();
    } catch (e) {
      console.error('Failed to create subscription', e);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Pressable>
          <Ionicons
            name="add-circle-outline"
            size={36}
            color={colorScheme === 'dark' ? 'white' : 'black'}
          />
        </Pressable>
      </SheetTrigger>
      <SheetContent
        scrollable={true}
        title="Add Subscription"
        description="Enter subscription details.">
        <ScrollView
          className="flex-1 gap-4 pt-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Name and Icon Section */}
          <View className="gap-3">
            <Text className="font-recoleta-medium text-sm text-foreground">Service Name</Text>
            <View className="flex-row items-center gap-4 rounded-xl border border-border bg-card/50 p-3">
              <SubscriptionAvatar
                name={name || 'Ab'}
                icon={icon}
                size={52}
                onPress={() => setShowEmojiPicker(true)}
                showEditHint={true}
              />
              <View className="flex-1">
                <Input
                  placeholder="e.g. Netflix, Spotify"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  className="border-0 bg-transparent"
                />
              </View>
            </View>
          </View>

          <View className="mt-4 gap-6">
            {/* List Selection */}
            {lists.length > 0 && (
              <View className="gap-2">
                <Text className="font-recoleta-medium text-sm text-foreground">List</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                  <Pressable
                    onPress={() => {
                      setIsOpen(false);
                      resetForm();
                      router.push('/settings/manage-lists');
                    }}
                    className="mr-2 flex-row items-center gap-2 rounded-full border border-dashed border-brand-brown bg-card/50 px-4 py-2">
                    <Icon as={PlusIcon} className="size-4 text-muted-foreground" />
                    <Text className="text-muted-foreground">Add List</Text>
                  </Pressable>
                  {lists.map((list) => (
                    <Pressable
                      key={list.id}
                      onPress={() => setSelectedListId(list.id)}
                      className={`mr-2 rounded-full border px-4 py-2 ${
                        selectedListId === list.id
                          ? 'border-foreground bg-foreground'
                          : 'border-input bg-background'
                      }`}>
                      <Text
                        className={`${selectedListId === list.id ? 'text-background' : 'text-foreground'}`}>
                        {list.name}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Frequency Selection */}
            <View className="gap-2">
              <Text className="font-recoleta-medium text-sm text-foreground">Frequency</Text>
              <View className="flex-row gap-2">
                {(['monthly', 'yearly'] as const).map((freq) => (
                  <Button
                    key={freq}
                    variant={frequency === freq ? 'default' : 'outline'}
                    onPress={() => setFrequency(freq)}
                    className="flex-1">
                    <Text>{freq.charAt(0).toUpperCase() + freq.slice(1)}</Text>
                  </Button>
                ))}
              </View>
            </View>

            {/* Amount Input */}
            <View className="gap-2">
              <Text className="font-recoleta-medium text-sm text-foreground">Amount</Text>
              <View className="relative justify-center">
                <Text className="absolute left-3 z-10 font-recoleta-medium text-foreground">
                  {currencySymbol}
                </Text>
                <Input
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  className="pl-7"
                />
              </View>
            </View>

            {/* Date Input */}
            <View className="gap-2">
              <Text className="font-recoleta-medium text-sm text-foreground">Start Date</Text>
              <Input placeholder="YYYY-MM-DD" value={date} onChangeText={setDate} />
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3 pb-8 pt-4">
              <Button
                variant="ghost"
                className="flex-1 border border-brand-brown"
                onPress={() => setIsOpen(false)}>
                <Text>Cancel</Text>
              </Button>
              <Button
                className="flex-1 border border-brand-brown"
                onPress={handleCreate}
                disabled={!name.trim()}>
                <Text>Save Subscription</Text>
              </Button>
            </View>
          </View>
        </ScrollView>

        <EmojiPicker
          visible={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
          onSelect={setIcon}
          currentEmoji={icon}
        />
      </SheetContent>
    </Sheet>
  );
}
