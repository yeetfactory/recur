import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SUBSCRIPTION_FREQUENCIES, SubscriptionFrequency, Subscription } from '@/types';
import { updateSubscription } from '@/actions/subscription';

import { useLists } from '@/hooks/use-lists';
import { SubscriptionAvatar } from '@/components/subscription-avatar';
import { EmojiPicker } from '@/components/emoji-picker';
import { router } from 'expo-router';
import { PlusIcon } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { getCurrencySymbol } from '@/lib/currency';
import { formatDateInput, parseAmount, parseDateInput, todayDateInput } from '@/lib/validation';

interface EditSubscriptionDialogProps {
  subscription: Subscription | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

const toTestIdSegment = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export function EditSubscriptionDialog({
  subscription,
  open,
  onOpenChange,
  onUpdate,
}: EditSubscriptionDialogProps) {
  // Form State
  const [name, setName] = React.useState('');
  const [icon, setIcon] = React.useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [errors, setErrors] = React.useState<{ name?: string; amount?: string; date?: string }>(
    {}
  );

  // Details State
  const [frequency, setFrequency] = React.useState<SubscriptionFrequency>('monthly');
  const [amount, setAmount] = React.useState('');
  const [date, setDate] = React.useState('');

  // List State
  const { lists, createList } = useLists();
  const [selectedListId, setSelectedListId] = React.useState<string | null>(null);

  const currencySymbol = React.useMemo(
    () => getCurrencySymbol(subscription?.currency),
    [subscription?.currency]
  );
  const isUpdateDisabled =
    !name.trim() || parseAmount(amount) === null || parseDateInput(date) === null;

  React.useEffect(() => {
    if (open && subscription) {
      // Pre-fill data
      setName(subscription.name);
      setIcon(subscription.icon);
      setFrequency(subscription.frequency);
      setAmount(subscription.amount.toString());

      const formattedDate = formatDateInput(subscription.startDate) || todayDateInput();
      setDate(formattedDate);

      const listId =
        subscription.listId && lists.some((list) => list.id === subscription.listId)
          ? subscription.listId
          : lists.length > 0
            ? lists[0].id
            : null;
      setSelectedListId(listId);
      setErrors({});
    }
  }, [open, subscription, lists]);

  const handleUpdate = () => {
    if (!name.trim() || !subscription) return;

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

    if (!targetListId) {
      if (lists.length > 0) {
        targetListId = lists[0].id;
      } else {
        const newList = createList('Default');
        targetListId = newList.id;
      }
    }

    try {
      updateSubscription({
        subscription: {
          ...subscription,
          name: name.trim(),
          icon,
          frequency,
          amount: parsedAmount,
          currency: subscription.currency,
          listId: targetListId,
          startDate: parsedDate,
        },
      });
      onOpenChange(false);
      if (onUpdate) onUpdate();
    } catch (e) {
      console.error('Failed to update subscription', e);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        scrollable={true}
        title="Edit Subscription"
        description="Update your subscription details.">
        <ScrollView
          className="flex-1 gap-4 pt-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Name and Icon Section */}
          <View className="gap-3">
            <Text className="font-recoleta-medium text-sm text-foreground">Service Name</Text>
            <View className="flex-row items-center gap-4 rounded-xl border border-border bg-card/50 p-3">
              <SubscriptionAvatar
                testID="edit-subscription-avatar"
                name={name || 'Ab'}
                icon={icon}
                size={52}
                onPress={() => setShowEmojiPicker(true)}
                showEditHint={true}
              />
              <View className="flex-1">
                <Input
                  testID="edit-subscription-name-input"
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
            {errors.name && <Text className="text-sm text-destructive">{errors.name}</Text>}
          </View>

          <View className="mt-4 gap-6">
            {/* List Selection */}
            {lists.length > 0 && (
              <View className="gap-2">
                <Text className="font-recoleta-medium text-sm text-foreground">List</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                  <Pressable
                    testID="edit-subscription-manage-lists"
                    onPress={() => {
                      onOpenChange(false);
                      router.push('/settings/manage-lists');
                    }}
                    className="mr-2 flex-row items-center gap-2 rounded-full border border-dashed border-brand-brown bg-card/50 px-4 py-2">
                    <Icon as={PlusIcon} className="size-4 text-muted-foreground" />
                    <Text className="text-muted-foreground">Add List</Text>
                  </Pressable>
                  {lists.map((list) => (
                    <Pressable
                      key={list.id}
                      testID={`edit-subscription-list-${toTestIdSegment(list.name)}`}
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
                {SUBSCRIPTION_FREQUENCIES.map((freq) => (
                  <Button
                    key={freq}
                    testID={`edit-subscription-frequency-${freq}`}
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
                  testID="edit-subscription-amount-input"
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
              {errors.amount && <Text className="text-sm text-destructive">{errors.amount}</Text>}
            </View>

            {/* Date Input */}
            <View className="gap-2">
              <Text className="font-recoleta-medium text-sm text-foreground">Start Date</Text>
              <Input
                testID="edit-subscription-date-input"
                placeholder="YYYY-MM-DD"
                value={date}
                onChangeText={(value) => {
                  setDate(value);
                  if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
                }}
              />
              {errors.date && <Text className="text-sm text-destructive">{errors.date}</Text>}
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3 pb-8 pt-4">
              <Button
                testID="edit-subscription-cancel"
                variant="ghost"
                className="flex-1 border border-brand-brown"
                onPress={() => onOpenChange(false)}>
                <Text>Cancel</Text>
              </Button>
              <Button
                testID="edit-subscription-update"
                className="flex-1 border border-brand-brown"
                onPress={handleUpdate}
                disabled={isUpdateDisabled}>
                <Text>Update</Text>
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
