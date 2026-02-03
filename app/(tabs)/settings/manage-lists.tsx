import * as React from 'react';
import { View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
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

export default function ManageListsPage() {
  const { lists, createList, updateList, removeList } = useLists();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingList, setEditingList] = React.useState<List | null>(null);
  const [newListName, setNewListName] = React.useState('');

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
        Alert.alert('Error', 'Failed to create list');
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
        Alert.alert('Error', 'Failed to update list');
      }
    }
  };

  const handleDeleteList = (listToDelete: List) => {
    Alert.alert('Delete List', `Are you sure you want to delete "${listToDelete.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          try {
            removeList(listToDelete.id);
          } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to delete list');
          }
        },
      },
    ]);
  };

  const openEditDialog = (list: List) => {
    setEditingList(list);
    setNewListName(list.name);
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mt-[100px] flex-1 gap-4 p-4">
          {/* Search Input */}
          <View className="border-brand-brown flex-row items-center gap-2 rounded-lg border bg-card p-2 dark:bg-black">
            <Icon as={SearchIcon} className="ml-2 size-5 text-muted-foreground" />
            <Input
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
              className="border-brand-brown flex-row items-center justify-between rounded-lg border bg-card p-4 dark:bg-black">
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
                  onPress={() => openEditDialog(list)}
                  className="rounded-md bg-muted p-2">
                  <Icon as={PencilIcon} className="size-4 text-muted-foreground" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteList(list)}
                  className="rounded-md bg-muted p-2">
                  <Icon as={Trash2Icon} className="size-4 text-destructive" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Add List Button */}
          <TouchableOpacity activeOpacity={0.7} onPress={() => setIsAddDialogOpen(true)}>
            <View className="border-brand-brown flex-row items-center justify-center gap-2 rounded-lg border border-dashed bg-card/50 p-4 dark:bg-black/50">
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
            placeholder="List name"
            value={newListName}
            onChangeText={setNewListName}
            autoFocus
            className="w-[75vw]"
          />
          <DialogFooter>
            <Button variant="outline" onPress={() => setIsAddDialogOpen(false)}>
              <Text>Cancel</Text>
            </Button>
            <Button onPress={handleAddList}>
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
            placeholder="List name"
            value={newListName}
            onChangeText={setNewListName}
            autoFocus
            className="w-[75vw]"
          />
          <DialogFooter>
            <Button variant="outline" onPress={() => setIsEditDialogOpen(false)}>
              <Text>Cancel</Text>
            </Button>
            <Button onPress={handleEditList}>
              <Text>Save</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
