import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from "react-native";
import { db, auth } from "./firebase";
import { collection, getDocs, query, where, addDoc, deleteDoc, doc } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";

const trainingOptions = [
  "Improve Shooting",
  "Improve Passing",
  "Improve Dribbling",
  "Improve Speed",
  "Improve Stamina",
  "Improve Strength",
  "Improve Tactic"
];

export default function CreateTrainingScreen() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [notes, setNotes] = useState("");
  const [sessions, setSessions] = useState([]);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchPlayers = async () => {
      const q = query(collection(db, "players"), where("userId", "==", userId));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPlayers(list);
    };

    const fetchSessions = async () => {
      const q = query(collection(db, "trainingSessions"), where("coachId", "==", userId));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSessions(list);
    };

    if (userId) {
      fetchPlayers();
      fetchSessions();
    }
  }, [userId]);

  const toggleSelection = (id, list, setList) => {
    if (list.includes(id)) {
      setList(list.filter((item) => item !== id));
    } else {
      setList([...list, id]);
    }
  };

  const handleCreateSession = async () => {
    if (selectedPlayers.length === 0 || selectedExercises.length === 0) {
      Alert.alert("Error", "Selectează cel puțin un jucător și un antrenament.");
      return;
    }

    try {
      await addDoc(collection(db, "trainingSessions"), {
        coachId: userId,
        players: selectedPlayers,
        exercises: selectedExercises,
        date: date.toISOString(),
        notes,
      });
      Alert.alert("Succes", "Sesiunea de antrenament a fost creată.");
      setSelectedPlayers([]);
      setSelectedExercises([]);
      setNotes("");
      setDate(new Date());
      const snapshot = await getDocs(query(collection(db, "trainingSessions"), where("coachId", "==", userId)));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSessions(list);
    } catch (error) {
      console.error("Error creating session:", error);
      Alert.alert("Eroare", "Nu s-a putut salva sesiunea.");
    }
  };

  const handleDeleteSession = async (id) => {
    try {
      await deleteDoc(doc(db, "trainingSessions", id));
      setSessions(sessions.filter((session) => session.id !== id));
    } catch (error) {
      console.error("Error deleting session:", error);
      Alert.alert("Eroare", "Nu s-a putut șterge sesiunea.");
    }
  };

  const getPlayerNames = (ids) => {
    return players
      .filter((player) => ids.includes(player.id))
      .map((player) => player.name)
      .join(", ");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Training Session</Text>

      <Text style={styles.subtitle}>Select Exercises:</Text>
      {trainingOptions.map((exercise) => (
        <TouchableOpacity
          key={exercise}
          style={[styles.option, selectedExercises.includes(exercise) && styles.selected]}
          onPress={() => toggleSelection(exercise, selectedExercises, setSelectedExercises)}
        >
          <Text>{exercise}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.subtitle}>Select Players:</Text>
      <View style={styles.largeList}>
        {players.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.option, selectedPlayers.includes(item.id) && styles.selected]}
            onPress={() => toggleSelection(item.id, selectedPlayers, setSelectedPlayers)}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text style={styles.dateText}>Date & Time: {date.toLocaleString()}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={(e, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <TextInput
        style={styles.textArea}
        placeholder="Observații pentru antrenament..."
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleCreateSession}>
        <Text style={styles.saveText}>Create Session</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Existing Sessions:</Text>
      <ScrollView style={styles.scrollArea}>
        {sessions.map((item) => (
          <View key={item.id} style={styles.sessionCard}>
            <Text style={styles.sessionText}>Date: {new Date(item.date).toLocaleString()}</Text>
            <Text style={styles.sessionText}>Exercises: {item.exercises.join(", ")}</Text>
            <Text style={styles.sessionText}>Players: {getPlayerNames(item.players)}</Text>
            <Text style={styles.sessionText}>Notes: {item.notes}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteSession(item.id)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
  },
  option: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
    marginVertical: 5,
  },
  selected: {
    backgroundColor: "#cce5ff",
  },
  dateText: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    color: "#007bff",
  },
  textArea: {
    height: 100,
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginVertical: 15,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  sessionCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
    marginVertical: 5,
  },
  sessionText: {
    fontSize: 14,
    color: "#333",
  },
  largeList: {
    maxHeight: 400,
    marginBottom: 15,
  },
  scrollArea: {
    maxHeight: 300,
    marginBottom: 20,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "#dc3545",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
