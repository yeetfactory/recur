import React from 'react';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
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
import { View, ScrollView, TouchableOpacity, Linking, Share, Platform } from 'react-native';
import { DISCORD_INVITE_URL, APP_STORE_URL, CURRENCIES } from '@/const';
import { getUserName } from '@/actions/user';
import { getDefaultCurrency } from '@/actions/currency';

const SCREEN_OPTIONS = {
  title: 'Settings',
  headerTransparent: true,
};

const DiscordIcon = () => {
  const { colorScheme } = useColorScheme();
  return (
    <Ionicons name="logo-discord" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
  );
};

function ProfileCard() {
  const userName = getUserName();
  const currency = getDefaultCurrency();
  const currencyData = CURRENCIES.find((c) => c.code === currency);
  const initial = userName ? userName.charAt(0).toUpperCase() : '?';

  return (
    <View className="border-brand-brown rounded-2xl border bg-card p-5 dark:bg-black">
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
  const handleJoinCommunity = () => {
    Linking.openURL(DISCORD_INVITE_URL);
  };

  const handleLeaveReview = () => {
    Linking.openURL(APP_STORE_URL);
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          Platform.OS === 'ios' ? 'Check out this app!' : `Check out this app! ${APP_STORE_URL}`,
        url: APP_STORE_URL,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrivacyPolicy = () => {
    router.push('/settings/privacy');
  };

  const handleTermsAndConditions = () => {
    router.push('/settings/terms');
  };

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <ScrollView>
        <View className="mt-[100px] flex-1 gap-6 p-4">
          {/* Profile Card */}
          <ProfileCard />

          <SettingsSection title="Appearance">
            <ThemeToggleItem />
          </SettingsSection>

          <SettingsSection title="Data">
            <SettingsItem
              icon={ListIcon}
              label="Manage Lists"
              onPress={() => router.push('/settings/manage-lists')}
            />
          </SettingsSection>

          <SettingsSection title="Support">
            <SettingsItem icon={StarIcon} label="Leave a review" onPress={handleLeaveReview} />
            <SettingsItem icon={ShareIcon} label="Share with friends" onPress={handleShareApp} />
            <SettingsItem
              icon={DiscordIcon}
              label="Join our community"
              onPress={handleJoinCommunity}
            />
          </SettingsSection>

          <SettingsSection title="Legal">
            <SettingsItem icon={ShieldIcon} label="Privacy policy" onPress={handlePrivacyPolicy} />
            <SettingsItem
              icon={FileTextIcon}
              label="Terms and conditions"
              onPress={handleTermsAndConditions}
            />
          </SettingsSection>

          <SettingsSection title="About">
            <SettingsItem icon={InfoIcon} label="Version" value="v0.0.1" />
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
  icon: IconComponent,
  label,
  value,
  onPress,
}: {
  icon: any;
  label: string;
  value?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View className="border-brand-brown flex-row items-center justify-between rounded-lg border bg-card p-4 dark:bg-black">
        <View className="flex-1 flex-row items-center gap-3">
          <View className="rounded-md bg-muted p-2">
            <Icon as={IconComponent} className="size-5 text-foreground" />
          </View>
          <Text className="flex-1 font-medium text-card-foreground dark:text-white">{label}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          {value && <Text className="text-sm text-muted-foreground">{value}</Text>}
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

  const handleToggleTheme = () => {
    try {
      toggleColorScheme();
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  return (
    <TouchableOpacity onPress={handleToggleTheme} activeOpacity={0.7}>
      <View className="border-brand-brown flex-row items-center justify-between rounded-lg border bg-card p-4 dark:bg-black">
        <View className="flex-row items-center gap-3">
          <View className="rounded-md bg-muted p-2">
            <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5 text-foreground" />
          </View>
          <View>
            <Text className="font-medium text-card-foreground dark:text-white">Theme</Text>
            <Text className="text-sm text-muted-foreground">
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </Text>
          </View>
        </View>
        <Button onPress={handleToggleTheme} variant="ghost" size="sm" className="h-8 px-3">
          <Text className="font-medium text-primary">Toggle</Text>
        </Button>
      </View>
    </TouchableOpacity>
  );
}
