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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#333",
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
