import { View, Text, useColorScheme, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Subscription } from '@/types';
import { SubscriptionAvatar } from '@/components/subscription-avatar';

type CardProps = {
  subscription: Subscription;
  onEdit?: () => void;
  onDelete?: () => void;
  drag?: () => void;
  isActive?: boolean;
  viewMode?: 'monthly' | 'yearly';
};

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
  const iconColor = isDark ? '#9CA3AF' : '#6B7280';
  const { name, icon, amount, frequency, currency } = subscription;

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
    <Pressable
      className="mb-2 flex flex-row items-center rounded-lg border border-[#502615] bg-card p-4"
      onLongPress={drag}
      delayLongPress={200}
      disabled={isActive}
      style={
        isActive
          ? {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }
          : undefined
      }>
      {/* Drag handle indicator */}
      {drag && (
        <View className="mr-2 opacity-40">
          <Ionicons name="menu" size={18} color={iconColor} />
        </View>
      )}

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
              {currency === 'USD' ? '$' : currency}
              {displayAmount.toFixed(2)}
            </Text>
            <Text className="text-xs text-muted-foreground">{subtitle}</Text>
          </View>
        </View>
      </View>

      {/* Action buttons */}
      <View className="ml-2 flex-row items-center gap-0">
        {onEdit && (
          <Pressable
            className="rounded-lg p-2 active:bg-gray-200 dark:active:bg-gray-700"
            onPress={onEdit}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}>
            <Ionicons name="pencil" size={16} color={iconColor} />
          </Pressable>
        )}
        {onDelete && (
          <Pressable
            className="rounded-lg p-2 active:bg-red-100 dark:active:bg-red-900/30"
            onPress={onDelete}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}>
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};
