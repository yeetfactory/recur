import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { useFonts } from 'expo-font';
import { Stack, Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { isOnboardingComplete } from '@/actions/user';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Read onboarding status synchronously (MMKV is sync)
// This is done outside the component to ensure it's only read once
const initialOnboardingStatus = isOnboardingComplete();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [loaded, error] = useFonts({
    'Recoleta-Regular': require('../assets/fonts/recoleta-regular.otf'),
    'Recoleta-Medium': require('../assets/fonts/recoleta-medium.otf'),
    'Recoleta-SemiBold': require('../assets/fonts/recoleta-semibold.otf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'dark']}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        {!initialOnboardingStatus && <Redirect href="/onboarding" />}
        <PortalHost />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
