import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import { db, auth } from "./firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { trainModel } from './mlModel';
import { predictPlayerLevel } from './predictPlayerLevel';

export default function AnalyzePerformanceScreen() {
  const [playerData, setPlayerData] = useState([]);
  const [extendedStats, setExtendedStats] = useState({});
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState({});
  const [message, setMessage] = useState(""); 
  const [messageType, setMessageType] = useState("info"); 

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const q = query(collection(db, "players"), where("userId", "==", userId));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlayerData(data);
      } catch (error) {
        console.error("Error fetching player details:", error);
      }
    };

    const initializeTF = async () => {
      await tf.ready();
      const m = await trainModel();
      setModel(m);
    };

    if (userId) {
      fetchPlayerData();
      initializeTF();
    }
  }, [userId]);

  const handleInputChange = (playerId, field, value) => {
    setExtendedStats(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: value,
      },
    }));
  };

  const saveExtendedStats = async (playerId) => {
    const data = extendedStats[playerId];
    if (!data) return;

    try {
      await addDoc(collection(db, "performanceStats"), {
        userId,
        playerId,
        ...data,
      });
      setMessage("Statistics saved."); 
      setMessageType("success"); 
    } catch (error) {
      console.error("Error saving stats:", error);
      setMessage("Error saving statistics."); 
      setMessageType("error"); 
    }
  };

  const handlePredict = async (playerId, stats) => {
    if (!model) return;

    const input = [
      parseFloat(stats.shooting || 0),
      parseFloat(stats.passing || 0),
      parseFloat(stats.dribbling || 0),
      parseFloat(stats.speed || 0),
      parseFloat(stats.strength || 0),
      parseFloat(stats.stamina || 0),
      parseFloat(stats.goals || 0),
      parseFloat(stats.assists || 0),
      parseFloat(stats.successfulPasses || 0),
      parseFloat(stats.shotsOnTarget || 0),
      parseFloat(stats.distance || 0),
    ];

    const result = await predictPlayerLevel(model, input);
    setPredictions(prev => ({ ...prev, [playerId]: result }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Analyze Performance</Text>

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

      {playerData.map((player) => {
        const stats = extendedStats[player.id] || {};
        const prediction = predictions[player.id];

        return (
          <View key={player.id} style={styles.card}>
            <Text style={styles.name}>{player.name}</Text>
            <Text style={styles.score}>Classification ML: {prediction || 'Click for analysis'}</Text>

            <TextInput style={styles.input} placeholder="Distance Covered (km)" keyboardType="numeric"
              onChangeText={(value) => handleInputChange(player.id, "distance", value)} />
            <TextInput style={styles.input} placeholder="Successful Passes" keyboardType="numeric"
              onChangeText={(value) => handleInputChange(player.id, "successfulPasses", value)} />
            <TextInput style={styles.input} placeholder="Goals" keyboardType="numeric"
              onChangeText={(value) => handleInputChange(player.id, "goals", value)} />
            <TextInput style={styles.input} placeholder="Assists" keyboardType="numeric"
              onChangeText={(value) => handleInputChange(player.id, "assists", value)} />
            <TextInput style={styles.input} placeholder="Shots on Target" keyboardType="numeric"
              onChangeText={(value) => handleInputChange(player.id, "shotsOnTarget", value)} />

            <TouchableOpacity style={styles.predictButton} onPress={() => handlePredict(player.id, { ...player, ...stats })}>
              <Text style={styles.predictText}>Generate evaluation</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={() => saveExtendedStats(player.id)}>
              <Text style={styles.saveText}>Save statistics</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#eafaf1',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1e5128',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    borderColor: "#cfe3cc",
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  score: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderColor: "#ced4da",
    borderWidth: 1,
    marginVertical: 5,
    fontSize: 16,
  },
  predictButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  predictText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
  },
  errorText: {
    color: "#dc3545",
  },
  successText: {
    color: "#28a745",
  },
});