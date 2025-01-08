import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function MenuPlayer({ navigation }) {
  const handleAction = (action) => {
    console.log(`Selected action: ${action}`);
    alert(`You selected: ${action}`);
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
