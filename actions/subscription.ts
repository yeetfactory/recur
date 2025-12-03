import { mmkv } from '@/integrations/mmkv';
import { generateUUID } from '@/lib/utils';
import { Subscription, Zod_Subscription } from '@/types';

const SUBSCRIPTIONS_KEY = 'subscriptions';

const Zod_CreateSubscriptionSchema = Zod_Subscription.omit({
  id: true,
});

type CreateSubscription = Omit<Subscription, 'id'>;

export const createSubscription = (args: CreateSubscription) => {
  const validated = Zod_CreateSubscriptionSchema.safeParse(args);
  if (!validated.success) {
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
  const { subscription } = args;
  const subscriptions = getSubscriptions();

  const index = subscriptions.findIndex((s) => s.id === subscription.id);
  if (index !== -1) {
    subscriptions[index] = subscription;
    mmkv.set(SUBSCRIPTIONS_KEY, subscriptions);
    return subscription;
  }

  return null;
};

export const removeSubscription = (args: { subscription: Subscription }) => {
  const { subscription } = args;
  const subscriptions = getSubscriptions();

  const index = subscriptions.findIndex((s) => s.id === subscription.id);
  if (index !== -1) {
    subscriptions.splice(index, 1);
    mmkv.set(SUBSCRIPTIONS_KEY, subscriptions);
  }

  return null;
};

export const getSubscriptions = () => {
  return mmkv.get<Subscription[]>(SUBSCRIPTIONS_KEY) ?? [];
};
