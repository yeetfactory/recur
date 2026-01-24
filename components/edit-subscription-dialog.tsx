import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { Pressable, ScrollView, View, Image, ActivityIndicator } from 'react-native';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { brandfetch } from '@/integrations/brandfetch';
import { BrandfetchCompany, SubscriptionFrequency, Subscription } from '@/types';
import { updateSubscription } from '@/actions/subscription';
import { createList, getLists } from '@/actions/list';

interface EditSubscriptionDialogProps {
    subscription: Subscription | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate?: () => void;
}

export function EditSubscriptionDialog({ subscription, open, onOpenChange, onUpdate }: EditSubscriptionDialogProps) {
    const { colorScheme } = useColorScheme();

    // Form State
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState<BrandfetchCompany[]>([]);
    const [isSearching, setIsSearching] = React.useState(false);
    const [hasSearched, setHasSearched] = React.useState(false);
    const [selectedCompany, setSelectedCompany] = React.useState<BrandfetchCompany | null>(null);

    // Details State
    const [frequency, setFrequency] = React.useState<SubscriptionFrequency>('monthly');
    const [amount, setAmount] = React.useState('');
    const [date, setDate] = React.useState('');

    // List State
    const [lists, setLists] = React.useState<{ id: string; name: string }[]>([]);
    const [selectedListId, setSelectedListId] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (open && subscription) {
            const allLists = getLists();
            setLists(allLists);

            // Pre-fill data
            setSelectedCompany(subscription.company);
            setFrequency(subscription.frequency);
            setAmount(subscription.amount.toString());

            try {
                const parsedDate = new Date(subscription.startDate);
                // Check if date is valid
                if (!isNaN(parsedDate.getTime())) {
                    setDate(parsedDate.toISOString().split('T')[0]);
                } else {
                    // Fallback if date is invalid in store
                    console.warn('Invalid start date in subscription', subscription.startDate);
                    setDate(new Date().toISOString().split('T')[0]);
                }
            } catch (e) {
                console.warn('Error parsing date', e);
                setDate(new Date().toISOString().split('T')[0]);
            }

            setSelectedListId(subscription.listId || (allLists.length > 0 ? allLists[0].id : null));
        }
    }, [open, subscription]);

    const handleSearch = async () => {
        if (searchQuery.length <= 2) return;

        setIsSearching(true);
        setHasSearched(true);
        try {
            const results = await brandfetch.search({ query: searchQuery });
            setSearchResults(results);
        } catch (error) {
            console.error('Search failed', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleCompanySelect = (company: BrandfetchCompany) => {
        setSelectedCompany(company);
        setSearchQuery('');
        setSearchResults([]);
        setHasSearched(false);
    };

    const clearSelection = () => {
        setSelectedCompany(null);
        setSearchQuery('');
        setSearchResults([]);
        setHasSearched(false);
    };

    const handleUpdate = () => {
        if (!selectedCompany || !subscription) return;

        let targetListId = selectedListId;

        if (!targetListId) {
            const existingLists = getLists();
            if (existingLists.length > 0) {
                targetListId = existingLists[0].id;
            } else {
                const newList = createList({ name: 'Default' });
                targetListId = newList.id;
            }
        }

        try {
            updateSubscription({
                subscription: {
                    ...subscription,
                    company: selectedCompany,
                    frequency,
                    amount: parseFloat(amount) || 0,
                    currency: subscription.currency, // Keep original currency or default? Assuming keep for now
                    listId: targetListId,
                    startDate: new Date(date),
                }
            });
            onOpenChange(false);
            if (onUpdate) onUpdate();
        } catch (e) {
            console.error("Failed to update subscription", e);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent scrollable={true} title="Edit Subscription" description="Update your subscription details.">
                <ScrollView className="flex-1 gap-4 pt-4" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                    {/* Search or Selected Company Section */}
                    {!selectedCompany ? (
                        <View className="gap-2 z-50">
                            <Text className="text-sm font-recoleta-medium text-foreground">Service</Text>
                            <View className="flex-row gap-2">
                                <Input
                                    className="flex-1"
                                    placeholder="Search for a subscription"
                                    value={searchQuery}
                                    onChangeText={(text) => {
                                        setSearchQuery(text);
                                        setHasSearched(false);
                                        if (text.length === 0) {
                                            setSearchResults([]);
                                        }
                                    }}
                                    onSubmitEditing={handleSearch}
                                    returnKeyType="search"
                                />
                                <Button
                                    onPress={handleSearch}
                                    disabled={searchQuery.length <= 2 || isSearching}
                                    className="pl-3 pr-3"
                                >
                                    {isSearching ? (
                                        <ActivityIndicator size="small" color={colorScheme === 'dark' ? 'black' : 'white'} />
                                    ) : (
                                        <Ionicons name="search" size={20} color={colorScheme === 'dark' ? 'black' : 'white'} />
                                    )}
                                </Button>
                            </View>

                            {/* Search Results Dropdown/List */}
                            {searchResults.length > 0 && (
                                <View className="border border-[#502615] rounded-md bg-background overflow-hidden mt-1">
                                    {searchResults.map((item) => (
                                        <Pressable
                                            key={item.brandId}
                                            className="flex-row items-center gap-3 p-3 border-b border-[#502615] active:bg-accent/50 last:border-b-0"
                                            onPress={() => handleCompanySelect(item)}
                                        >
                                            {item.icon && <Image source={{ uri: item.icon }} style={{ width: 24, height: 24, borderRadius: 6 }} />}
                                            <View>
                                                <Text className="font-recoleta-medium text-foreground">{item.name}</Text>
                                                <Text className="text-muted-foreground text-xs">{item.domain}</Text>
                                            </View>
                                        </Pressable>
                                    ))}
                                </View>
                            )}
                            {hasSearched && !isSearching && searchResults.length === 0 && (
                                <Text className="text-muted-foreground text-center text-xs pt-1">No results found.</Text>
                            )}
                        </View>
                    ) : (
                        <View className="gap-2">
                            <Text className="text-sm font-recoleta-medium text-foreground">Service</Text>
                            <View className="flex-row items-center justify-between p-3 border border-[#502615] rounded-md bg-accent/10">
                                <View className="flex-row items-center gap-3">
                                    {selectedCompany.icon && <Image source={{ uri: selectedCompany.icon }} style={{ width: 40, height: 40, borderRadius: 10 }} />}
                                    <Text className="text-lg font-bold text-foreground">{selectedCompany.name}</Text>
                                </View>
                                <Button variant="ghost" size="icon" onPress={clearSelection}>
                                    <Ionicons name="close-circle" size={20} color="gray" />
                                </Button>
                            </View>
                        </View>
                    )}

                    <View className="gap-6 mt-2">

                        {/* List Selection */}
                        {lists.length > 0 && (
                            <View className="gap-2">
                                <Text className="text-sm font-recoleta-medium text-foreground">List</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                                    {lists.map((list) => (
                                        <Pressable
                                            key={list.id}
                                            onPress={() => setSelectedListId(list.id)}
                                            className={`px-4 py-2 mr-1 ml-1 rounded-full border ${selectedListId === list.id
                                                ? 'bg-foreground border-foreground'
                                                : 'bg-background border-input'
                                                }`}
                                        >
                                            <Text className={`${selectedListId === list.id ? 'text-background' : 'text-foreground'}`}>
                                                {list.name}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        {/* Frequency Selection */}
                        <View className="gap-2">
                            <Text className="text-sm font-recoleta-medium text-foreground">Frequency</Text>
                            <View className="flex-row gap-2">
                                {(['monthly', 'yearly'] as const).map((freq) => (
                                    <Button
                                        key={freq}
                                        variant={frequency === freq ? 'default' : 'outline'}
                                        onPress={() => setFrequency(freq)}
                                        className="flex-1"
                                    >
                                        <Text>
                                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                                        </Text>
                                    </Button>
                                ))}
                            </View>
                        </View>

                        {/* Amount Input */}
                        <View className="gap-2">
                            <Text className="text-sm font-recoleta-medium text-foreground">Amount</Text>
                            <Input
                                placeholder="0.00"
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                            />
                        </View>

                        {/* Date Input */}
                        <View className="gap-2">
                            <Text className="text-sm font-recoleta-medium text-foreground">Start Date</Text>
                            <Input
                                placeholder="YYYY-MM-DD"
                                value={date}
                                onChangeText={setDate}
                            />
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row gap-3 pt-4 pb-8">
                            <Button variant="ghost" className="flex-1 border border-[#502615]" onPress={() => onOpenChange(false)}>
                                <Text>Cancel</Text>
                            </Button>
                            <Button
                                className="flex-1 border border-[#502615]"
                                onPress={handleUpdate}
                                disabled={!selectedCompany}
                            >
                                <Text>Update</Text>
                            </Button>
                        </View>
                    </View>
                </ScrollView>
            </SheetContent>
        </Sheet>
    );
}
