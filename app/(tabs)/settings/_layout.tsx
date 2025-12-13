import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerBlurEffect: 'dark',
        headerStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    />
  );
}
