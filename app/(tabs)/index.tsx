import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Card, sampleData } from '@/components/ui/card';
import { Link, Stack } from 'expo-router';
import { MoonStarIcon, StarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

export default function Screen() {
  const { colorScheme } = useColorScheme();

  return (
    <>
      <Stack.Screen />
      <ScrollView>
        <View className="flex-1 items-center justify-center p-4 mt-[50px]">
          {/* <Text>Home</Text> */}
          <View className="w-full gap-4">
            {sampleData.map((card, index) => (
              <Card key={index} {...card} />
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
