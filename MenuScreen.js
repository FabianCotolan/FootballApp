import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function MenuScreen({ navigation }) {
  const handleOptionSelect = (option) => {
    if (option === "Player") {
      navigation.navigate("MenuPlayer"); 
    } else if (option === "Coach") {
      navigation.navigate("MenuCoach"); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Role</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleOptionSelect("Player")}
      >
        <Text style={styles.buttonText}>Player</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleOptionSelect("Coach")}
      >
        <Text style={styles.buttonText}>Coach</Text>
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
