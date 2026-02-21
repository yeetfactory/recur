import { View, Text } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Path, Circle, G } from 'react-native-svg';
import type { SubscriptionFrequency } from '@/types';

type ChartProps = {
  total: string;
  viewMode?: SubscriptionFrequency;
  userName?: string;
};

const chartShadow = {
  elevation: 8,
  shadowColor: '#502615',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.22,
  shadowRadius: 16,
};

// Credit Card EMV Chip Component
const EMVChip = () => (
  <View style={{ width: 45, height: 34, borderRadius: 6, overflow: 'hidden' }}>
    <Svg width="100%" height="100%" viewBox="0 0 45 34">
      <Defs>
        <LinearGradient id="chipGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#F5D48C" stopOpacity="1" />
          <Stop offset="1" stopColor="#D4531D" stopOpacity="0.8" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="45" height="34" rx="6" fill="url(#chipGrad)" />
      {/* Chip contact lines */}
      <Path
        d="M0 10 H45 M0 24 H45 M15 0 V34 M30 0 V34"
        stroke="#502615"
        strokeWidth="0.5"
        opacity="0.3"
      />
      <Rect
        x="18"
        y="12"
        width="9"
        height="10"
        rx="2"
        stroke="#502615"
        strokeWidth="0.5"
        opacity="0.3"
        fill="none"
      />
    </Svg>
  </View>
);

// Contactless Icon Component
const ContactlessIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M8.5 10a7.5 7.5 0 0 1 7.5 7.5M5 10a11 11 0 0 1 11 11M2 10a14 14 0 0 1 14 14"
      stroke="rgba(255,255,255,0.6)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);

// Background Pattern Component
const CardBackground = () => (
  <Svg style={{ position: 'absolute' }} width="100%" height="100%">
    <Defs>
      <LinearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#502615" />
        <Stop offset="0.5" stopColor="#7A3E23" />
        <Stop offset="1" stopColor="#502615" />
      </LinearGradient>
      <LinearGradient id="shine" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#ffffff" stopOpacity="0.1" />
        <Stop offset="1" stopColor="#ffffff" stopOpacity="0" />
      </LinearGradient>
      {/* Mesh/Noise effect could be complex, sticking to abstract shapes */}
    </Defs>
    <Rect width="100%" height="100%" fill="url(#cardGrad)" />

    {/* Abstract curves for premium look */}
    <Path
      d="M0 100 Q 150 50 400 150 T 800 100"
      fill="none"
      stroke="#D4531D"
      strokeWidth="40"
      opacity="0.05"
      transform="scale(2)"
    />
    <Circle cx="10%" cy="10%" r="150" fill="#EFAC39" opacity="0.05" />
    <Circle cx="90%" cy="110%" r="200" fill="#D4531D" opacity="0.05" />

    {/* Subtle noise/texture overlay */}
    <Rect width="100%" height="100%" fill="url(#shine)" />
  </Svg>
);

export const Chart = ({ total, viewMode = 'monthly', userName }: ChartProps) => {
  const displayFrequency = viewMode === 'monthly' ? '/mo' : '/yr';

  return (
    <View className="mb-6 h-[220px] w-full" style={chartShadow}>
      <View className="h-full w-full overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.1)]">
        <CardBackground />

        {/* Card Content Layout */}
        <View className="flex-1 justify-between p-6">
          <View className="flex-row items-start justify-between">
            <EMVChip />
            <Text className="font-[Recoleta-Bold] text-2xl font-bold tracking-widest text-white/90">
              Recur
            </Text>
          </View>

          {/* Middle Row: Amount */}
          <View className="mt-2">
            <Text className="mb-1 text-xs font-medium uppercase tracking-[4px] text-white/60">
              Total Spending
            </Text>
            <View className="flex-row items-baseline">
              <Text
                className="font-[Recoleta-SemiBold] text-4xl text-white shadow-sm"
                style={{
                  textShadowColor: 'rgba(0,0,0,0.3)',
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 4,
                }}>
                {total}
              </Text>
              <Text className="ml-2 font-[Recoleta-Regular] text-lg text-white/50">
                {displayFrequency}
              </Text>
            </View>
          </View>

          {/* Bottom Row: Name */}
          <View className="mt-4 flex-row items-end justify-between">
            <View>
              <Text className="mb-0.5 text-[9px] uppercase tracking-widest text-white/40">
                Card Holder
              </Text>
              <Text className="font-[Recoleta-Medium] text-sm font-medium uppercase tracking-widest text-white">
                {userName || 'VALUED MEMBER'}
              </Text>
            </View>

            {/* Network Logo */}
            <View className="opacity-80">
              <Svg width="46" height="30" viewBox="0 0 46 30">
                <Circle cx="15" cy="15" r="15" fill="#EFAC39" fillOpacity="0.8" />
                <Circle cx="31" cy="15" r="15" fill="#D4531D" fillOpacity="0.8" />
              </Svg>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
