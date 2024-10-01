import React,{useState,useRef,useEffect} from "react";
import {View,Image,StyleSheet,TouchableOpacity,Dimensions} from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import {useRoute,RouteProp,useNavigation} from '@react-navigation/native';
import { PixabayImage } from "../../utils/api";
import { Ionicons } from "@expo/vector-icons";
import { useUserContext } from "../../context/UserContext";

const {width:screenWidth}=Dimensions.get('window');

const GalleryScreen=()=>{
  const route=useRoute<RouteProp<{params:{
    images:PixabayImage[],initialIndex:number
}},'params'>>();

const navigation=useNavigation();
const {images,initialIndex}=route.params;

const {likedPhotos,addLikedPhoto,removeLikedPhoto}=useUserContext();
const [currentIndex,setCurrentIndex]=useState(initialIndex);
const flatListRef=useRef<FlatList<PixabayImage>>(null);
const lastTap=useRef<number|null>(null);


useEffect(()=>{
  if(flatListRef.current)
  {
    flatListRef.current.scrollToIndex({index:initialIndex,animated:false});
  }
},[initialIndex]);

const handleDoubleTap = (photoUrl: string) => {
  const now = Date.now();
  const DOUBLE_PRESS_DELAY = 300;
  
  if (lastTap.current && (now - lastTap.current) < DOUBLE_PRESS_DELAY) {
    if (likedPhotos.includes(photoUrl)) {
      removeLikedPhoto(photoUrl);
    } else {
      addLikedPhoto(photoUrl);
    }
  } else {
    lastTap.current = now;
  }
};

const renderitem=({item}:{item:PixabayImage})=>{
  const isLiked=likedPhotos.includes(item.largeImageURL);
  return(
    <TouchableOpacity onPress={()=>handleDoubleTap(item.largeImageURL)}
    style={styles.imageContainer}
    activeOpacity={1}>
      <Image source={{uri:item.largeImageURL}} style={styles.image}/>
      <TouchableOpacity style={styles.heartIcon} onPress={()=>isLiked?
        removeLikedPhoto(item.largeImageURL):addLikedPhoto(item.largeImageURL)}>
          <Ionicons name={isLiked?'heart':'heart-dislike-circle-outline'} size={30} color={isLiked?'red':'white'}/>
        </TouchableOpacity>

    </TouchableOpacity>
  );
};


return (
  <View style={styles.container}>
    <TouchableOpacity style={styles.backButton} onPress={()=> navigation.goBack()}>
      <Ionicons name='arrow-back-circle' size={24} color={"white"}/>

    </TouchableOpacity>

    <FlatList
    ref={flatListRef}
    data={images}
    horizontal
    pagingEnabled
    keyExtractor={(item)=>item.largeImageURL}
    renderItem={renderitem}

    showsHorizontalScrollIndicator={false}
    onMomentumScrollEnd={(event)=>{
      const index=Math.floor(event.nativeEvent.contentOffset.x/event.nativeEvent.layoutMeasurement.width);
      setCurrentIndex(index)
    }}
    getItemLayout={(date,index)=>({
      length:screenWidth,offset:screenWidth*index,index}
    )}
    initialScrollIndex={initialIndex}/>
  </View>
)


};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  heartIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default GalleryScreen;