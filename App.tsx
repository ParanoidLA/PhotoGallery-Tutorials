import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { ActivityIndicator, View } from 'react-native';
import { UserProvider, useUserContext } from './context/UserContext';
import HomeScreen from './app/_tabs/index';
import GalleryScreen from './app/_tabs/GalleryScreen';
import CategoriesScreen from './app/_tabs/category';
import UserScreen from './app/_tabs/profile';
import SearchScreen from './app/_tabs/searchScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  const { theme } = useUserContext();

  const tabBarOptions = {
    tabBarActiveTintColor: theme === 'dark' ? '#fff' : '#000',
    tabBarInactiveTintColor: '#888',
    tabBarStyle: {
      backgroundColor: theme === 'dark' ? '#444' : '#fff',
    },
  };

  return (
    <Tab.Navigator screenOptions={tabBarOptions} initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={UserScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="man" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { theme } = useUserContext();

  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="searchScreen"
          component={SearchScreen}
          options={{
            headerShown: true,
            title: 'Search Screen',
          }}
        />
        <Stack.Screen name="GalleryScreen" component={GalleryScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Montserrat: require('./assets/fonts/Montserrat-VariableFont_wght.ttf'),
        FrankRuhlLibre: require('./assets/fonts/FrankRuhlLibre-VariableFont_wght.ttf'),
      });
      setIsFontLoaded(true);
    }
    loadFonts();
  }, []);

  if (!isFontLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}