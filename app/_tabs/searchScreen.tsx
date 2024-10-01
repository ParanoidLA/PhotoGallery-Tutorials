import React, { useState, useEffect} from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { Searchbar ,ActivityIndicator} from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { fetchImagesByCategory, searchImages, PixabayImage } from '../../utils/api'; // Adjust import path
import { useUserContext } from '../../context/UserContext'; // Adjust import path
import CardComponent from '../components/CardComponent'; // Adjust import path
import { GalleryScreenNavigationProp } from '../../types';
const categories = [
  'Backgrounds', 'Fashion', 'Nature', 'Science', 'Education', 'Feelings',
  'Health', 'People', 'Religion', 'Places', 'Animals', 'Industry', 'Computer',
  'Food', 'Sports', 'Transportation', 'Travel', 'Buildings', 'Business', 'Music'
];

const SearchScreen = () => {
  const route = useRoute<RouteProp<{ params: { category?: string; query?: string } }, 'params'>>();
  const { category, query } = route.params || {};
  const [searchTerm, setSearchTerm] = useState(query || '');
  const [results, setResults] = useState<PixabayImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [numColumns, setNumColumns] = useState(2);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigation = useNavigation<GalleryScreenNavigationProp>();
  const { theme } = useUserContext();

  useEffect(() => {
    const fetchData = async () => {
      if (query) {
        const searchResults = await searchImages(query);
        setResults(searchResults);
      } else if (category) {
        const images = await fetchImagesByCategory(category);
        setResults(images);
      }
      setLoading(false);
    };
    fetchData();
  }, [category, query]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredCategories(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredCategories([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      if (category) {
        const images = await fetchImagesByCategory(category);
        setResults(images);
      }
    } else {
      const searchResults = await searchImages(searchTerm);
      setResults(searchResults);
    }
    setShowSuggestions(false); // Hide suggestions after search
  };

  const handleCategorySelect = async (selectedCategory: string) => {
    setSearchTerm(selectedCategory);
    setFilteredCategories([]);
    setShowSuggestions(false);
    const images = await fetchImagesByCategory(selectedCategory);
    setResults(images);
  };

  const handleImagePress = (index: number) => {
    navigation.navigate('GalleryScreen', { images: results, initialIndex: index });
  };

  const renderItem = ({ item, index }: { item: PixabayImage, index: number }) => (
    <CardComponent item={item} onPress={() => handleImagePress(index)} index={index} />
  );

  const renderCategorySuggestion = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={() => handleCategorySelect(item)} style={styles.suggestionItem}>
      <Text style={[styles.suggestionText, { color: theme === 'light' ? '#000' : '#fff' }]}>{item}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.footerContainer}>
      <ActivityIndicator size="large" />
    </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme === 'light' ? '#fff' : '#333' }]}>
      <Searchbar
        style={[styles.searchInput, { backgroundColor: theme === 'light' ? '#fff' : '#444' }]}
        placeholder={category ? `Search in ${category}` : 'Search'}
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={handleSearch}
        theme={{ colors: { primary: theme === 'light' ? '#6200ee' : '#bb86fc', placeholder: theme === 'light' ? '#888' : '#ccc' } }}
        placeholderTextColor={theme === 'light' ? '#888' : '#ccc'}
      />
      {showSuggestions && (
        <FlatList
          data={filteredCategories}
          renderItem={renderCategorySuggestion}
          keyExtractor={(item) => item}
          style={styles.suggestionsContainer}
        />
      )}
      <FlatList
        data={results}
        numColumns={numColumns}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        key={`${numColumns}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    marginBottom: 20,
    borderRadius: 8,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  suggestionsContainer: {
    marginBottom: 20,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  suggestionText: {
    fontSize: 16,
  },
  footerContainer: {
    flex: 1,
    justifyContent: 'center',  // Center vertically
    alignItems: 'center',      // Center horizontally
    padding: 20,
  },
});

export default SearchScreen;