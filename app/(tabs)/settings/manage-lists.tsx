import * as React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ListIcon, PlusIcon, PencilIcon, Trash2Icon, SearchIcon } from 'lucide-react-native';

import { useLists } from '@/hooks/use-lists';
import type { List } from '@/types';

const SCREEN_OPTIONS = {
  title: 'Manage Lists',
};

const toTestIdSegment = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function ManageListsPage() {
  const { lists, createList, updateList, removeList } = useLists();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingList, setEditingList] = React.useState<List | null>(null);
  const [newListName, setNewListName] = React.useState('');
  const [listToDelete, setListToDelete] = React.useState<List | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Filter lists based on search query
  const filteredLists = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return lists;
    }
    return lists.filter((list) => list.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [lists, searchQuery]);

  const handleAddList = () => {
    if (newListName.trim()) {
      try {
        createList(newListName.trim());
        setNewListName('');
        setIsAddDialogOpen(false);
      } catch (error) {
        console.error(error);
        setErrorMessage('Failed to create list.');
      }
    }
  };

  const handleEditList = () => {
    if (editingList && newListName.trim()) {
      try {
        updateList(editingList.id, newListName.trim());
        setNewListName('');
        setEditingList(null);
        setIsEditDialogOpen(false);
      } catch (error) {
        console.error(error);
        setErrorMessage('Failed to update list.');
      }
    }
  };

  const handleDeleteList = (list: List) => {
    setListToDelete(list);
  };

  const openEditDialog = (list: List) => {
    setEditingList(list);
    setNewListName(list.name);
    setIsEditDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!listToDelete) return;
    try {
      removeList(listToDelete.id);
      setListToDelete(null);
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to delete list.');
    }
  };

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mt-[100px] flex-1 gap-4 p-4">
          {/* Search Input */}
          <View className="flex-row items-center gap-2 rounded-lg border border-brand-brown bg-card p-2 dark:bg-black">
            <Icon as={SearchIcon} className="ml-2 size-5 text-muted-foreground" />
            <Input
              testID="manage-lists-search-input"
              placeholder="Search lists..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 border-0 bg-transparent"
            />
          </View>

          {/* List Items */}
          {filteredLists.map((list) => (
            <View
              key={list.id}
              testID={`manage-list-item-${toTestIdSegment(list.name)}`}
              className="flex-row items-center justify-between rounded-lg border border-brand-brown bg-card p-4 dark:bg-black">
              <View className="flex-row items-center gap-3">
                <View className="rounded-md bg-muted p-2">
                  <Icon as={ListIcon} className="size-5 text-foreground" />
                </View>
                <Text className="font-medium text-card-foreground dark:text-white">
                  {list.name}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <TouchableOpacity
                  testID={`manage-list-edit-${toTestIdSegment(list.name)}`}
                  onPress={() => openEditDialog(list)}
                  className="rounded-md bg-muted p-2">
                  <Icon as={PencilIcon} className="size-4 text-muted-foreground" />
                </TouchableOpacity>
                <TouchableOpacity
                  testID={`manage-list-delete-${toTestIdSegment(list.name)}`}
                  onPress={() => handleDeleteList(list)}
                  className="rounded-md bg-muted p-2">
                  <Icon as={Trash2Icon} className="size-4 text-destructive" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Add List Button */}
          <TouchableOpacity
            testID="manage-lists-add-new"
            activeOpacity={0.7}
            onPress={() => setIsAddDialogOpen(true)}>
            <View className="flex-row items-center justify-center gap-2 rounded-lg border border-dashed border-brand-brown bg-card/50 p-4 dark:bg-black/50">
              <Icon as={PlusIcon} className="size-5 text-muted-foreground" />
              <Text className="font-medium text-muted-foreground">Add New List</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add List Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New List</DialogTitle>
            <DialogDescription>Create a new list to organize your subscriptions.</DialogDescription>
          </DialogHeader>
          <Input
            testID="manage-lists-add-input"
            placeholder="List name"
            value={newListName}
            onChangeText={setNewListName}
            className="w-[75vw]"
          />
          <DialogFooter>
            <Button variant="outline" onPress={() => setIsAddDialogOpen(false)}>
              <Text>Cancel</Text>
            </Button>
            <Button testID="manage-lists-add-submit" onPress={handleAddList}>
              <Text>Add List</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit List Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit List</DialogTitle>
            <DialogDescription>Update the name of your list.</DialogDescription>
          </DialogHeader>
          <Input
            testID="manage-lists-edit-input"
            placeholder="List name"
            value={newListName}
            onChangeText={setNewListName}
            className="w-[75vw]"
          />
          <DialogFooter>
            <Button variant="outline" onPress={() => setIsEditDialogOpen(false)}>
              <Text>Cancel</Text>
            </Button>
            <Button testID="manage-lists-edit-submit" onPress={handleEditList}>
              <Text>Save</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!listToDelete} onOpenChange={(open) => !open && setListToDelete(null)}>
        <AlertDialogContent className="border border-brand-brown">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-recoleta-medium text-foreground">
              Delete List?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{listToDelete?.name}"? Subscriptions in this list
              will be moved to All.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onPress={() => setListToDelete(null)}>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction
              testID="manage-lists-delete-confirm"
              onPress={confirmDelete}
              className="bg-destructive">
              <Text className="text-white">Delete</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Dialog */}
      <AlertDialog open={!!errorMessage} onOpenChange={(open) => !open && setErrorMessage(null)}>
        <AlertDialogContent className="border border-brand-brown">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-recoleta-medium text-foreground">
              Error
            </AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onPress={() => setErrorMessage(null)}>
              <Text>OK</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
