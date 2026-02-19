import { mmkv } from '@/integrations/mmkv';
import { generateUUID } from '@/lib/utils';
import { Subscription, Zod_Subscription } from '@/types';
import { Logger } from '@/clients/logger';

const logger = new Logger('subscription-actions');

const SUBSCRIPTIONS_KEY = 'subscriptions';

const Zod_CreateSubscriptionSchema = Zod_Subscription.omit({
  id: true,
});
const Zod_SubscriptionArray = Zod_Subscription.array();

type CreateSubscription = Omit<Subscription, 'id'>;

const normalizeSubscriptions = (raw: unknown): Subscription[] => {
  if (!Array.isArray(raw)) return [];

  const parsedArray = Zod_SubscriptionArray.safeParse(raw);
  if (parsedArray.success) {
    return parsedArray.data;
  }

  const cleaned: Subscription[] = [];
  let dropped = 0;
  for (const item of raw) {
    const parsed = Zod_Subscription.safeParse(item);
    if (parsed.success) {
      cleaned.push(parsed.data);
    } else {
      dropped += 1;
    }
  }

  if (dropped > 0) {
    logger.warn(`Dropped ${dropped} invalid subscription(s) from storage`);
  }

  return cleaned;
};

export const createSubscription = (args: CreateSubscription) => {
  const validated = Zod_CreateSubscriptionSchema.safeParse(args);
  if (!validated.success) {
    logger.error('Invalid input for createSubscription', validated.error);
    throw new Error('Invalid input');
  }

  const subscription: Subscription = {
    id: generateUUID(),
    ...validated.data,
  };

  const subscriptions = getSubscriptions();
  subscriptions.push(subscription);

  mmkv.set(SUBSCRIPTIONS_KEY, subscriptions);
  return subscription;
};

export const updateSubscription = (args: { subscription: Subscription }) => {
  const validated = Zod_Subscription.safeParse(args.subscription);

  if (!validated.success) {
    logger.error('Invalid input for updateSubscription', validated.error);
    throw new Error('Invalid input');
  }

  const subscription = validated.data;
  const subscriptions = getSubscriptions();

  const index = subscriptions.findIndex((s) => s.id === subscription.id);
  if (index !== -1) {
    subscriptions[index] = subscription;
    mmkv.set(SUBSCRIPTIONS_KEY, subscriptions);
    return subscription;
  }

  logger.warn('Subscription not found for update:', subscription.id);
  return null;
};

export const removeSubscription = (args: { subscription: Subscription }) => {
  const validated = Zod_Subscription.safeParse(args.subscription);

  if (!validated.success) {
    logger.error('Invalid input for removeSubscription', validated.error);
    throw new Error('Invalid input');
  }

  const subscription = validated.data;
  const subscriptions = getSubscriptions();

  const index = subscriptions.findIndex((s) => s.id === subscription.id);
  if (index !== -1) {
    subscriptions.splice(index, 1);
    mmkv.set(SUBSCRIPTIONS_KEY, subscriptions);
    return subscription;
  }

  logger.warn('Subscription not found for removal:', subscription.id);
  return null;
};

export const getSubscriptions = () => {
  const stored = mmkv.get<Subscription[]>(SUBSCRIPTIONS_KEY);
  const normalized = normalizeSubscriptions(stored);
  if (Array.isArray(stored) && normalized.length !== stored.length) {
    mmkv.set(SUBSCRIPTIONS_KEY, normalized);
  }
  return normalized;
};

export const saveSubscriptions = (subscriptions: Subscription[]) => {
  const validated = Zod_SubscriptionArray.safeParse(subscriptions);
  if (!validated.success) {
    logger.error('Invalid subscriptions in saveSubscriptions', validated.error);
    throw new Error('Invalid subscriptions');
  }

  mmkv.set(SUBSCRIPTIONS_KEY, validated.data);
};
