import axios from 'axios'
import { PIXABAY_API_KEY } from '@env';
const pixabay_api_key=PIXABAY_API_KEY;
const BASE_URL='https://pixabay.com/api/';

export interface PixabayImage{
    id:number;
    pageURL:string;
    type:string;
    tags:string;
    previewURL:string;
    largeImageURL:string;
    user:string;
    userImageURL:string;
    views:number;
    likes:number;
}
interface PixabayResponse{
    hits:PixabayImage[];
}

export const fetchPopularImages= async (page: number=1): Promise<PixabayImage[]> =>{
    try{
        const response=await axios.get<PixabayResponse>(`${BASE_URL}?key=${pixabay_api_key}&order=popular&page=${page}`);
        return response.data.hits;
    }catch(error)
    {
        console.error('Error Fetching popular images: ',error);
        return [];
    }
};
export const searchImages = async (query: string, filters?: string): Promise<PixabayImage[]> => {
  try {
    const response = await axios.get<PixabayResponse>(`${BASE_URL}?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}${filters ? `&${filters}` : ''}`);
    return response.data.hits;
  } catch (error) {
    console.error('Error fetching search results:', error);
    return [];
  }
};
export const fetchImagesByCategory=async(category:string): Promise<PixabayImage[]> =>{
    try{
        const response=await axios.get<PixabayResponse>(`${BASE_URL}?key=${PIXABAY_API_KEY}&category=${category}`);
        return response.data.hits;
    }catch(error){
        console.error('Error fetching images by cateogory:',error);
        return [];
    }
};