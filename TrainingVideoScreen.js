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
    backgroundColor: "#eafaf1", 
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1e5128", 
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  videoContainer: {
    marginBottom: 25,
    alignItems: "center",
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#14532d",
  },
  video: {
    width: "100%",
    height: 200,
    backgroundColor: "#000",
    borderRadius: 12,
    overflow: "hidden",
  },
  backButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#28a745", 
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
