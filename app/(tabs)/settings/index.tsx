import React from 'react';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { useColorScheme } from 'nativewind';
import {
  MoonStarIcon,
  SunIcon,
  ShieldIcon,
  InfoIcon,
  ChevronRightIcon,
  ListIcon,
  StarIcon,
  ShareIcon,
  FileTextIcon,
} from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { View, ScrollView, Pressable, Linking, Share, Platform } from 'react-native';
import Constants from 'expo-constants';
import { CURRENCIES } from '@/const';
import { getUserName } from '@/actions/user';
import { getDefaultCurrency } from '@/actions/currency';

const SCREEN_OPTIONS = {
  title: 'Settings',
  headerTransparent: true,
};

function ProfileCard() {
  const userName = getUserName();
  const currency = getDefaultCurrency();
  const currencyData = CURRENCIES.find((c) => c.code === currency);
  const initial = userName ? userName.charAt(0).toUpperCase() : '?';

  return (
    <View className="rounded-2xl border border-brand-brown/20 bg-card p-5">
      <View className="flex-row items-center gap-4">
        {/* Avatar */}
        <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
          <Text className="font-recoleta-semibold text-2xl text-primary-foreground">{initial}</Text>
        </View>

        {/* Info */}
        <View className="flex-1">
          <Text className="font-recoleta-semibold text-xl text-foreground">
            {userName || 'User'}
          </Text>
          {currencyData && (
            <Text className="mt-1 text-sm text-muted-foreground">
              {currencyData.code} • {currencyData.currency}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

export default function Settings() {
  const appVersion = Constants.expoConfig?.version ?? '0.0.1';

  const handlePrivacyPolicy = () => {
    router.push('/settings/privacy');
  };

  const handleTermsAndConditions = () => {
    router.push('/settings/terms');
  };

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View className="mt-[80px] flex-1 gap-6 p-4">
          {/* Profile Card */}
          <ProfileCard />

          <SettingsSection title="Appearance">
            <ThemeToggleItem />
          </SettingsSection>

          <SettingsSection title="Data">
            <SettingsItem
              icon={<Icon as={ListIcon} className="size-5 text-foreground" />}
              label="Manage Lists"
              onPress={() => router.push('/settings/manage-lists')}
              testID="settings-manage-lists"
            />
          </SettingsSection>

          <SettingsSection title="Legal">
            <SettingsItem
              icon={<Icon as={ShieldIcon} className="size-5 text-foreground" />}
              label="Privacy policy"
              onPress={handlePrivacyPolicy}
              testID="settings-privacy-policy"
            />
            <SettingsItem
              icon={<Icon as={FileTextIcon} className="size-5 text-foreground" />}
              label="Terms and conditions"
              onPress={handleTermsAndConditions}
              testID="settings-terms-conditions"
            />
          </SettingsSection>

          <SettingsSection title="About">
            <SettingsItem
              icon={<Icon as={InfoIcon} className="size-5 text-foreground" />}
              label="Version"
              value={`v${appVersion}`}
            />
          </SettingsSection>
        </View>
      </ScrollView>
    </>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-2">
      <Text className="ml-1 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </Text>
      <View className="gap-3">{children}</View>
    </View>
  );
}

function SettingsItem({
  icon,
  label,
  value,
  onPress,
  testID,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  testID?: string;
}) {
  const content = (
    <View
      testID={onPress ? undefined : testID}
      className="flex-row items-center justify-between rounded-xl border border-brand-brown/20 bg-card p-4">
      <View className="flex-1 flex-row items-center gap-3">
        <View className="rounded-md bg-muted p-2">{icon}</View>
        <Text className="flex-1 font-medium text-card-foreground">{label}</Text>
      </View>
      <View className="flex-row items-center gap-2">
        {value ? <Text className="text-sm text-muted-foreground">{value}</Text> : null}
        {onPress ? <Icon as={ChevronRightIcon} className="size-4 text-muted-foreground" /> : null}
      </View>
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable testID={testID} onPress={onPress} className="active:opacity-70">
      {content}
    </Pressable>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggleItem() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleToggleTheme = () => {
    try {
      toggleColorScheme();
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  return (
    <Pressable
      testID="settings-theme-toggle"
      onPress={handleToggleTheme}
      className="active:opacity-70">
      <View className="flex-row items-center justify-between rounded-xl border border-brand-brown/20 bg-card p-4">
        <View className="flex-row items-center gap-3">
          <View className="rounded-md bg-muted p-2">
            <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5 text-foreground" />
          </View>
          <View>
            <Text className="font-medium text-card-foreground">Theme</Text>
            <Text className="text-sm text-muted-foreground">
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </Text>
          </View>
        </View>
        <View className="rounded-md border border-border px-3 py-1">
          <Text className="font-medium text-primary">Toggle</Text>
        </View>
      </View>
    </Pressable>
  );
}
