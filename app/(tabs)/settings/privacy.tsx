import React from 'react';
import { Stack } from 'expo-router';
import { PolicyScreen } from '@/components/policy-screen';

const SCREEN_OPTIONS = {
  title: 'Privacy Policy',
  headerShown: false,
};

export default function PrivacyPolicyScreen() {
  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <PolicyScreen type="privacy" />
    </>
  );
}
