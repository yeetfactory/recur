import React from 'react';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useColorScheme } from 'nativewind';
import { MoonStarIcon, SunIcon, BellIcon, ShieldIcon, InfoIcon, ChevronRightIcon } from 'lucide-react-native';
import { Stack } from 'expo-router';
import { View, ScrollView, TouchableOpacity } from 'react-native';

const SCREEN_OPTIONS = {
  title: 'Settings',
  headerTransparent: true,
};

export default function Settings() {
  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <ScrollView>
        <View className="flex-1 p-4 mt-[100px] gap-6">
          <SettingsSection title="Appearance">
            <ThemeToggleItem />
          </SettingsSection>

          <SettingsSection title="General">
            <SettingsItem icon={BellIcon} label="Notifications" />
            <SettingsItem icon={ShieldIcon} label="Privacy & Security" />
          </SettingsSection>

          <SettingsSection title="About">
            <SettingsItem icon={InfoIcon} label="About App" value="v0.0.1" />
          </SettingsSection>
        </View>
      </ScrollView>
    </>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-2">
      <Text className="text-muted-foreground ml-1 text-sm font-medium uppercase tracking-wider">
        {title}
      </Text>
      <View className="gap-3">
        {children}
      </View>
    </View>
  );
}

function SettingsItem({ icon: IconComponent, label, value, onPress }: { icon: any, label: string, value?: string, onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View className="flex-row items-center justify-between border border-[#502615] bg-card dark:bg-black rounded-lg p-4">
        <View className="flex-row items-center gap-3">
          <View className="p-2 bg-muted rounded-md">
            <Icon as={IconComponent} className="size-5 text-foreground" />
          </View>
          <Text className="font-medium text-card-foreground dark:text-white">
            {label}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          {value && (
            <Text className="text-muted-foreground text-sm">
              {value}
            </Text>
          )}
          <Icon as={ChevronRightIcon} className="size-4 text-muted-foreground" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggleItem() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity onPress={toggleColorScheme} activeOpacity={0.7}>
      <View className="flex-row items-center justify-between border border-[#502615] bg-card dark:bg-black rounded-lg p-4">
        <View className="flex-row items-center gap-3">
          <View className="p-2 bg-muted rounded-md">
            <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5 text-foreground" />
          </View>
          <View>
            <Text className="font-medium text-card-foreground dark:text-white">
              Theme
            </Text>
            <Text className="text-sm text-muted-foreground">
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </Text>
          </View>
        </View>
        <Button
          onPress={toggleColorScheme}
          variant="ghost"
          size="sm"
          className="h-8 px-3"
        >
          <Text className="text-primary font-medium">
            Toggle
          </Text>
        </Button>
      </View>
    </TouchableOpacity>
  );
}

