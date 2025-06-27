
import React, { useEffect } from 'react';
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
import CreateTrainingScreen from './CreateTrainingScreen';
import AnalyzePerformanceScreen from './AnalyzePerformanceScreen';
import TrainingRecommendationsScreen from './TrainingRecommendationsScreen';
import '@tensorflow/tfjs-react-native';



const Stack = createStackNavigator();

export default function App() {

  useEffect(() => {
    (async () => {
      await tf.ready();
      await tf.setBackend('cpu'); // stabil backend pentru Expo
      console.log('TFJS backend:', tf.getBackend());
    })();
  }, []);

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
        <Stack.Screen
        name="CreateTrainingScreen"
        component={CreateTrainingScreen}
        options={{ 
          title: "Create Training Sessions",
          headerBackTitle: "Back"
         }}
        
        />
        <Stack.Screen
        name="AnalyzePerformanceScreen"
        component={AnalyzePerformanceScreen}
        options={{ 
          title: "Analyze Performance",
           headerBackTitle: "Back" }}
        />
        <Stack.Screen
        name="TrainingRecommendations"
        component={TrainingRecommendationsScreen}
        options={{ title: "Training Recommendations" }}
        />

        
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
