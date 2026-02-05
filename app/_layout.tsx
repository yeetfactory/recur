import 'react-native-gesture-handler';
import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { useFonts } from 'expo-font';
import { Stack, Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { isOnboardingComplete } from '@/actions/user';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent the splash screen from auto-hiding before asset loading is complete.
void SplashScreen.preventAutoHideAsync();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [loaded, error] = useFonts({
    'Recoleta-Regular': require('../assets/fonts/recoleta-regular.otf'),
    'Recoleta-Medium': require('../assets/fonts/recoleta-medium.otf'),
    'Recoleta-SemiBold': require('../assets/fonts/recoleta-semibold.otf'),
  });

  // Read onboarding status inside component after mount
  useEffect(() => {
    const checkOnboarding = () => {
      try {
        const status = isOnboardingComplete();
        setOnboardingComplete(status);
      } catch (e) {
        setTimeout(checkOnboarding, 100);
      }
    };

    // Small delay to ensure MMKV is ready after crash recovery
    setTimeout(checkOnboarding, 50);
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && onboardingComplete !== null) {
      void SplashScreen.hideAsync();
    }
  }, [loaded, onboardingComplete]);

  // Wait for both fonts and onboarding check
  if (!loaded || onboardingComplete === null) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'dark']}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false }}>
          {/* Order matters: (tabs) first = default route */}
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" />
        </Stack>
        {/* Redirect to onboarding only if NOT complete */}
        {onboardingComplete === false && <Redirect href="/onboarding" />}
        <PortalHost />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
