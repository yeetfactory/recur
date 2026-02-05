import { CURRENCIES } from '@/const';
import { Currency } from '@/types';

const currencySymbolByCode = new Map<string, string>(
  CURRENCIES.map((entry) => [entry.code, entry.symbol])
);

export const getCurrencySymbol = (currency?: Currency | null) => {
  if (!currency) return '$';
  return currencySymbolByCode.get(currency) ?? currency;
};
