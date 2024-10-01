import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { useUserContext } from '../../context/UserContext'; // Adjust the path as needed
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { GalleryScreenNavigationProp } from '../../types';
import { PixabayImage } from '../../utils/api';
const UserScreen = () => {
  const { username, theme, toggleTheme, setUsername, likedPhotos } = useUserContext();
  const [isEditing, setIsEditing] = React.useState(false);
  const [newUsername, setNewUsername] = React.useState(username);

  const navigation = useNavigation<GalleryScreenNavigationProp>();

  const handleEditPress = () => {
    setIsEditing(true);
  };

  const handleSavePress = () => {
    setUsername(newUsername);
    setIsEditing(false);
  };

  const handleImagePress = (imageUrl: string) => {
  navigation.navigate('GalleryScreen', {
    images: likedPhotos.map(url => ({ largeImageURL: url } as PixabayImage)), // Cast each url as PixabayImage
    initialIndex: likedPhotos.indexOf(imageUrl), // Use indexOf to find the correct index
  });
};

  const renderImage = ({ item }: { item: string }) => (
    <Card style={styles.card} onPress={() => handleImagePress(item)}>
      <Card.Cover source={{ uri: item }} style={styles.image} />
    </Card>
  );

  const header = (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {isEditing ? (
          <TextInput
            style={[styles.usernameInput, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}
            value={newUsername}
            onChangeText={setNewUsername}
            onSubmitEditing={handleSavePress}
            returnKeyType="done"
          />
        ) : (
          <Text style={[styles.username, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>Hi {username}</Text>
        )}
        <TouchableOpacity onPress={isEditing ? handleSavePress : handleEditPress}>
          <MaterialIcons name={isEditing ? "check" : "edit"} size={24} color={theme === 'dark' ? '#FFFFFF' : '#000000'} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
        <Feather name={theme === 'dark' ? 'sun' : 'moon'} size={24} color={theme === 'dark' ? '#FFFFFF' : '#000000'} />
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={header}
      ListHeaderComponentStyle={{ backgroundColor: theme === 'dark' ? '#000000' : '#FFFFFF' }}
      data={likedPhotos}
      renderItem={renderImage}
      keyExtractor={(item) => item}
      numColumns={2} // Display items in two columns
      contentContainerStyle={styles.imagesContainer}
      columnWrapperStyle={styles.columnWrapper}
    />
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop:15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 35,
    fontWeight: 'bold',
    marginRight: 10,
  },
  usernameInput: {
    fontSize: 30,
    fontWeight: 'bold',
    marginRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  themeButton: {
    padding: 10,
  },
  imagesContainer: {
    padding: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    margin: 4,
    width: '48%', 
    elevation: 2,
  },
  image: {
    height: 140,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
  },
});

export default UserScreen;