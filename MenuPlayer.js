import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function MenuPlayer({ navigation }) {
  const handleAction = (action) => {
    if (action === "Training Video") {
      navigation.navigate("TrainingVideoScreen"); // Navigate to TrainingVideoScreen
    } 
    if (action === "View Skills") {
      navigation.navigate("ViewSkillsScreen");
    }    
    if (action === "Improve Skills") {
      navigation.navigate("ImproveSkillsScreen");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Player Menu</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleAction("Training Video")}
      >
        <Text style={styles.buttonText}>Training Video</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleAction("Improve Skills")}
      >
        <Text style={styles.buttonText}>Improve Skills</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleAction("View Skills")}
      >
        <Text style={styles.buttonText}>View Skills</Text>
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