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
  const [message, setMessage] = useState(""); 
  const [messageType, setMessageType] = useState("info"); 
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
      setMessage("Please fill out all fields."); 
      setMessageType("error"); 
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
      setMessage(""); 
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
      {message !== "" && ( 
        <Text 
          style={[ 
            styles.message, 
            messageType === "error" ? styles.errorText : styles.successText, 
          ]} 
        > 
          {message} 
        </Text> 
      )} 

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
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
    borderColor: "#cfe3cc",
    borderWidth: 1,
    fontSize: 16,
  },
  addButton: {
    marginBottom: 20,
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  listContainer: {
    paddingBottom: 20,
  },
  playerContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderColor: "#cfe3cc",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  playerText: {
    fontSize: 16,
    marginBottom: 4,
    color: "#444",
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "#d90429",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  message: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
  },
  errorText: {
    color: "#d90429",
  },
  successText: {
    color: "#28a745",
  },
});