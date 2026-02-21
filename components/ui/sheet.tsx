import * as React from 'react';
import { View, Pressable, type ViewProps, type DimensionValue } from 'react-native';
import * as DialogPrimitive from '@rn-primitives/dialog';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface SheetContentProps extends ViewProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  /** Height of the sheet, default is '90%' */
  height?: DimensionValue;
  /** Whether the sheet content should be scrollable, default is true */
  scrollable?: boolean;
}

function Sheet({ open, onOpenChange, children }: SheetProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
}

const SheetTrigger = DialogPrimitive.Trigger;

function SheetContent({
  title,
  description,
  children,
  height = '90%',
  className,
  scrollable = true,
  ...props
}: SheetContentProps) {
  const { colorScheme } = useColorScheme();

  const Container = scrollable ? Animated.ScrollView : Animated.View;

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay asChild>
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          className="absolute inset-0 z-50 bg-black/80">
          <DialogPrimitive.Close asChild>
            <Pressable className="flex-1" />
          </DialogPrimitive.Close>
        </Animated.View>
      </DialogPrimitive.Overlay>

      <DialogPrimitive.Content asChild>
        <Container
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={{ height }}
          className={cn(
            'absolute bottom-0 z-50 w-full rounded-t-3xl bg-background p-6 shadow-lg',
            className
          )}
          {...props}>
          {/* Sheet handle indicator */}
          <View
            style={{
              alignSelf: 'center',
              width: 36,
              height: 4,
              borderRadius: 2,
              backgroundColor: '#502615',
              opacity: 0.2,
              marginBottom: 16,
            }}
          />

          <View className="mb-6 flex-row items-center justify-between">
            <View className="mr-4 flex-1">
              {title && <Text className="text-2xl font-bold text-foreground">{title}</Text>}
              {description && <Text className="text-muted-foreground">{description}</Text>}
            </View>
            <DialogPrimitive.Close asChild>
              <Pressable className="rounded-full bg-muted p-2">
                <Ionicons
                  name="close"
                  size={20}
                  color={colorScheme === 'dark' ? '#A69585' : '#502615'}
                />
              </Pressable>
            </DialogPrimitive.Close>
          </View>
          {children}
        </Container>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export { Sheet, SheetTrigger, SheetContent };
