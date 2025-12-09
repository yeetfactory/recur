import { mmkv } from '@/integrations/mmkv';
import { generateUUID } from '@/lib/utils';
import { List, Zod_List } from '@/types';
import { Logger } from '@/clients/logger';
import { getSubscriptions, SUBSCRIPTIONS_KEY } from './subscription';

const logger = new Logger('list-actions');

const Zod_CreateListSchema = Zod_List.omit({ id: true });

type CreateListSchema = Omit<List, 'id'>;

const LISTS_KEY = 'lists';

export const createList = (args: CreateListSchema) => {
  const validated = Zod_CreateListSchema.safeParse(args);
  if (!validated.success) {
    logger.error('Invalid input for createList', validated.error);
    throw new Error('Invalid input');
  }

  const listName = validated.data.name;
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

export const updateList = (args: { list: List }) => {
  const validated = Zod_List.safeParse(args.list);

  if (!validated.success) {
    logger.error('Invalid input for updateList', validated.error);
    throw new Error('Invalid input');
  }

  const list = validated.data;

  const lists = getLists();

  const index = lists.findIndex((l) => l.id === list.id);
  if (index !== -1) {
    lists[index] = list;
    mmkv.set(LISTS_KEY, lists);
    return list;
  }

  logger.warn('List not found for update:', list.id);
  return null;
};

export const removeList = (args: { list: List }) => {
  const validated = Zod_List.safeParse(args.list);

  if (!validated.success) {
    logger.error('Invalid input for removeList', validated.error);
    throw new Error('Invalid input');
  }

  const list = validated.data;
  const lists = getLists();
  const subscriptions = getSubscriptions();

  const subscriptionsWithRemovedLists = subscriptions.map(s => {
    if (s.listId === list.id) {
      return { ...s, listId: null };
    }
    return s;
  });

  mmkv.set(SUBSCRIPTIONS_KEY, subscriptionsWithRemovedLists);

  const index = lists.findIndex((l) => l.id === list.id);
  if (index !== -1) {
    lists.splice(index, 1);
    mmkv.set(LISTS_KEY, lists);
    return list;
  }

  logger.warn('List not found for removal:', list.id);
  return null;
};

export const getLists = () => {
  return mmkv.get<List[]>(LISTS_KEY) ?? [];
};
