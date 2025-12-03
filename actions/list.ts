import { mmkv } from '@/integrations/mmkv';
import { generateUUID } from '@/lib/utils';
import { List, Zod_List } from '@/types';

const Zod_CreateListSchema = Zod_List.omit({ id: true });

type CreateListSchema = Omit<List, 'id'>;

const LISTS_KEY = 'lists';

export const createList = (args: CreateListSchema) => {
  const validated = Zod_CreateListSchema.safeParse(args);
  if (!validated.success) {
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
  const { list } = args;
  const lists = getLists();

  const index = lists.findIndex((l) => l.id === list.id);
  if (index !== -1) {
    lists[index] = list;
    mmkv.set(LISTS_KEY, lists);
    return list;
  }

  return null;
};

export const removelist = (args: { list: List }) => {
  const { list } = args;
  const lists = getLists();

  const index = lists.findIndex((l) => l.id === list.id);
  if (index !== -1) {
    lists.splice(index, 1);
    mmkv.set(LISTS_KEY, lists);
    return list;
  }

  return null;
};

export const getLists = () => {
  return mmkv.get<List[]>(LISTS_KEY) ?? [];
};
