import * as React from 'react';
import { useColorScheme } from 'nativewind';
import { Platform, Pressable, View, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SUBSCRIPTION_FREQUENCIES, SubscriptionFrequency, Subscription } from '@/types';
import { updateSubscription } from '@/actions/subscription';

import { useLists } from '@/hooks/use-lists';
import { SubscriptionAvatar } from '@/components/subscription-avatar';
import { EmojiPicker } from '@/components/emoji-picker';
import { router } from 'expo-router';
import { PlusIcon, ChevronDownIcon, CheckIcon, ListIcon } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { getCurrencySymbol } from '@/lib/currency';
import { formatDateInput, parseAmount, parseDateInput, todayDateInput } from '@/lib/validation';
import { toTestIdSegment } from '@/lib/utils';

interface EditSubscriptionDialogProps {
  subscription: Subscription | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

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
  const [errors, setErrors] = React.useState<{ name?: string; amount?: string; date?: string }>({});

  // Details State
  const [frequency, setFrequency] = React.useState<SubscriptionFrequency>('monthly');
  const [amount, setAmount] = React.useState('');
  const [date, setDate] = React.useState('');
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [isListDialogOpen, setIsListDialogOpen] = React.useState(false);

  // List State
  const { lists } = useLists();
  const [selectedListId, setSelectedListId] = React.useState<string | null>(null);

  const currencySymbol = React.useMemo(
    () => getCurrencySymbol(subscription?.currency),
    [subscription?.currency]
  );
  const isUpdateDisabled =
    !name.trim() || parseAmount(amount) === null || parseDateInput(date) === null;
  const { colorScheme } = useColorScheme();

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
            {errors.name ? <Text className="text-sm text-destructive">{errors.name}</Text> : null}
          </View>

          <View className="mt-4 gap-6">
            {/* List Selection */}
            {lists.length > 0 && (
              <View className="gap-2">
                <Text className="font-recoleta-medium text-sm text-foreground">List</Text>

                <Dialog open={isListDialogOpen} onOpenChange={setIsListDialogOpen}>
                  <DialogTrigger asChild>
                    <Pressable
                      testID="edit-subscription-list-trigger"
                      className="flex-row items-center justify-between rounded-md border border-input bg-background/50 px-3 py-2.5 shadow-sm shadow-black/5 dark:bg-input/30">
                      <View className="flex-row items-center gap-2">
                        <Icon as={ListIcon} className="size-4 text-muted-foreground" />
                        <Text className="text-base text-foreground sm:text-sm">
                          {selectedListId
                            ? lists.find((l) => l.id === selectedListId)?.name
                            : 'Select a List...'}
                        </Text>
                      </View>
                      <Icon as={ChevronDownIcon} className="size-4 text-muted-foreground" />
                    </Pressable>
                  </DialogTrigger>

                  <DialogContent
                    className="mx-4 w-auto max-w-none sm:max-w-none"
                    overlayStyle={{ padding: 0, alignItems: 'stretch' }}
                    style={{ alignSelf: 'stretch' }}>
                    <DialogHeader>
                      <DialogTitle>Select a List</DialogTitle>
                    </DialogHeader>

                    <ScrollView className="mt-4 max-h-80" showsVerticalScrollIndicator={true}>
                      {lists.map((list) => (
                        <Pressable
                          key={list.id}
                          testID={`edit-subscription-list-${toTestIdSegment(list.name)}`}
                          onPress={() => {
                            setSelectedListId(selectedListId === list.id ? null : list.id);
                            setIsListDialogOpen(false);
                          }}
                          className="flex-row items-center justify-between rounded-lg p-3 active:bg-muted">
                          <Text className="font-medium text-foreground">{list.name}</Text>
                          {selectedListId === list.id && (
                            <Icon as={CheckIcon} className="size-5 text-primary" />
                          )}
                        </Pressable>
                      ))}
                      <View className="my-2 h-[1px] bg-border" />
                      <Pressable
                        testID="edit-subscription-manage-lists"
                        onPress={() => {
                          setIsListDialogOpen(false);
                          onOpenChange(false);
                          router.push('/settings/manage-lists');
                        }}
                        className="flex-row items-center gap-2 p-3 active:opacity-70">
                        <View className="rounded-full bg-primary/10 p-1">
                          <Icon as={PlusIcon} className="size-4 text-primary" />
                        </View>
                        <Text className="font-medium text-primary">Create New List</Text>
                      </Pressable>
                    </ScrollView>
                  </DialogContent>
                </Dialog>
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
                  inputMode="decimal"
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

              {Platform.OS === 'ios' ? (
                <View className="h-10 flex-row items-center justify-start">
                  <DateTimePicker
                    testID="edit-subscription-date-picker"
                    value={parseDateInput(date) || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      if (selectedDate) {
                        const isoString = selectedDate.toISOString().split('T')[0];
                        setDate(isoString);
                        if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
                      }
                    }}
                    themeVariant={colorScheme ?? 'light'}
                  />
                </View>
              ) : (
                <>
                  <Pressable
                    onPress={() => setShowDatePicker(true)}
                    className="flex h-10 w-full flex-row items-center rounded-md border border-input bg-background/50 px-3 py-1 shadow-sm shadow-black/5 dark:bg-input/30">
                    <Text className="text-base text-foreground sm:text-sm">{date}</Text>
                  </Pressable>

                  {showDatePicker && (
                    <DateTimePicker
                      testID="edit-subscription-date-picker"
                      value={parseDateInput(date) || new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (event.type === 'set' && selectedDate) {
                          const isoString = selectedDate.toISOString().split('T')[0];
                          setDate(isoString);
                          if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
                        }
                      }}
                    />
                  )}
                </>
              )}
              {errors.date ? <Text className="text-sm text-destructive">{errors.date}</Text> : null}
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3 pb-8 pt-4">
              <Button
                testID="edit-subscription-cancel"
                variant="ghost"
                className="flex-1 border border-brand-brown/20"
                onPress={() => onOpenChange(false)}>
                <Text>Cancel</Text>
              </Button>
              <Button
                testID="edit-subscription-update"
                className="flex-1 border border-brand-brown/20"
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
