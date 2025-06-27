import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

export default function AddPlayerDetailsScreen() {
  const [players, setPlayers] = useState([]);
  const [ratings, setRatings] = useState({});
  const [message, setMessage] = useState("");
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    fetchPlayers();
  }, [userId]);

  const fetchPlayers = async () => {
    if (!userId) return;

    try {
      const querySnapshot = await getDocs(collection(db, "players"));
      const playersList = querySnapshot.docs
        .filter((doc) => doc.data().userId === userId)
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setPlayers(playersList);

      // Initialize ratings for each player if not already set
      const initialRatings = {};
      playersList.forEach((player) => {
        initialRatings[player.id] = {
          shooting: player.shooting || 0,
          passing: player.passing || 0,
          dribbling: player.dribbling || 0,
          speed: player.speed || 0,
          strength: player.strength || 0,
          stamina: player.stamina || 0,
        };
      });
      setRatings(initialRatings);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const updatePlayerRatings = async (playerId) => {
    try {
      const playerRatings = ratings[playerId];
      const playerDoc = doc(db, "players", playerId);
      await updateDoc(playerDoc, {
        ...playerRatings,
      });
      setMessage("Player ratings updated successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating player ratings:", error);
      setMessage("Failed to update player ratings. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const renderPlayer = ({ item }) => {
    const playerRatings = ratings[item.id] || {
      shooting: 0,
      passing: 0,
      dribbling: 0,
      speed: 0,
      strength: 0,
      stamina: 0,
    };

    const updateRating = (skill, value) => {
      setRatings((prev) => ({
        ...prev,
        [item.id]: {
          ...prev[item.id],
          [skill]: value,
        },
      }));
    };

    return (
      <View style={styles.playerContainer}>
        <Text style={styles.playerText}>Name: {item.name}</Text>
        {Object.keys(playerRatings).map((skill) => (
          <View key={skill} style={styles.ratingContainer}>
            <Text style={styles.skillText}>{skill.charAt(0).toUpperCase() + skill.slice(1)}:</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => updateRating(skill, star)}
                >
                  <FontAwesome
                    name={star <= playerRatings[skill] ? "star" : "star-o"}
                    size={24}
                    color={star <= playerRatings[skill] ? "#f5d742" : "#ccc"}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => updatePlayerRatings(item.id)}
        >
          <Text style={styles.saveButtonText}>Save Ratings</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Player Details</Text>
      {message ? <Text style={styles.messageText}>{message}</Text> : null}
      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        renderItem={renderPlayer}
        contentContainerStyle={styles.listContainer}
      />
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
    marginBottom: 20,
    textAlign: "center",
    color: "#1e5128",
  },
  messageText: {
    fontSize: 16,
    color: "#28a745",
    textAlign: "center",
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  playerContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playerText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#14532d",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  skillText: {
    fontSize: 16,
    flex: 1,
    color: "#444",
  },
  starsContainer: {
    flexDirection: "row",
  },
  saveButton: {
    marginTop: 12,
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
