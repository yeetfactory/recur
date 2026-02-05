import { z } from 'zod';
import { CURRENCY_CODES } from './const';

export const Zod_List = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1),
});

export type List = z.infer<typeof Zod_List>;

export const Zod_Currency = z.enum(CURRENCY_CODES);

export type Currency = z.infer<typeof Zod_Currency>;

export const SUBSCRIPTION_FREQUENCIES = ['monthly', 'yearly'] as const;

export const Zod_SubscriptionFrequency = z.enum(SUBSCRIPTION_FREQUENCIES);

export type SubscriptionFrequency = z.infer<typeof Zod_SubscriptionFrequency>;

export const Zod_Subscription = z.object({
  id: z.string(),
  name: z.string().trim().min(1),
  icon: z.string().nullable(), // emoji or null for initials fallback
  listId: Zod_List.shape.id.trim().min(1).nullable().optional(),
  frequency: Zod_SubscriptionFrequency,
  amount: z.number().nonnegative(),
  currency: Zod_Currency,
  startDate: z.coerce.date(),
});

export type Subscription = z.infer<typeof Zod_Subscription>;
