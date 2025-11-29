import React from 'react';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useColorScheme } from 'nativewind';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';
import { Stack } from 'expo-router';
import { View } from 'react-native';

const SCREEN_OPTIONS = {
  title: 'Settings',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};


export default function Settings() {

  return (
    <><Stack.Screen options={SCREEN_OPTIONS} />
    <View className="flex-1 items-center justify-center">
    <Text className="text-foreground">
      Settings
    </Text>
    <Button variant="ghost">
      <ThemeToggle />
    </Button>
    </View>
    </>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}

