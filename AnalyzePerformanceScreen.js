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
      Alert.alert("Succes", "Statistici salvate.");
    } catch (error) {
      console.error("Error saving stats:", error);
      Alert.alert("Eroare", "Nu s-au putut salva statisticile.");
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
      {playerData.map((player) => {
        const stats = extendedStats[player.id] || {};
        const prediction = predictions[player.id];

        return (
          <View key={player.id} style={styles.card}>
            <Text style={styles.name}>{player.name}</Text>
            <Text style={styles.score}>Clasificare ML: {prediction || 'Apasă pentru analiză'}</Text>

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
              <Text style={styles.predictText}>Generează evaluare</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={() => saveExtendedStats(player.id)}>
              <Text style={styles.saveText}>Salvează statistici</Text>
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
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  score: {
    fontSize: 16,
    color: '#333'
  },
  input: {
    backgroundColor: '#eee',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 4,
  },
  predictButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  predictText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
