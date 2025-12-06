import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { Pressable } from 'react-native';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';

export function AddSubscriptionDialog() {
  const { colorScheme } = useColorScheme();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Pressable>
          <Ionicons
            name="add-circle-outline"
            size={36}
            color={colorScheme === 'dark' ? 'white' : 'black'}
          />
        </Pressable>
      </SheetTrigger>
      <SheetContent title="Add." description="Add a new subscription to your account.">
        {/* Add subscription form content will go here */}
      </SheetContent>
    </Sheet>
  );
}
