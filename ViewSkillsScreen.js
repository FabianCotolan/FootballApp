import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

const skills = ["Shooting", "Passing", "Dribbling", "Speed", "Strength", "Stamina"];

export default function ViewSkillsScreen() {
  const [ratings, setRatings] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    // Fetch ratings from Firestore for the logged-in user
    const fetchRatings = async () => {
      if (userId) {
        const docRef = doc(db, "skills", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRatings(docSnap.data());
        } else {
          // Initialize ratings to 0 for each skill if not set
          const initialRatings = skills.reduce((acc, skill) => ({ ...acc, [skill]: 0 }), {});
          setRatings(initialRatings);
        }
      }
    };

    fetchRatings();
  }, [userId]);

  const updateRating = (skill, rating) => {
    const updatedRatings = { ...ratings, [skill]: rating };
    setRatings(updatedRatings);
  };

  const saveRatings = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!userId) {
      setErrorMessage("You must be logged in to save your ratings.");
      return;
    }

    try {
      const docRef = doc(db, "skills", userId);
      await setDoc(docRef, ratings);
      setSuccessMessage("Your ratings have been saved successfully.");
    } catch (error) {
      console.error("Error saving ratings:", error);
      setErrorMessage("Failed to save your ratings. Please try again.");
    }
  };

  const renderSkill = ({ item: skill }) => {
    const rating = ratings[skill] || 0;

    return (
      <View style={styles.skillContainer}>
        <Text style={styles.skillText}>{skill}</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => updateRating(skill, star)}>
              <FontAwesome
                name={star <= rating ? "star" : "star-o"}
                size={32}
                color={star <= rating ? "#f5d742" : "#ccc"}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate Your Skills</Text>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
      <FlatList
        data={skills}
        keyExtractor={(item) => item}
        renderItem={renderSkill}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveRatings}>
        <Text style={styles.saveButtonText}>Save</Text>
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
    textAlign: "center",
    marginBottom: 20,
    color: "#1e5128", 
  },
  errorText: {
    color: "#d90429",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 10,
  },
  successText: {
    color: "#28a745",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  skillContainer: {
    marginBottom: 25,
  },
  skillText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#14532d", 
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
  saveButton: {
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
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});