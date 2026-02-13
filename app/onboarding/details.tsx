import React, { useState, useMemo } from 'react';
import { View, ScrollView, Pressable, FlatList, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import { ProgressDots } from '@/components/ui/progress-dots';
import { router } from 'expo-router';
import { CURRENCIES } from '@/const';
import { setUserName } from '@/actions/user';
import { setDefaultCurrency } from '@/actions/currency';
import { Currency } from '@/types';
import { ChevronDownIcon, AlertTriangleIcon, SearchIcon, CheckIcon } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function OnboardingDetails() {
  const [name, setName] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [currencySearch, setCurrencySearch] = useState('');
  const [isCurrencyDialogOpen, setIsCurrencyDialogOpen] = useState(false);
  const searchInputRef = React.useRef<TextInput>(null);

  const filteredCurrencies = useMemo(() => {
    if (!currencySearch.trim()) {
      return CURRENCIES;
    }
    const search = currencySearch.toLowerCase();
    return CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(search) ||
        c.currency.toLowerCase().includes(search) ||
        c.countries.some((country) => country.toLowerCase().includes(search))
    );
  }, [currencySearch]);

  const selectedCurrencyData = useMemo(() => {
    if (!selectedCurrency) return null;
    return CURRENCIES.find((c) => c.code === selectedCurrency);
  }, [selectedCurrency]);

  const canContinue = name.trim().length > 0 && selectedCurrency !== null;

  const handleContinue = () => {
    if (!canContinue || !selectedCurrency) return;

    setUserName(name.trim());
    setDefaultCurrency({ currency: selectedCurrency });
    router.push('/onboarding/terms');
  };

  const handleSelectCurrency = (code: Currency) => {
    setSelectedCurrency(code);
    setIsCurrencyDialogOpen(false);
    setCurrencySearch('');
  };

  React.useEffect(() => {
    if (!isCurrencyDialogOpen) return;
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 80);
    return () => clearTimeout(timer);
  }, [isCurrencyDialogOpen]);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <View className="flex-1 justify-between p-6 pt-20">
        {/* Header */}
        <View>
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <ProgressDots current={1} total={3} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Text className="mt-8 text-2xl font-semibold text-foreground">
              Tell us about yourself
            </Text>
            <Text className="mt-2 text-base text-muted-foreground">
              We'll personalize your experience based on your preferences.
            </Text>
          </Animated.View>
        </View>

        {/* Form */}
        <View className="my-8 gap-6">
          {/* Name Input */}
          <Animated.View entering={FadeInUp.delay(300).springify()}>
            <Text className="mb-2 text-sm font-medium text-foreground">Your name</Text>
            <Input
              testID="onboarding-name-input"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              className="h-14 rounded-xl text-base"
              autoCapitalize="words"
              autoCorrect={false}
            />
          </Animated.View>

          {/* Currency Selector */}
          <Animated.View entering={FadeInUp.delay(400).springify()}>
            <Text className="mb-2 text-sm font-medium text-foreground">Default currency</Text>

            <Dialog open={isCurrencyDialogOpen} onOpenChange={setIsCurrencyDialogOpen}>
              <DialogTrigger asChild>
                <Pressable
                  testID="onboarding-currency-trigger"
                  className="flex-row items-center justify-between rounded-xl border border-input bg-background p-4 dark:bg-input/30">
                  <Text
                    className={
                      selectedCurrency
                        ? 'text-base text-foreground'
                        : 'text-base text-muted-foreground/50'
                    }>
                    {selectedCurrencyData
                      ? `${selectedCurrencyData.code} - ${selectedCurrencyData.currency}`
                      : 'Select a currency'}
                  </Text>
                  <Icon as={ChevronDownIcon} className="size-5 text-muted-foreground" />
                </Pressable>
              </DialogTrigger>

              <DialogContent
                className="mx-4 w-auto max-w-none sm:max-w-none"
                overlayStyle={{ padding: 0, alignItems: 'stretch' }}
                style={{ alignSelf: 'stretch' }}>
                <DialogHeader>
                  <DialogTitle>Select Currency</DialogTitle>
                </DialogHeader>

                <View className="mt-4">
                  <View className="flex-row items-center gap-2 rounded-lg border border-input bg-background px-3 dark:bg-input/30">
                    <Icon as={SearchIcon} className="size-4 text-muted-foreground" />
                    <Input
                      testID="onboarding-currency-search"
                      ref={searchInputRef}
                      value={currencySearch}
                      onChangeText={setCurrencySearch}
                      placeholder="Search currencies..."
                      autoFocus={true}
                      className="h-10 flex-1 border-0 bg-transparent shadow-none"
                    />
                  </View>
                </View>

                <FlatList
                  data={filteredCurrencies}
                  keyExtractor={(item) => item.code}
                  className="mt-4 max-h-64"
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <Pressable
                      testID={`currency-option-${item.code}`}
                      onPress={() => handleSelectCurrency(item.code as Currency)}
                      className="flex-row items-center justify-between rounded-lg p-3 active:bg-muted">
                      <View className="flex-1">
                        <Text className="font-medium text-foreground">{item.code}</Text>
                        <Text className="text-sm text-muted-foreground">{item.currency}</Text>
                      </View>
                      {selectedCurrency === item.code && (
                        <Icon as={CheckIcon} className="size-5 text-primary" />
                      )}
                    </Pressable>
                  )}
                  ListEmptyComponent={
                    <Text className="py-4 text-center text-muted-foreground">
                      No currencies found
                    </Text>
                  }
                />
              </DialogContent>
            </Dialog>

            {/* Currency Warning */}
            <Animated.View
              entering={FadeInUp.delay(500).springify()}
              className="mt-3 flex-row items-center gap-2 rounded-lg bg-amber-500/10 p-3 dark:bg-amber-500/20">
              <Icon as={AlertTriangleIcon} className="size-4 text-amber-600 dark:text-amber-500" />
              <Text className="flex-1 text-sm text-amber-700 dark:text-amber-400">
                Currency cannot be changed later
              </Text>
            </Animated.View>
          </Animated.View>
        </View>

        {/* Continue Button */}
        <Animated.View entering={FadeInUp.delay(600).springify()}>
          <Button
            testID="onboarding-continue"
            onPress={handleContinue}
            disabled={!canContinue}
            className="h-14 rounded-xl bg-primary">
            <Text className="text-lg font-semibold text-primary-foreground">Continue</Text>
          </Button>
        </Animated.View>
      </View>
    </ScrollView>
  );
}
