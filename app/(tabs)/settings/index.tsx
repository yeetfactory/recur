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
import { View, ScrollView, TouchableOpacity, Linking, Share, Platform } from 'react-native';
import Constants from 'expo-constants';
import { CURRENCIES } from '@/const';
import { DISCORD_INVITE_URL, getAppStoreUrl, getShareUrl } from '@/const/links';
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
  const appStoreUrl = getAppStoreUrl(Platform.OS);
  const shareUrl = getShareUrl(Platform.OS);
  const appVersion = Constants.expoConfig?.version ?? Constants.manifest?.version ?? '1.0.0';
  const showSupport = !!appStoreUrl || !!shareUrl || !!DISCORD_INVITE_URL;

  const handleJoinCommunity = () => {
    if (!DISCORD_INVITE_URL) return;
    void Linking.openURL(DISCORD_INVITE_URL);
  };

  const handleLeaveReview = () => {
    if (!appStoreUrl) return;
    void Linking.openURL(appStoreUrl);
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: shareUrl ? `Check out Recur: ${shareUrl}` : 'Check out Recur.',
        url: shareUrl || undefined,
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
            />
          </SettingsSection>

          {showSupport && (
            <SettingsSection title="Support">
              {appStoreUrl && (
                <SettingsItem
                  icon={<Icon as={StarIcon} className="size-5 text-foreground" />}
                  label="Leave a review"
                  onPress={handleLeaveReview}
                />
              )}
              {shareUrl && (
                <SettingsItem
                  icon={<Icon as={ShareIcon} className="size-5 text-foreground" />}
                  label="Share with friends"
                  onPress={handleShareApp}
                />
              )}
              {DISCORD_INVITE_URL && (
                <SettingsItem
                  icon={<DiscordIcon />}
                  label="Join our community"
                  onPress={handleJoinCommunity}
                />
              )}
            </SettingsSection>
          )}

          <SettingsSection title="Legal">
            <SettingsItem
              icon={<Icon as={ShieldIcon} className="size-5 text-foreground" />}
              label="Privacy policy"
              onPress={handlePrivacyPolicy}
            />
            <SettingsItem
              icon={<Icon as={FileTextIcon} className="size-5 text-foreground" />}
              label="Terms and conditions"
              onPress={handleTermsAndConditions}
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
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
}) {
  const content = (
    <View className="border-brand-brown flex-row items-center justify-between rounded-lg border bg-card p-4 dark:bg-black">
      <View className="flex-1 flex-row items-center gap-3">
        <View className="rounded-md bg-muted p-2">{icon}</View>
        <Text className="flex-1 font-medium text-card-foreground dark:text-white">{label}</Text>
      </View>
      <View className="flex-row items-center gap-2">
        {value && <Text className="text-sm text-muted-foreground">{value}</Text>}
        {onPress && <Icon as={ChevronRightIcon} className="size-4 text-muted-foreground" />}
      </View>
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      {content}
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
        <View className="rounded-md border border-border px-3 py-1">
          <Text className="font-medium text-primary">Toggle</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
