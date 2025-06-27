import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function MenuCoach({ navigation }) {
  const handleAction = (action) => {
    if (action === "Manage Player") {
      navigation.navigate("ManagePlayersScreen");
    }
    if (action === "Add player details") {
      navigation.navigate("AddPlayerDetailsScreen");
    } 
    if (action === "Create training sessions") {
      navigation.navigate("CreateTrainingScreen");
    }
    if (action === "Analyze performance") {
      navigation.navigate("AnalyzePerformanceScreen");
    }
    if (action === "Training Recommendations") {
      navigation.navigate("TrainingRecommendations");
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Coach Menu</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleAction("Manage Player")}
      >
        <Text style={styles.buttonText}>Manage Player</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleAction("Add player details")}
      >
        <Text style={styles.buttonText}>Add Player Details</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleAction("Create training sessions")}
      >
        <Text style={styles.buttonText}>Create Training Sessions</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleAction("Analyze performance")}
      >
        <Text style={styles.buttonText}>Analyze Performance</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
      style={styles.button}
      onPress={() => handleAction("Training Recommendations")}
      >
    <Text style={styles.buttonText}>Training Recommendations</Text>
    </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eafaf1", 
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1e5128", 
    marginBottom: 30,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#28a745", 
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});