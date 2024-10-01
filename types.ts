import { NativeStackNavigationProp} from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { PixabayImage } from "./utils/api";

export type RootStackParamList={
    Main: undefined;
    searchScreen:{category:string}|{query:string};
    GalleryScreen:{images:PixabayImage[],initialIndex:number};
};

export type GalleryScreenNavigationProp=NativeStackNavigationProp<RootStackParamList,'GalleryScreen'>;
export type SearchScreenNavigationProp=NativeStackNavigationProp<RootStackParamList,'searchScreen'>

export type GalleryScreenRouteProp=RouteProp<RootStackParamList,'GalleryScreen'>;
export type SearchScreenScreenRouteProp=RouteProp<RootStackParamList,'searchScreen'>;