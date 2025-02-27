import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import MenuScreen from './MenuScreen';
import MenuCoach from './MenuCoach'; 
import MenuPlayer from './MenuPlayer'; 
import TrainingVideoScreen from "./TrainingVideoScreen";
import ViewSkillsScreen from './ViewSkillsScreen';
import ImproveSkillsScreen from './ImproveSkillsScreen';
import ManagePlayersScreen from './ManagePlayersScreen';
import AddPlayerDetailsScreen from './AddPlayerDetailsScreen';

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
        <Stack.Screen
        name="ViewSkillsScreen"
        component={ViewSkillsScreen}
        options={{ title: "View Skills" }}
        />
        <Stack.Screen
        name="ImproveSkillsScreen"
        component={ImproveSkillsScreen}
        options={{ title: "Improve Skills" }}
        />
        <Stack.Screen
        name="ManagePlayersScreen"
        component={ManagePlayersScreen}
        options={{ title: "Manage Player" }}
        />
        <Stack.Screen
        name="AddPlayerDetailsScreen"
        component={AddPlayerDetailsScreen}
        options={{ title: "Add Player Details" }}
        />

        
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
