import React from 'react';
import { Text, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type FilterChipProps = {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  testID?: string;
};

export function FilterChip({ label, isSelected, onSelect, testID }: FilterChipProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 300 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedPressable
      testID={testID}
      onPress={onSelect}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={`rounded-full mb-2 mt-2 border px-4 py-1.5 ${isSelected ? 'border-primary bg-primary' : 'border-input bg-background/50'
        }`}
      style={animatedStyle}>
      <Text
        className={`text-sm font-medium ${isSelected ? 'text-primary-foreground' : 'text-foreground'
          }`}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}
