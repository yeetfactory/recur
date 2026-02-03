import { z } from 'zod';
import { CURRENCY_CODES } from './const';

export const Zod_List = z.object({
  id: z.string(),
  name: z.string(),
});

export type List = z.infer<typeof Zod_List>;

export const Zod_Currency = z.enum(CURRENCY_CODES);

export type Currency = z.infer<typeof Zod_Currency>;

export const Zod_SubscriptionFrequency = z.enum(['daily', 'weekly', 'monthly', 'yearly']);

export type SubscriptionFrequency = z.infer<typeof Zod_SubscriptionFrequency>;

export const Zod_Subscription = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().nullable(), // emoji or null for initials fallback
  listId: Zod_List.shape.id.nullable().optional(),
  frequency: Zod_SubscriptionFrequency,
  amount: z.number(),
  currency: Zod_Currency,
  isFreeTrial: z.boolean(),
  startDate: z.coerce.date(),
});

export type Subscription = z.infer<typeof Zod_Subscription>;
