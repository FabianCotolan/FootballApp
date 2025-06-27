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
  const [message, setMessage] = useState(""); 
  const [messageType, setMessageType] = useState("info"); 

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
      setMessage("Select at least one player and one training session."); 
      setMessageType("error"); 
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
      
      setSelectedPlayers([]);
      setSelectedExercises([]);
      setNotes("");
      setDate(new Date());
      const snapshot = await getDocs(query(collection(db, "trainingSessions"), where("coachId", "==", userId)));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSessions(list);
      setMessage("The training session has been created."); 
      setMessageType("success"); 
    } catch (error) {
      console.error("Error creating session:", error);
      setMessage("Error saving session."); 
      setMessageType("error"); 
    }
  };

  const handleDeleteSession = async (id) => {
    try {
      await deleteDoc(doc(db, "trainingSessions", id));
      setSessions(sessions.filter((session) => session.id !== id));
    } catch (error) {
      console.error("Error deleting session:", error);
      setMessage("Error deleting session."); 
      setMessageType("error"); 
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
      <View style={styles.scrollablePlayerListContainer}> 
        <ScrollView style={styles.playerScroll} nestedScrollEnabled={true}> 
          {players.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.option, selectedPlayers.includes(item.id) && styles.selected]}
              onPress={() => toggleSelection(item.id, selectedPlayers, setSelectedPlayers)}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
        placeholder="Training notes..."
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
    backgroundColor: "#eafaf1",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1e5128",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "#14532d",
    marginVertical: 10,
    fontWeight: "600",
  },
  option: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 6,
    borderColor: "#cfe3cc",
    borderWidth: 1,
  },
  selected: {
    backgroundColor: "#d0f0c0",
    borderColor: "#28a745",
    borderWidth: 2,
  },
   scrollablePlayerListContainer:{
    height: 200, 
    marginBottom: 20, 
    borderRadius: 10, 
    overflow: 'hidden', 
    backgroundColor: "#f0fdf4", 
    borderColor: "#cfe3cc", 
    borderWidth: 1, 
  },
  playerScroll: { 
    paddingHorizontal: 5, 
  },
  dateText: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    color: "#14532d",
    fontWeight: "500",
  },
  textArea: {
    height: 100,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#cfe3cc",
    borderWidth: 1,
    padding: 12,
    marginVertical: 15,
    textAlignVertical: "top",
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  sessionCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    borderColor: "#cfe3cc",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  sessionText: {
    fontSize: 15,
    color: "#444",
    marginBottom: 3,
  },
  largeList: {
  maxHeight: 300, 
  marginBottom: 25, 
  paddingBottom: 20, 
},
  scrollArea: {
    maxHeight: 300,
    marginBottom: 30,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "#d90429",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  message: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
  },
  errorText: {
    color: "#d90429",
  },
  successText: {
    color: "#28a745",
  },
});