import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import MenuScreen from './MenuScreen';
import MenuCoach from './MenuCoach'; 
import MenuPlayer from './MenuPlayer'; 
import TrainingVideoScreen from "./TrainingVideoScreen";


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login' }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ title: 'Sign Up' }}
        />
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{ title: 'Menu' }}
        />
        <Stack.Screen
          name="MenuCoach"
          component={MenuCoach}
          options={{ title: 'Coach Menu' }}
        />
        <Stack.Screen
          name="MenuPlayer"
          component={MenuPlayer} 
          options={{ title: "Player Menu" }}
        />
        <Stack.Screen
        name="TrainingVideoScreen"
        component={TrainingVideoScreen}
        options={{ title: "Training Videos" }}
        />
        
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
