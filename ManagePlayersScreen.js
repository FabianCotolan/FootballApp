import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "./firebase";

export default function ManagePlayersScreen() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [position, setPosition] = useState("");
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    fetchPlayers();
  }, [userId]);

  const fetchPlayers = async () => {
    if (!userId) return;

    try {
      const q = query(collection(db, "players"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const playersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPlayers(playersList);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const addPlayer = async () => {
    if (!name || !age || !height || !weight || !position) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "players"), {
        name,
        age,
        height,
        weight,
        position,
        userId,
      });
      setPlayers([...players, { id: docRef.id, name, age, height, weight, position, userId }]);
      setName("");
      setAge("");
      setHeight("");
      setWeight("");
      setPosition("");
    } catch (error) {
      console.error("Error adding player:", error);
    }
  };

  const deletePlayer = async (id) => {
    try {
      await deleteDoc(doc(db, "players", id));
      setPlayers(players.filter((player) => player.id !== id));
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };

  const renderPlayer = ({ item }) => (
    <View style={styles.playerContainer}>
      <Text style={styles.playerText}>Name: {item.name}</Text>
      <Text style={styles.playerText}>Age: {item.age}</Text>
      <Text style={styles.playerText}>Height: {item.height} cm</Text>
      <Text style={styles.playerText}>Weight: {item.weight} kg</Text>
      <Text style={styles.playerText}>Position: {item.position}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deletePlayer(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Players</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />
      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Position (Goalkeeper, Midfielder, Forward)"
        value={position}
        onChangeText={setPosition}
      />
      <TouchableOpacity style={styles.addButton} onPress={addPlayer}>
        <Text style={styles.addButtonText}>Add Player</Text>
      </TouchableOpacity>
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
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  addButton: {
    marginBottom: 20,
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 20,
  },
  playerContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  playerText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
