import React from 'react';
import { Stack } from 'expo-router';
import { PolicyScreen } from '@/components/policy-screen';

const SCREEN_OPTIONS = {
  title: 'Terms & Conditions',
  headerShown: false,
};

export default function TermsScreen() {
  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <PolicyScreen type="terms" />
    </>
  );
}
