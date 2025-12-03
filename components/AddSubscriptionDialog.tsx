import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { View, Pressable } from 'react-native';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Input } from "@/components/ui/input"

export function AddSubscriptionDialog() {
    const { colorScheme } = useColorScheme();
    const [billingCycle, setBillingCycle] = React.useState<'Monthly' | 'Yearly'>('Monthly');

    return (
        <Dialog>
            <DialogTrigger>
                <Ionicons name="add-circle-outline" size={36} color={colorScheme === 'dark' ? 'white' : 'black'} />
            </DialogTrigger>
            <DialogContent className="w-[90vw]">
                <DialogHeader>
                    <DialogTitle>Add.</DialogTitle>
                    <DialogDescription>
                        <Text className="text-muted-foreground">Add a new subscription to your account.</Text>
                    </DialogDescription>
                </DialogHeader>
                <Input className="w-full h-[50px]" placeholder="Subscription Name" />
                <Input className="w-full h-[50px]" placeholder="Subscription Price" />

                <View className="flex-row p-1 bg-secondary/30 rounded-lg gap-1">
                    <Pressable
                        // onPress={() => setBillingCycle('Monthly')}
                        className={cn(
                            "flex-1 py-2 items-center justify-center rounded-md",
                            billingCycle === 'Monthly' ? "bg-background shadow-sm" : "bg-transparent"
                        )}
                    >
                        <Text className={cn(
                            "font-medium",
                            billingCycle === 'Monthly' ? "text-foreground" : "text-muted-foreground"
                        )}>Monthly</Text>
                    </Pressable>
                    <Pressable
                        // onPress={() => setBillingCycle('Yearly')}
                        className={cn(
                            "flex-1 py-2 items-center justify-center rounded-md",
                            billingCycle === 'Yearly' ? "bg-background shadow-sm" : "bg-transparent"
                        )}
                    >
                        <Text className={cn(
                            "font-medium",
                            billingCycle === 'Yearly' ? "text-foreground" : "text-muted-foreground"
                        )}>Yearly</Text>
                    </Pressable>
                </View>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button><Text>Close</Text></Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
