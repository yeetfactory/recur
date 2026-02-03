import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { mmkv } from '@/integrations/mmkv';
import { List, Zod_List } from '@/types';
import { generateUUID } from '@/lib/utils';

export const LISTS_KEY = 'lists';

export const useLists = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLists = useCallback(() => {
    try {
      const storedLists = mmkv.get<List[]>(LISTS_KEY);
      if (storedLists) {
        setLists(storedLists);
      } else {
        setLists([]);
      }
    } catch (error) {
      console.error('Failed to fetch lists', error);
      setLists([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useFocusEffect(
    useCallback(() => {
      fetchLists();
    }, [fetchLists])
  );

  const createList = useCallback((name: string) => {
    const newList: List = {
      id: generateUUID(),
      name: name.trim(),
    };

    try {
      const currentLists = mmkv.get<List[]>(LISTS_KEY) ?? [];
      const updatedLists = [...currentLists, newList];
      mmkv.set(LISTS_KEY, updatedLists);
      setLists(updatedLists);
      return newList;
    } catch (error) {
      console.error('Failed to create list', error);
      throw error;
    }
  }, []);

  const updateList = useCallback((id: string, name: string) => {
    try {
      const currentLists = mmkv.get<List[]>(LISTS_KEY) ?? [];
      const updatedLists = currentLists.map((list) =>
        list.id === id ? { ...list, name: name.trim() } : list
      );
      mmkv.set(LISTS_KEY, updatedLists);
      setLists(updatedLists);
    } catch (error) {
      console.error('Failed to update list', error);
      throw error;
    }
  }, []);

  const removeList = useCallback((id: string) => {
    try {
      const currentLists = mmkv.get<List[]>(LISTS_KEY) ?? [];
      const updatedLists = currentLists.filter((list) => list.id !== id);
      mmkv.set(LISTS_KEY, updatedLists);
      setLists(updatedLists);
    } catch (error) {
      console.error('Failed to remove list', error);
      throw error;
    }
  }, []);

  return {
    lists,
    isLoading,
    fetchLists,
    createList,
    updateList,
    removeList,
  };
};
