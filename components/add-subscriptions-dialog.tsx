import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { Pressable, ScrollView, View } from 'react-native';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SUBSCRIPTION_FREQUENCIES, SubscriptionFrequency } from '@/types';
import { createSubscription } from '@/actions/subscription';
import { getDefaultCurrency } from '@/actions/currency';

import { useLists } from '@/hooks/use-lists';
import { SubscriptionAvatar } from '@/components/subscription-avatar';
import { EmojiPicker } from '@/components/emoji-picker';
import { router } from 'expo-router';
import { PlusIcon } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { getCurrencySymbol } from '@/lib/currency';
import { parseAmount, parseDateInput, todayDateInput } from '@/lib/validation';
import { toTestIdSegment } from '@/lib/utils';

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
  const [errors, setErrors] = React.useState<{ name?: string; amount?: string; date?: string }>({});

  // Details State
  const [frequency, setFrequency] = React.useState<SubscriptionFrequency>('monthly');
  const [amount, setAmount] = React.useState('');
  const [date, setDate] = React.useState(todayDateInput());

  // List State
  const { lists } = useLists();
  const [selectedListId, setSelectedListId] = React.useState<string | null>(null);

  const defaultCurrency = getDefaultCurrency() ?? 'USD';
  const currencySymbol = getCurrencySymbol(defaultCurrency);
  const isSaveDisabled =
    !name.trim() || parseAmount(amount) === null || parseDateInput(date) === null;

  const resetForm = React.useCallback(() => {
    setName('');
    setIcon(null);
    setAmount('');
    setDate(todayDateInput());
    setErrors({});
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      if (lists.length > 0) {
        const hasSelected = selectedListId
          ? lists.some((list) => list.id === selectedListId)
          : false;
        if (!hasSelected) {
          setSelectedListId(null);
        }
      } else {
        setSelectedListId(null);
      }
    } else {
      resetForm();
    }
  }, [isOpen, lists, resetForm, selectedListId]);

  const handleCreate = () => {
    const nextErrors: { name?: string; amount?: string; date?: string } = {};
    if (!name.trim()) nextErrors.name = 'Name is required';
    const parsedAmount = parseAmount(amount);
    if (parsedAmount === null) nextErrors.amount = 'Enter a valid amount';
    const parsedDate = parseDateInput(date);
    if (!parsedDate) nextErrors.date = 'Use YYYY-MM-DD';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    if (parsedAmount === null || !parsedDate) {
      return;
    }

    let targetListId = selectedListId;

    try {
      createSubscription({
        name: name.trim(),
        icon,
        frequency,
        amount: parsedAmount,
        currency: defaultCurrency,
        listId: targetListId,
        startDate: parsedDate,
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
        <Pressable testID="add-subscription-open">
          <Ionicons name="add-circle" size={38} color="#D4531D" />
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
                testID="add-subscription-avatar"
                name={name || 'Ab'}
                icon={icon}
                size={52}
                onPress={() => setShowEmojiPicker(true)}
                showEditHint={true}
              />
              <View className="flex-1">
                <Input
                  testID="add-subscription-name-input"
                  placeholder="e.g. Netflix, Spotify"
                  value={name}
                  onChangeText={(value) => {
                    setName(value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  autoCapitalize="words"
                  className="border-0 bg-transparent"
                />
              </View>
            </View>
            {errors.name ? <Text className="text-sm text-destructive">{errors.name}</Text> : null}
          </View>

          <View className="mt-4 gap-6">
            {/* List Selection */}
            {lists.length > 0 && (
              <View className="gap-2">
                <Text className="font-recoleta-medium text-sm text-foreground">List</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                  <Pressable
                    testID="add-subscription-manage-lists"
                    onPress={() => {
                      setIsOpen(false);
                      resetForm();
                      router.push('/settings/manage-lists');
                    }}
                    className="mr-2 flex-row items-center gap-2 rounded-full border border-dashed border-brand-brown/30 bg-card/50 px-4 py-2">
                    <Icon as={PlusIcon} className="size-4 text-muted-foreground" />
                    <Text className="text-muted-foreground">Add List</Text>
                  </Pressable>
                  {lists.map((list) => (
                    <Pressable
                      key={list.id}
                      testID={`add-subscription-list-${toTestIdSegment(list.name)}`}
                      onPress={() => setSelectedListId(selectedListId === list.id ? null : list.id)}
                      className={`mr-2 rounded-full border px-4 py-2 ${selectedListId === list.id
                        ? 'border-primary bg-primary'
                        : 'border-input bg-background'
                        }`}>
                      <Text
                        className={`${selectedListId === list.id ? 'text-primary-foreground' : 'text-foreground'}`}>
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
                {SUBSCRIPTION_FREQUENCIES.map((freq) => (
                  <Button
                    key={freq}
                    testID={`add-subscription-frequency-${freq}`}
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
                  testID="add-subscription-amount-input"
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={(value) => {
                    setAmount(value);
                    if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
                  }}
                  className="pl-7"
                />
              </View>
              {errors.amount ? (
                <Text className="text-sm text-destructive">{errors.amount}</Text>
              ) : null}
            </View>

            {/* Date Input */}
            <View className="gap-2">
              <Text className="font-recoleta-medium text-sm text-foreground">Start Date</Text>
              <Input
                testID="add-subscription-date-input"
                placeholder="YYYY-MM-DD"
                value={date}
                onChangeText={(value) => {
                  setDate(value);
                  if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
                }}
              />
              {errors.date ? <Text className="text-sm text-destructive">{errors.date}</Text> : null}
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3 pb-8 pt-4">
              <Button
                testID="add-subscription-cancel"
                variant="ghost"
                className="flex-1 border border-brand-brown/20"
                onPress={() => setIsOpen(false)}>
                <Text>Cancel</Text>
              </Button>
              <Button
                testID="add-subscription-save"
                className="flex-1 border border-brand-brown/20"
                onPress={handleCreate}
                disabled={isSaveDisabled}>
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
