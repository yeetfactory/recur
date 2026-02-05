import { View } from 'react-native';

type ProgressDotsProps = {
  current: number;
  total: number;
};

export function ProgressDots({ current, total }: ProgressDotsProps) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          className={`h-2 rounded-full ${
            index === current
              ? 'w-6 bg-primary'
              : index < current
                ? 'w-2 bg-primary/50'
                : 'w-2 bg-muted'
          }`}
        />
      ))}
    </View>
  );
}
