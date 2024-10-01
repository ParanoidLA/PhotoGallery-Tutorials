import React,{useState,useEffect} from "react";
import {View,StyleSheet,TouchableOpacity,FlatList,ImageBackground} from 'react-native';
import { Text } from "react-native-paper";
import { useUserContext } from "../../context/UserContext";
import { fetchImagesByCategory } from "../../utils/api";
import { useNavigation } from "@react-navigation/native";

const categories = [
  'Backgrounds', 'Fashion', 'Nature', 'Science', 'Education', 'Feelings',
  'Health', 'People', 'Religion', 'Places', 'Animals', 'Industry', 'Computer',
  'Food', 'Sports', 'Transportation', 'Travel', 'Buildings', 'Business', 'Music'
];

const CategoryScreen= ({navigation}:{navigation:any}) =>{
    const {theme}=useUserContext();
    const [categoryImages,setCategoryImages]=useState<{[key:string]:string}>({});
    
    useEffect(()=>{
        const fetchCategoryImages=async()=>{
            const images:{[key:string]:string}={};
            for(const category of categories){
                const fetchedImages=await fetchImagesByCategory(category.toLowerCase());
                if(fetchedImages.length>0)
                {
                    images[category]=fetchedImages[0].largeImageURL;
                }
                else{
                    images[category]='http://via.placeholder.com/150'
                }
            }
            setCategoryImages(images);
        };
        fetchCategoryImages();
    },[]);

    const handleSelectCategory=(category:string)=>{
        navigation.navigate('searchScreen',{category:category.toLowerCase()});
    };

    const renderItem=({item}:{item:string})=>(
        <TouchableOpacity style={styles.categoryContainer} onPress={()=>handleSelectCategory(item)}>
            <ImageBackground source={{uri:categoryImages[item]}} style={styles.categoryImage} imageStyle={styles.imageStyle}>
                <Text style={[styles.categoryText,{color:theme==='dark'?'#fff':'#333'}]}>
                    {item}
                </Text>
            </ImageBackground>
        </TouchableOpacity>
    );


    return(
        <FlatList data={categories} keyExtractor={(item)=>item}
        renderItem={renderItem} numColumns={2} contentContainerStyle={[styles.container,{backgroundColor:theme=='dark'?'#000':'#fff'}]} ItemSeparatorComponent={()=>null}/>
    );
};
const styles = StyleSheet.create({
  container: {
    padding: 4,
    marginTop: 30,
  },
  categoryContainer: {
    flex: 1,
    margin: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  categoryImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
  },
  imageStyle: {
    opacity: 0.6, 
  },
  categoryText: {
    fontSize: 25,
    fontFamily: 'FrankRuhlLibre', // Set the font to Frank Ruhl Libre
    fontWeight: 'bold', // Make the text bold
    textAlign: 'center',
  },
});

export default CategoryScreen;