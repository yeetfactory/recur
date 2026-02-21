import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type SegmentedControlProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View className="flex-row rounded-full border border-border bg-card p-1">
      {options.map((option) => {
        const isSelected = value === option;
        return (
          <Segment
            key={option}
            option={option}
            isSelected={isSelected}
            onSelect={() => onChange(option)}
          />
        );
      })}
    </View>
  );
}

function Segment({
  option,
  isSelected,
  onSelect,
}: {
  option: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedPressable
      testID={`view-mode-${option}`}
      onPress={onSelect}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={`rounded-full px-6 py-2 ${isSelected ? 'bg-primary' : 'bg-transparent'}`}
      style={animatedStyle}>
      <Text
        className={`text-sm font-medium ${
          isSelected ? 'text-primary-foreground' : 'text-muted-foreground'
        }`}>
        {option.charAt(0).toUpperCase() + option.slice(1)}
      </Text>
    </AnimatedPressable>
  );
}
