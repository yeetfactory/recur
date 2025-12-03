import { z } from 'zod';
import { CURRENCY_CODES } from './const';

export const Zod_BrandfetchSearchInput = z.object({
  query: z.string(),
});

export type BrandfetchSearchInput = z.infer<typeof Zod_BrandfetchSearchInput>;

export const Zod_BrandfetchCompany = z.object({
  icon: z.string().optional(),
  name: z.string().optional(),
  domain: z.string(),
  claimed: z.boolean(),
  brandId: z.string(),
});

export type BrandfetchCompany = z.infer<typeof Zod_BrandfetchCompany>;

export const Zod_BrandfetchSearchResponse = z.array(Zod_BrandfetchCompany);

export type BrandfetchSearchResponse = z.infer<typeof Zod_BrandfetchSearchResponse>;

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
  company: Zod_BrandfetchCompany,
  list: Zod_List,
  frequency: Zod_SubscriptionFrequency,
  amount: z.number(),
  currency: Zod_Currency,
  isFreeTrial: z.boolean(),
});

export type Subscription = z.infer<typeof Zod_Subscription>;
