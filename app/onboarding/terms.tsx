import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { router } from 'expo-router';
import { setOnboardingComplete } from '@/actions/user';
import {
  CheckIcon,
  ChevronRightIcon,
  FileTextIcon,
  ShieldIcon,
  type LucideIcon,
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

// Progress indicator component
function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          className={`h-2 rounded-full ${
            index === current
              ? 'w-6 bg-primary'
              : index < current
                ? 'w-2 bg-primary/50'
                : 'w-2 bg-muted'
          }`}
        />
      ))}
    </View>
  );
}

interface CheckboxItemProps {
  checked: boolean;
  onToggle: () => void;
  icon: LucideIcon;
  title: string;
  description: string;
  linkText: string;
  policyType: 'privacy' | 'terms';
  index: number;
}

function CheckboxItem({
  checked,
  onToggle,
  icon: IconComponent,
  title,
  description,
  linkText,
  policyType,
  index,
}: CheckboxItemProps) {
  const handleLinkPress = () => {
    router.push({ pathname: '/onboarding/policy', params: { type: policyType } });
  };

  return (
    <Animated.View entering={FadeInUp.delay(300 + index * 100).springify()}>
      <Pressable
        onPress={onToggle}
        className={`flex-row items-start gap-4 rounded-2xl border p-4 ${
          checked
            ? 'border-primary/30 bg-primary/5 dark:bg-primary/10'
            : 'border-[#502615] bg-card dark:bg-black'
        }`}>
        {/* Checkbox */}
        <View
          className={`mt-0.5 h-6 w-6 items-center justify-center rounded-md border-2 ${
            checked ? 'border-primary bg-primary' : 'border-muted-foreground/30 bg-transparent'
          }`}>
          {checked && <Icon as={CheckIcon} className="size-4 text-primary-foreground" />}
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Icon as={IconComponent} className="size-5 text-foreground" />
            <Text className="text-base font-semibold text-foreground">{title}</Text>
          </View>
          <Text className="mt-1 text-sm text-muted-foreground">{description}</Text>
          <Pressable onPress={handleLinkPress} className="mt-2 flex-row items-center gap-1">
            <Text className="text-sm font-medium text-primary">{linkText}</Text>
            <Icon as={ChevronRightIcon} className="size-3 text-primary" />
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function OnboardingTerms() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const canContinue = termsAccepted && privacyAccepted;

  const handleGetStarted = () => {
    if (!canContinue) return;

    setOnboardingComplete();
    router.replace('/(tabs)');
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}>
      <View className="flex-1 justify-between p-6 pt-20">
        {/* Header */}
        <View>
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <ProgressDots current={2} total={3} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Text className="mt-8 text-2xl font-semibold text-foreground">Almost there!</Text>
            <Text className="mt-2 text-base text-muted-foreground">
              Please review and accept our terms to start using Recur.
            </Text>
          </Animated.View>
        </View>

        {/* Checkboxes */}
        <View className="my-8 gap-4">
          <CheckboxItem
            checked={termsAccepted}
            onToggle={() => setTermsAccepted(!termsAccepted)}
            icon={FileTextIcon}
            title="Terms & Conditions"
            description="I agree to the Terms and Conditions that govern the use of this app."
            linkText="Read Terms & Conditions"
            policyType="terms"
            index={0}
          />

          <CheckboxItem
            checked={privacyAccepted}
            onToggle={() => setPrivacyAccepted(!privacyAccepted)}
            icon={ShieldIcon}
            title="Privacy Policy"
            description="I have read and understood how my data will be collected and used."
            linkText="Read Privacy Policy"
            policyType="privacy"
            index={1}
          />
        </View>

        {/* Get Started Button */}
        <Animated.View entering={FadeInUp.delay(500).springify()}>
          <Button
            onPress={handleGetStarted}
            disabled={!canContinue}
            className="h-14 rounded-xl bg-primary">
            <Text className="text-lg font-semibold text-primary-foreground">Get Started</Text>
          </Button>

          <Text className="mt-4 text-center text-xs text-muted-foreground">
            By continuing, you agree to our terms and privacy policy
          </Text>
        </Animated.View>
      </View>
    </ScrollView>
  );
}
