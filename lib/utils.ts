import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as Crypto from 'expo-crypto';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUUID() {
  return Crypto.randomUUID();
}
