import * as React from 'react';
import { View, Pressable, ScrollView, Modal } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useColorScheme } from 'nativewind';

type EmojiPickerProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (emoji: string | null) => void;
  currentEmoji: string | null;
};

const toTestIdSegment = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Curated emojis for subscriptions
const EMOJI_CATEGORIES = {
  Entertainment: ['🎬', '📺', '🎵', '🎧', '🎮', '🎲', '📽️', '🍿', '🎭', '📻'],
  'Music & Audio': ['🎵', '🎶', '🎸', '🎹', '🎤', '🎧', '🔊', '📀', '💿', '🎼'],
  'Cloud & Tech': ['☁️', '💾', '💻', '📱', '⌨️', '🖥️', '🌐', '🔐', '📡', '🛡️'],
  Productivity: ['📝', '📊', '📈', '📅', '✅', '📋', '🗂️', '📎', '✏️', '📌'],
  'Fitness & Health': ['💪', '🏃', '🧘', '🏋️', '🚴', '❤️', '🥗', '💊', '🧠', '😴'],
  'Food & Delivery': ['🍕', '🍔', '🥡', '🍣', '☕', '🍷', '🛒', '📦', '🚗', '🛵'],
  'News & Reading': ['📰', '📚', '📖', '📓', '🗞️', '✍️', '📑', '🔖', '📙', '📕'],
  Finance: ['💰', '💳', '🏦', '📈', '💵', '🪙', '💎', '📊', '🧾', '💹'],
  Shopping: ['🛍️', '👗', '👟', '💄', '🏠', '🛋️', '📦', '🎁', '💝', '✨'],
  Other: ['⭐', '🔔', '💡', '🎯', '🚀', '🌟', '💫', '🔥', '⚡', '🌈'],
};

export const EmojiPicker = ({ visible, onClose, onSelect, currentEmoji }: EmojiPickerProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
        <Pressable
          className={`max-h-[70%] rounded-t-3xl p-4 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
          onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="font-recoleta-medium text-lg text-foreground">Choose an Icon</Text>
            <Button testID="emoji-picker-done" variant="ghost" size="sm" onPress={onClose}>
              <Text>Done</Text>
            </Button>
          </View>

          {/* Clear button */}
          {currentEmoji && (
            <Button
              testID="emoji-picker-use-initials"
              variant="outline"
              className="mb-4 border-destructive"
              onPress={() => {
                onSelect(null);
                onClose();
              }}>
              <Text className="text-destructive">Use Initials Instead</Text>
            </Button>
          )}

          {/* Emoji grid */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
              <View key={category} className="mb-4">
                <Text className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                  {category}
                </Text>
                <View className="flex-row flex-wrap">
                  {emojis.map((emoji, index) => (
                    <Pressable
                      key={`${category}-${index}`}
                      testID={`emoji-option-${toTestIdSegment(category)}-${index}`}
                      className={`m-1 h-12 w-12 items-center justify-center rounded-lg ${
                        currentEmoji === emoji
                          ? 'border-2 border-primary bg-primary/20'
                          : isDark
                            ? 'bg-gray-800'
                            : 'bg-gray-100'
                      }`}
                      onPress={() => {
                        onSelect(emoji);
                        onClose();
                      }}>
                      <Text style={{ fontSize: 24 }}>{emoji}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
