import { View, Text, useColorScheme } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Path, RadialGradient } from 'react-native-svg';
import type { SubscriptionFrequency } from '@/types';

type ChartProps = {
  total: string;
  viewMode?: SubscriptionFrequency;
  userName?: string;
};

// Premium Minimalist EMV Chip
const EMVChip = () => (
  <View style={{ width: 42, height: 32, borderRadius: 6, overflow: 'hidden' }}>
    <Svg width="100%" height="100%" viewBox="0 0 42 32">
      <Defs>
        <LinearGradient id="chipGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#F8E5B9" />
          <Stop offset="0.5" stopColor="#DCA44E" />
          <Stop offset="1" stopColor="#96601D" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="42" height="32" rx="6" fill="url(#chipGrad)" />
      {/* Sleek metallic lines */}
      <Path
        d="M0 10 H42 M0 22 H42 M14 0 V32 M28 0 V32"
        stroke="#4A2E12"
        strokeWidth="0.8"
        strokeOpacity="0.4"
      />
      <Rect
        x="16"
        y="12"
        width="10"
        height="8"
        rx="2"
        stroke="#4A2E12"
        strokeWidth="0.8"
        strokeOpacity="0.4"
        fill="none"
      />
    </Svg>
  </View>
);

// Abstract Luxury Background Pattern
const CardBackground = ({ isDark }: { isDark: boolean }) => {
  const bgGrad = isDark
    ? { top: '#2E160D', mid: '#1A0A05', bottom: '#0A0402' }
    : { top: '#FFFFFF', mid: '#FDF9F6', bottom: '#F4ECE4' };

  const glowTL = isDark ? '#D4531D' : '#FFFFFF';
  const glowBR = isDark ? '#EFAC39' : '#E8D5C4';

  const lineGold1 = isDark ? '#EFAC39' : '#C1883F';
  const lineGold2 = isDark ? '#D4531D' : '#8B502C';

  return (
    <Svg style={{ position: 'absolute' }} width="100%" height="100%">
      <Defs>
        {/* Base Gradient */}
        <LinearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1.5">
          <Stop offset="0" stopColor={bgGrad.top} />
          <Stop offset="0.4" stopColor={bgGrad.mid} />
          <Stop offset="1" stopColor={bgGrad.bottom} />
        </LinearGradient>

        {/* Radiance */}
        <RadialGradient id="glowTopLeft" cx="0%" cy="0%" r="80%">
          <Stop offset="0%" stopColor={glowTL} stopOpacity={isDark ? '0.4' : '0.8'} />
          <Stop offset="100%" stopColor={glowTL} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="glowBottomRight" cx="100%" cy="100%" r="80%">
          <Stop offset="0%" stopColor={glowBR} stopOpacity={isDark ? '0.25' : '0.5'} />
          <Stop offset="100%" stopColor={glowBR} stopOpacity="0" />
        </RadialGradient>

        {/* Glass reflection */}
        <LinearGradient id="slash" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <Stop offset="0.4" stopColor="#ffffff" stopOpacity={isDark ? '0.05' : '0.3'} />
          <Stop offset="0.5" stopColor="#ffffff" stopOpacity={isDark ? '0.12' : '0.6'} />
          <Stop offset="0.6" stopColor="#ffffff" stopOpacity={isDark ? '0.05' : '0.3'} />
          <Stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      <Rect width="100%" height="100%" fill="url(#bgGrad)" />
      <Rect width="100%" height="100%" fill="url(#glowTopLeft)" />
      <Rect width="100%" height="100%" fill="url(#glowBottomRight)" />

      {/* Elegant topographic/watermark lines */}
      <Path
        d="M-50 200 Q 150 100 250 250 T 500 150"
        fill="none"
        stroke={lineGold1}
        strokeWidth="1.5"
        strokeOpacity={isDark ? '0.1' : '0.35'}
        strokeDasharray="4 4"
      />
      <Path
        d="M-50 220 Q 170 120 270 270 T 520 170"
        fill="none"
        stroke={lineGold1}
        strokeWidth="1"
        strokeOpacity={isDark ? '0.05' : '0.25'}
      />
      <Path
        d="M80 -50 Q 200 50 150 200 T 300 350"
        fill="none"
        stroke={lineGold2}
        strokeWidth="2"
        strokeOpacity={isDark ? '0.08' : '0.2'}
      />

      {/* Large subtle Recur infinity watermark */}
      <Path
        d="M 120 150 C 40 150, 40 270, 120 270 C 175 270, 235 150, 290 150 C 370 150, 370 270, 290 270 C 235 270, 175 150, 120 150 Z"
        fill="none"
        stroke={lineGold1}
        strokeWidth="3"
        strokeOpacity={isDark ? '0.03' : '0.12'}
        transform="scale(1.2) translate(10, -50)"
      />

      {/* Diagonal shine/reflection */}
      <Path
        d="M -100 -100 L 150 -100 L 50 400 L -200 400 Z"
        fill="url(#slash)"
        transform="rotate(-30 150 150)"
      />
    </Svg>
  );
};

export const Chart = ({ total, viewMode = 'monthly', userName }: ChartProps) => {
  const displayFrequency = viewMode === 'monthly' ? '/mo' : '/yr';
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const chartShadow = {
    elevation: 12,
    shadowColor: isDark ? '#120905' : '#7A6B5D',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: isDark ? 0.35 : 0.15,
    shadowRadius: 24,
  };

  const textColor = isDark ? 'text-white' : 'text-[#2E160D]';
  const secondaryTextColor = isDark ? 'text-white/50' : 'text-[#2E160D]/50';
  const brandColor = isDark ? 'text-[#F8E5B9]' : 'text-[#96601D]';
  const labelColor = isDark ? 'text-[#EFAC39]/80' : 'text-[#96601D]/80';

  return (
    <View className="mb-2 h-[224px] w-full" style={chartShadow}>
      <View
        className="h-full w-full overflow-hidden rounded-[20px]"
        style={{
          backgroundColor: isDark ? '#2E160D' : '#F4ECE4',
          borderWidth: 1,
          borderColor: isDark ? 'rgba(239, 172, 57, 0.2)' : 'rgba(150, 96, 29, 0.2)',
        }}>
        <CardBackground isDark={isDark} />

        {/* Card Content Layout */}
        <View className="flex-1 justify-between p-7">
          {/* Top Row: Chip & Brand */}
          <View className="flex-row items-start justify-between">
            <EMVChip />
            <Text
              className={`font-recoleta-semibold text-xl tracking-[0.25em] ${brandColor}`}
              style={{ opacity: 0.95 }}>
              RECUR
            </Text>
          </View>

          {/* Middle Row: Amount */}
          <View className="mt-2 items-center text-center">
            <Text
              className={`mb-1.5 font-recoleta text-[10px] uppercase tracking-[0.3em] ${labelColor}`}>
              Total Spending
            </Text>
            <View className="flex-row items-baseline justify-center">
              <Text
                className={`font-recoleta-semibold text-5xl tracking-tight ${textColor}`}
                style={{
                  textShadowColor: isDark ? 'rgba(239, 172, 57, 0.25)' : 'transparent',
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 8,
                }}>
                {total}
              </Text>
              <Text className={`ml-2 font-recoleta-medium text-xl ${secondaryTextColor}`}>
                {displayFrequency}
              </Text>
            </View>
          </View>

          {/* Bottom Row: Name and Network Logo */}
          <View className="mt-4 flex-row items-end justify-between">
            <View>
              <Text
                className={`mb-1.5 font-recoleta text-[9px] uppercase tracking-[0.3em] ${labelColor}`}>
                Card Holder
              </Text>
              <Text
                className={`font-recoleta-medium text-sm uppercase tracking-[0.15em] ${brandColor}`}>
                {userName || 'VALUED MEMBER'}
              </Text>
            </View>

            {/* Network Logo */}
            <View className="opacity-95">
              <Svg width="46" height="30" viewBox="0 0 46 30">
                <Defs>
                  <LinearGradient id="recurGrad" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor={isDark ? '#EFAC39' : '#DCA44E'} />
                    <Stop offset="1" stopColor={isDark ? '#D4531D' : '#96601D'} />
                  </LinearGradient>
                </Defs>
                <Path
                  d="M 14.5 9 C 6.5 9, 6.5 21, 14.5 21 C 20 21, 26 9, 31.5 9 C 39.5 9, 39.5 21, 31.5 21 C 26 21, 20 9, 14.5 9 Z"
                  fill="none"
                  stroke="url(#recurGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
