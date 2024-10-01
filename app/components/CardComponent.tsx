import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { PixabayImage } from '../../utils/api';
import { useFonts } from 'expo-font';
import { useUserContext } from '../../context/UserContext';
interface CardComponentProps {
  item: PixabayImage;
  onPress: (index: number) => void;
  index: number;
}

const CardComponent: React.FC<CardComponentProps> = ({ item, onPress, index }) => {

    const {theme}=useUserContext();
    const isDarkMode=theme==='dark';
  const textColor = isDarkMode?'#fff':'#000';
  const backgroundColor = isDarkMode?'#222':'#f5f5f5';
  const [fontsLoaded] = useFonts({
    Montserrat: require('../../assets/fonts/Montserrat-VariableFont_wght.ttf'),
    FrankRuhlLibre: require('../../assets/fonts/FrankRuhlLibre-VariableFont_wght.ttf')
  });

  return (
    <TouchableOpacity onPress={() => onPress(index)} style={styles.cardContainer}>
      <View style={[styles.cardWrapper, { backgroundColor }]}>
        <Card style={styles.card}>
          <Card.Cover source={{ uri: item.previewURL }} style={styles.image} />
        </Card>
        <View style={styles.contentContainer}>
          <View style={styles.tagsContainer}>
            <IconButton
              icon="tag"
              size={12}
              iconColor={textColor}
              style={styles.icon}
              onPress={() => {}}
            />
            <Text style={[styles.tagsText, { color: textColor }]}>
              {item.tags}
            </Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.infoContainer}>
              <IconButton
                icon="eye"
                size={12}
                iconColor={textColor}
                style={styles.icon}
                onPress={() => {}}
              />
              <Text style={[styles.infoText, { color: textColor }]}>
                {item.views}
              </Text>
            </View>
            <View style={styles.infoContainer}>
              <IconButton
                icon="heart"
                size={12}
                iconColor={textColor}
                style={styles.icon}
                onPress={() => {}}
              />
              <Text style={[styles.infoText, { color: textColor }]}>
                {item.likes}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    margin: 4,
  },
  cardWrapper: {
    borderRadius: 6,
    overflow: 'hidden',
  },
  card: {
    borderRadius: 6,
    padding: 0,
  },
  image: {
    height: 140,
    transform: [{ scale: 1.05 }],
  },
  contentContainer: {
    padding: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
    marginLeft: -15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: -15,
    marginLeft: -15,
    marginBottom: -10,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    marginRight: 2,
    padding: 0,
  },
  tagsText: {
    flexWrap: 'wrap',
    fontFamily: 'FrankRuhlLibre',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    marginLeft: -3,
  },
  infoText: {
    fontSize: 12,
    marginLeft: -3,
    fontFamily: 'FrankRuhlLibre',
    fontWeight: '600',
  },
});

export default CardComponent;