import { View, Text, useColorScheme, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Subscription, SubscriptionFrequency } from '@/types';
import { SubscriptionAvatar } from '@/components/subscription-avatar';
import { getCurrencySymbol } from '@/lib/currency';
import { toTestIdSegment } from '@/lib/utils';

type CardProps = {
  subscription: Subscription;
  onEdit?: () => void;
  onDelete?: () => void;
  drag?: () => void;
  isActive?: boolean;
  viewMode?: SubscriptionFrequency;
};

// Hoisted styles for list performance (avoid inline objects in renderItem)
const activeShadowStyle = {
  shadowColor: '#502615',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.25,
  shadowRadius: 12,
  elevation: 8,
};
const defaultShadowStyle = {
  shadowColor: '#502615',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 6,
  elevation: 2,
};
const cardHitSlop = { top: 8, bottom: 8, left: 4, right: 4 };

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Card = ({
  subscription,
  onEdit,
  onDelete,
  drag,
  isActive,
  viewMode = 'monthly',
}: CardProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#A69585' : '#7A6B5D';
  const { name, icon, amount, frequency, currency } = subscription;
  const cardId = `subscription-${toTestIdSegment(name || subscription.id)}`;
  const currencySymbol = getCurrencySymbol(currency);

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const displayAmount =
    viewMode === frequency
      ? amount
      : viewMode === 'monthly' && frequency === 'yearly'
        ? amount / 12
        : viewMode === 'yearly' && frequency === 'monthly'
          ? amount * 12
          : amount;

  const freqShort = frequency === 'monthly' ? 'mo' : 'yr';
  const viewModeShort = viewMode === 'monthly' ? 'mo' : 'yr';

  const subtitle =
    viewMode === frequency ? `/${freqShort}` : `/${viewModeShort} (billed /${freqShort})`;

  return (
    <AnimatedPressable
      testID={`${cardId}-card`}
      className="mb-2 flex flex-row items-center overflow-hidden rounded-xl border border-brand-brown/20 bg-card p-4"
      onLongPress={drag}
      delayLongPress={200}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isActive}
      style={[isActive ? activeShadowStyle : defaultShadowStyle, animatedStyle]}>
      {/* Drag handle indicator */}
      {drag ? (
        <View className="mr-2 opacity-30">
          <Ionicons name="menu" size={18} color={iconColor} />
        </View>
      ) : null}

      <SubscriptionAvatar name={name} icon={icon} size={40} />
      <View className="ml-3 flex-1">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-2">
            <Text className="text-base font-medium text-card-foreground" numberOfLines={1}>
              {name}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-base font-bold text-card-foreground">
              {currencySymbol}
              {displayAmount.toFixed(2)}
            </Text>
            <Text className="text-xs text-muted-foreground">{subtitle}</Text>
          </View>
        </View>
      </View>

      {/* Action buttons */}
      <View className="ml-2 flex-row items-center gap-0">
        {onEdit ? (
          <Pressable
            testID={`${cardId}-edit`}
            className="rounded-lg p-2 active:bg-accent"
            onPress={onEdit}
            hitSlop={cardHitSlop}>
            <Ionicons name="pencil" size={16} color={iconColor} />
          </Pressable>
        ) : null}
        {onDelete ? (
          <Pressable
            testID={`${cardId}-delete`}
            className="rounded-lg p-2 active:bg-destructive/10"
            onPress={onDelete}
            hitSlop={cardHitSlop}>
            <Ionicons name="trash-outline" size={16} color="#D4531D" />
          </Pressable>
        ) : null}
      </View>
    </AnimatedPressable>
  );
};
