import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Video } from "expo-av";

const videos = [
  {
    id: "1",
    title: "Improve Shooting",
    source: require("./assets/videos/improve_shooting.mp4"), 
  },
  {
    id: "2",
    title: "Improve Passing",
    source: require("./assets/videos/improve_passing.mp4"), 
  },
  {
    id: "3",
    title: "Improve Dribbling",
    source: require("./assets/videos/improve_dribbling.mp4"), 
  },
  {
    id: "4",
    title: "Improve Speed",
    source: require("./assets/videos/improve_speed.mp4"), 
  },
  {
    id: "5",
    title: "Improve Strength",
    source: require("./assets/videos/improve_strength.mp4"), 
  },
  {
    id: "6",
    title: "Improve Stamina",
    source: require("./assets/videos/improve_stamina.mp4"), 
  },
];

export default function TrainingVideoScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <View style={styles.videoContainer}>
      <Text style={styles.videoTitle}>{item.title}</Text>
      <Video
        source={item.source}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
        isLooping
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Training Videos</Text>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  listContainer: {
    paddingBottom: 20,
  },
  videoContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#555",
  },
  video: {
    width: "100%",
    height: 200,
    backgroundColor: "#000",
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
