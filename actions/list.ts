import { mmkv } from '@/integrations/mmkv';
import { generateUUID } from '@/lib/utils';
import { List, Zod_List } from '@/types';
import { Logger } from '@/clients/logger';
import { getSubscriptions, saveSubscriptions } from './subscription';

const logger = new Logger('list-actions');

const Zod_ListNameSchema = Zod_List.shape.name;
const Zod_ListIdSchema = Zod_List.shape.id;
const Zod_ListArray = Zod_List.array();

const LISTS_KEY = 'lists';

const normalizeLists = (raw: unknown): List[] => {
  if (!Array.isArray(raw)) return [];

  const parsedArray = Zod_ListArray.safeParse(raw);
  if (parsedArray.success) {
    return parsedArray.data;
  }

  const cleaned: List[] = [];
  let dropped = 0;
  for (const item of raw) {
    const parsed = Zod_List.safeParse(item);
    if (parsed.success) {
      cleaned.push(parsed.data);
    } else {
      dropped += 1;
    }
  }

  if (dropped > 0) {
    logger.warn(`Dropped ${dropped} invalid list(s) from storage`);
  }

  return cleaned;
};

export const createList = (name: string) => {
  const validated = Zod_ListNameSchema.safeParse(name);
  if (!validated.success) {
    logger.error('Invalid input for createList', validated.error);
    throw new Error('Invalid input');
  }

  const listName = validated.data;
  const id = generateUUID();
  const list: List = {
    id,
    name: listName,
  };

  const lists = getLists();
  lists.push(list);

  mmkv.set(LISTS_KEY, lists);
  return list;
};

export const updateList = (id: string, name: string) => {
  const validatedId = Zod_ListIdSchema.safeParse(id);
  const validatedName = Zod_ListNameSchema.safeParse(name);

  if (!validatedId.success || !validatedName.success) {
    logger.error('Invalid input for updateList', validatedId.error ?? validatedName.error);
    throw new Error('Invalid input');
  }

  const lists = getLists();

  const index = lists.findIndex((l) => l.id === validatedId.data);
  if (index !== -1) {
    const updated = { ...lists[index], name: validatedName.data };
    lists[index] = updated;
    mmkv.set(LISTS_KEY, lists);
    return updated;
  }

  logger.warn('List not found for update:', validatedId.data);
  return null;
};

export const removeList = (id: string) => {
  const validatedId = Zod_ListIdSchema.safeParse(id);
  if (!validatedId.success) {
    logger.error('Invalid input for removeList', validatedId.error);
    throw new Error('Invalid input');
  }

  const lists = getLists();
  const index = lists.findIndex((l) => l.id === validatedId.data);
  if (index === -1) {
    logger.warn('List not found for removal:', validatedId.data);
    return null;
  }

  const list = lists[index];
  const subscriptions = getSubscriptions();

  const subscriptionsWithRemovedLists = subscriptions.map((subscription) =>
    subscription.listId === list.id ? { ...subscription, listId: null } : subscription
  );

  saveSubscriptions(subscriptionsWithRemovedLists);
  lists.splice(index, 1);
  mmkv.set(LISTS_KEY, lists);
  return list;
};

export const getLists = () => {
  const stored = mmkv.get<List[]>(LISTS_KEY);
  const normalized = normalizeLists(stored);
  if (Array.isArray(stored) && normalized.length !== stored.length) {
    mmkv.set(LISTS_KEY, normalized);
  }
  return normalized;
};
