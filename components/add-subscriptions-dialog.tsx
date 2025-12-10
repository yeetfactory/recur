import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { Pressable, ScrollView, View, Image, ActivityIndicator } from 'react-native';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { brandfetch } from '@/integrations/brandfetch';
import { BrandfetchCompany, SubscriptionFrequency } from '@/types';
import { createSubscription, getSubscriptions } from '@/actions/subscription';
import { createList, getLists } from '@/actions/list';


export function AddSubscriptionDialog() {
  const { colorScheme } = useColorScheme();
  const [isOpen, setIsOpen] = React.useState(false);

  // Form State
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<BrandfetchCompany[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [selectedCompany, setSelectedCompany] = React.useState<BrandfetchCompany | null>(null);

  // Details State
  const [frequency, setFrequency] = React.useState<SubscriptionFrequency>('monthly');
  const [amount, setAmount] = React.useState('');
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]); // Simple YYYY-MM-DD for now

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

  const handleCreate = () => {
    if (!selectedCompany) return;

    // Default list logic
    let targetList = { id: '', name: 'Default' };
    const lists = getLists();
    if (lists.length > 0) {
      targetList = lists[0];
    } else {
      targetList = createList({ name: 'Default' });
    }

    try {
      createSubscription({
        company: selectedCompany,
        frequency,
        amount: parseFloat(amount) || 0,
        currency: 'USD', // Default to USD for MVP
        isFreeTrial: false,
        list: targetList,
      });
      setIsOpen(false);
      // Reset state
      setSearchQuery('');
      setSearchResults([]);
      setHasSearched(false);
      setSelectedCompany(null);
      setAmount('');
    } catch (e) {
      console.error("Failed to create subscription", e);
    }
  };

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
      <SheetContent scrollable={true} title="Add Subscription" description="Search for a service and enter details.">
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
                  // size="sm"
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
              <Button variant="ghost" className="flex-1 border border-[#502615]" onPress={() => setIsOpen(false)}>
                <Text>Cancel</Text>
              </Button>
              <Button
                className="flex-1 border border-[#502615]"
                onPress={handleCreate}
                disabled={!selectedCompany} // Disable if no company selected
              >
                <Text>Save Subscription</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </SheetContent>
    </Sheet>
  );
}
