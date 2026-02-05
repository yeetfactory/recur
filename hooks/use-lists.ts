import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { List } from '@/types';
import {
  createList as createListAction,
  getLists,
  removeList as removeListAction,
  updateList as updateListAction,
} from '@/actions/list';

export const useLists = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLists = useCallback(() => {
    try {
      setLists(getLists());
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
    try {
      const newList = createListAction(name);
      setLists(getLists());
      return newList;
    } catch (error) {
      console.error('Failed to create list', error);
      throw error;
    }
  }, []);

  const updateList = useCallback((id: string, name: string) => {
    try {
      updateListAction(id, name);
      setLists(getLists());
    } catch (error) {
      console.error('Failed to update list', error);
      throw error;
    }
  }, []);

  const removeList = useCallback((id: string) => {
    try {
      removeListAction(id);
      setLists(getLists());
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
