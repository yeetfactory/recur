import { mmkv } from '@/integrations/mmkv';
import { Logger } from '@/clients/logger';
import { z } from 'zod';

const logger = new Logger('user-actions');

const USER_NAME_KEY = 'user_name';
const ONBOARDING_COMPLETE_KEY = 'onboarding_complete';

// Schemas
const Zod_UserNameSchema = z.string().min(1).max(100);

// User Name Actions
export const setUserName = (name: string) => {
  const validated = Zod_UserNameSchema.safeParse(name);
  if (!validated.success) {
    logger.error('Invalid name in setUserName', validated.error);
    throw new Error('Invalid name');
  }

  mmkv.set(USER_NAME_KEY, validated.data);
  return validated.data;
};

export const getUserName = (): string | null => {
  const storedName = mmkv.get<string>(USER_NAME_KEY);

  if (!storedName) {
    return null;
  }

  const validated = Zod_UserNameSchema.safeParse(storedName);

  if (!validated.success) {
    logger.error('Invalid stored name in getUserName', validated.error);
    return null;
  }

  return validated.data;
};

// Onboarding Listeners
type OnboardingListener = (isComplete: boolean) => void;
const onboardingListeners = new Set<OnboardingListener>();

export const subscribeToOnboarding = (listener: OnboardingListener) => {
  onboardingListeners.add(listener);
  return () => {
    onboardingListeners.delete(listener);
  };
};

// Onboarding State Actions
export const setOnboardingComplete = () => {
  mmkv.set(ONBOARDING_COMPLETE_KEY, true);
  onboardingListeners.forEach((listener) => listener(true));
};

export const isOnboardingComplete = (): boolean => {
  const complete = mmkv.get<boolean>(ONBOARDING_COMPLETE_KEY);
  return complete === true;
};
