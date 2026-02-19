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
import { useEffect, useReducer } from 'react';
import { isOnboardingComplete } from '@/actions/user';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent the splash screen from auto-hiding before asset loading is complete.
void SplashScreen.preventAutoHideAsync();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

type LayoutState = {
  onboardingComplete: boolean | null;
};

type LayoutAction = { type: 'SET_ONBOARDING'; payload: boolean };

function layoutReducer(_state: LayoutState, action: LayoutAction): LayoutState {
  switch (action.type) {
    case 'SET_ONBOARDING':
      return { onboardingComplete: action.payload };
    default:
      return _state;
  }
}

const initialLayoutState: LayoutState = {
  onboardingComplete: null,
};

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [state, dispatch] = useReducer(layoutReducer, initialLayoutState);
  const [loaded, error] = useFonts({
    'Recoleta-Regular': require('../assets/fonts/recoleta-regular.otf'),
    'Recoleta-Medium': require('../assets/fonts/recoleta-medium.otf'),
    'Recoleta-SemiBold': require('../assets/fonts/recoleta-semibold.otf'),
  });

  // Re-throw font loading errors so ErrorBoundary can catch them
  if (error) throw error;

  // Read onboarding status inside component after mount
  useEffect(() => {
    const checkOnboarding = () => {
      try {
        const status = isOnboardingComplete();
        dispatch({ type: 'SET_ONBOARDING', payload: status });
      } catch (e) {
        console.error(e);
        setTimeout(checkOnboarding, 100);
      }
    };

    // Small delay to ensure MMKV is ready after crash recovery
    setTimeout(checkOnboarding, 50);
  }, []);

  useEffect(() => {
    if (loaded && state.onboardingComplete !== null) {
      void SplashScreen.hideAsync();
    }
  }, [loaded, state.onboardingComplete]);

  // Wait for both fonts and onboarding check
  if (!loaded || state.onboardingComplete === null) {
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
        {state.onboardingComplete === false && <Redirect href="/onboarding" />}
        <PortalHost />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
