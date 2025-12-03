import { CURRENCY_CODES } from '@/const';
import { mmkv } from '@/integrations/mmkv';
import { Currency, Zod_Currency } from '@/types';
import { z } from 'zod';

const DEFAULT_CURRENCY_KEY = 'default_currency';

export const getCurrencies = () => {
  return CURRENCY_CODES;
};

const Zod_SetDefaultCurrencySchema = z.object({
  currency: Zod_Currency,
});

export const setDefaultCurrency = (args: { currency: Currency }) => {
  const validated = Zod_SetDefaultCurrencySchema.safeParse(args);
  if (!validated.success) {
    throw new Error('Invalid currency');
  }

  const currency = validated.data.currency;

  mmkv.set(DEFAULT_CURRENCY_KEY, currency);

  return currency;
};

export const getDefaultCurrency = () => {
  return mmkv.get<Currency>(DEFAULT_CURRENCY_KEY);
};
