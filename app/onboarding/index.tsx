import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const STATS = [
  {
    value: '$219',
    suffix: '/mo',
    label: 'Average subscription spending',
    highlight: true,
  },
  {
    value: '$86',
    suffix: '/mo',
    label: 'What people think they spend',
    highlight: false,
  },
  {
    value: '8+',
    suffix: '',
    label: 'Subscriptions per person',
    highlight: false,
  },
  {
    value: '2.5x',
    suffix: '',
    label: 'How much we underestimate',
    highlight: true,
  },
];

function StatCard({
  value,
  suffix,
  label,
  highlight,
  index,
}: {
  value: string;
  suffix: string;
  label: string;
  highlight: boolean;
  index: number;
}) {
  return (
    <Animated.View
      entering={FadeInUp.delay(300 + index * 100).springify()}
      className={`rounded-2xl border p-4 ${
        highlight
          ? 'border-primary/30 bg-primary/10 dark:bg-primary/20'
          : 'border-[#502615] bg-card dark:bg-black'
      }`}>
      <View className="flex-row items-baseline">
        <Text
          className={`font-recoleta-semibold text-3xl ${
            highlight ? 'text-primary' : 'text-foreground'
          }`}>
          {value}
        </Text>
        {suffix && <Text className="text-lg text-muted-foreground">{suffix}</Text>}
      </View>
      <Text className="mt-1 text-sm text-muted-foreground">{label}</Text>
    </Animated.View>
  );
}

export default function OnboardingWelcome() {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}>
      <View className="flex-1 justify-between p-6 pt-20">
        {/* Hero Section */}
        <View>
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <Text className="font-recoleta-semibold text-4xl text-foreground">Recur.</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Text className="mt-4 text-2xl font-semibold text-foreground">
              Take control of your{'\n'}subscriptions
            </Text>
            <Text className="mt-2 text-base text-muted-foreground">
              Most people have no idea how much they're actually spending on subscriptions. Let's
              change that.
            </Text>
          </Animated.View>
        </View>

        {/* Stats Grid */}
        <View className="my-8">
          <Animated.View entering={FadeInUp.delay(250).springify()}>
            <Text className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              The reality of subscriptions
            </Text>
          </Animated.View>

          <View className="flex-row flex-wrap gap-3">
            {STATS.map((stat, index) => (
              <View key={index} className="w-[48%]">
                <StatCard {...stat} index={index} />
              </View>
            ))}
          </View>
        </View>

        {/* CTA */}
        <Animated.View entering={FadeInUp.delay(700).springify()}>
          <Button
            onPress={() => router.push('/onboarding/details')}
            className="h-14 rounded-xl bg-primary">
            <Text className="text-lg font-semibold text-primary-foreground">Let's get started</Text>
          </Button>

          <Text className="mt-4 text-center text-xs text-muted-foreground">
            Source: C+R Research, CNET (2024)
          </Text>
        </Animated.View>
      </View>
    </ScrollView>
  );
}
