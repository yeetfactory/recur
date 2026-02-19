import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';

type SubscriptionAvatarProps = {
  name?: string | null;
  icon: string | null;
  size?: number;
  onPress?: () => void;
  showEditHint?: boolean;
  testID?: string;
};

// Warm color palette that matches the app's brown/orange theme – hoisted for performance
const THEME_COLORS_DARK = [
  '#78350F',
  '#7C2D12',
  '#713F12',
  '#365314',
  '#134E4A',
  '#1E3A5F',
  '#312E81',
  '#4C1D95',
];
const THEME_COLORS_LIGHT = [
  '#FEF3C7',
  '#FFEDD5',
  '#FEF9C3',
  '#ECFCCB',
  '#CCFBF1',
  '#E0E7FF',
  '#EDE9FE',
  '#FCE7F3',
];

// Use app theme colors for initials (warm browns/oranges to match the app)
const getThemeColor = (name: string, isDark: boolean): string => {
  const colors = isDark ? THEME_COLORS_DARK : THEME_COLORS_LIGHT;

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

const getTextColor = (isDark: boolean): string => {
  return isDark ? '#FDE68A' : '#78350F'; // Amber tones
};

// Hoisted regex for splitting – avoids re-creation (js-hoist-regexp)
const WHITESPACE_RE = /\s+/;

// Get initials from name (max 2 characters)
const getInitials = (name: string): string => {
  const safe = name.trim();
  if (!safe) {
    return '?';
  }
  const words = safe.split(WHITESPACE_RE);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return safe.slice(0, 2).toUpperCase();
};

// Hoisted constant to avoid re-creation in render (rerender-memo-with-default-value)
const AVATAR_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

export const SubscriptionAvatar = ({
  name,
  icon,
  size = 40,
  onPress,
  showEditHint = false,
  testID,
}: SubscriptionAvatarProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const safeName = typeof name === 'string' ? name : '';
  const initials = getInitials(safeName);

  // Emoji content - no background, just the emoji
  const emojiContent = <Text style={{ fontSize: size * 0.6 }}>{icon}</Text>;

  // Initials content - subtle themed background
  const initialsContent = (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        backgroundColor: getThemeColor(safeName, isDark),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
      }}>
      <Text
        style={{
          fontSize: size * 0.38,
          fontWeight: '600',
          color: getTextColor(isDark),
          letterSpacing: 0.5,
        }}>
        {initials}
      </Text>
    </View>
  );

  const content = icon ? emojiContent : initialsContent;

  // Wrapper style for emoji (to maintain consistent sizing)
  const emojiWrapperStyle = {
    width: size,
    height: size,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  if (onPress) {
    return (
      <Pressable
        testID={testID}
        style={({ pressed }) => ({
          position: 'relative' as const,
          opacity: pressed ? 0.8 : 1,
          transform: pressed ? [{ scale: 0.96 }] : [{ scale: 1 }],
          ...(icon ? emojiWrapperStyle : {}),
        })}
        onPress={onPress}
        hitSlop={AVATAR_HIT_SLOP}>
        {content}
        {/* Edit indicator badge */}
        {showEditHint && (
          <View
            style={{
              position: 'absolute',
              bottom: -1,
              right: -1,
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: isDark ? '#3B82F6' : '#2563EB',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: isDark ? '#18181B' : '#FFFFFF',
            }}>
            <Ionicons name="pencil" size={9} color="white" />
          </View>
        )}
      </Pressable>
    );
  }

  return icon ? <View style={emojiWrapperStyle}>{content}</View> : content;
};
