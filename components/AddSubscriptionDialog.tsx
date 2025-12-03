import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { View, Pressable } from 'react-native';
import * as DialogPrimitive from '@rn-primitives/dialog';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { Text } from '@/components/ui/text';

export function AddSubscriptionDialog() {
    const { colorScheme } = useColorScheme();
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
            <DialogPrimitive.Trigger asChild>
                <Pressable>
                    <Ionicons name="add-circle-outline" size={36} color={colorScheme === 'dark' ? 'white' : 'black'} />
                </Pressable>
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay asChild>
                    <Animated.View
                        entering={FadeIn}
                        exiting={FadeOut}
                        className="absolute inset-0 z-50 bg-black/80"
                    >
                        <Pressable className="flex-1" onPress={() => setIsOpen(false)} />
                    </Animated.View>
                </DialogPrimitive.Overlay>

                <DialogPrimitive.Content asChild>
                    <Animated.View
                        entering={SlideInDown}
                        exiting={SlideOutDown}
                        className="absolute bottom-0 z-50 w-full h-[85%] bg-background rounded-t-3xl border-t border-border p-6 shadow-lg"
                    >
                        <View className="flex-row items-center justify-between mb-6">
                            <View>
                                <Text className="text-2xl font-bold text-foreground">Add.</Text>
                                <Text className="text-muted-foreground">Add a new subscription to your account.</Text>
                            </View>
                            <DialogPrimitive.Close asChild>
                                <Pressable className="p-2 bg-secondary/50 rounded-full">
                                    <Ionicons name="close" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
                                </Pressable>
                            </DialogPrimitive.Close>
                        </View>
                    </Animated.View>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
