import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { PolicyScreen } from '@/components/policy-screen';

export default function OnboardingPolicyScreen() {
  const { type } = useLocalSearchParams<{ type: 'privacy' | 'terms' }>();

  return <PolicyScreen type={type || 'terms'} />;
}
