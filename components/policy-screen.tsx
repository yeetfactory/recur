import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { router } from 'expo-router';
import { ArrowLeftIcon } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getPolicyContent } from '@/const/legal';

interface PolicyScreenProps {
  type: 'privacy' | 'terms';
  showHeader?: boolean;
}

export function PolicyScreen({ type, showHeader = true }: PolicyScreenProps) {
  const content = getPolicyContent(type);
  const currentYear = new Date().getFullYear();

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      {showHeader && (
        <View className="flex-row items-center gap-3 px-4 pb-4 pt-16">
          <Pressable
            testID="policy-back"
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Icon as={ArrowLeftIcon} className="size-5 text-foreground" />
          </Pressable>
          <Text className="font-recoleta-semibold text-xl text-foreground">{content.title}</Text>
        </View>
      )}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        <Text className="mb-6 text-sm text-muted-foreground">
          Last updated: {content.lastUpdated} • Version {content.version}
        </Text>

        {content.sections.map((section, index) => (
          <Animated.View
            key={section.title}
            entering={FadeInDown.delay(100 * index).springify()}
            className="mb-6">
            <Text className="mb-2 text-lg font-semibold text-foreground">{section.title}</Text>
            <Text className="text-base leading-6 text-foreground/80">{section.content}</Text>
          </Animated.View>
        ))}

        <Text className="mt-4 text-center text-sm text-muted-foreground">
          © {currentYear} YeetFactory. All rights reserved.
        </Text>
      </ScrollView>
    </View>
  );
}
