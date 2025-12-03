import { CURRENCY_CODES } from '@/const';
import { mmkv } from '@/integrations/mmkv';
import { Currency, Zod_Currency } from '@/types';
import { Logger } from '@/clients/logger';
import { z } from 'zod';

const logger = new Logger('currency-actions');

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
    logger.error('Invalid currency in setDefaultCurrency', validated.error);
    throw new Error('Invalid currency');
  }

  const currency = validated.data.currency;

  mmkv.set(DEFAULT_CURRENCY_KEY, currency);

  return currency;
};

export const getDefaultCurrency = () => {
  const storedCurrency = mmkv.get<Currency>(DEFAULT_CURRENCY_KEY);

  if (!storedCurrency) {
    logger.info('No default currency set');
    return null;
  }

  const validated = Zod_Currency.safeParse(storedCurrency);

  if (!validated.success) {
    logger.error('Invalid stored currency in getDefaultCurrency', validated.error);
    return null;
  }

  return validated.data;
};
