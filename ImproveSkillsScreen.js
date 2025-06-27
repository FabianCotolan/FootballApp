import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const skillsData = [
  {
    title: "Improve Shooting",
    description:
      "Exersează diferite tipuri de șuturi (plasat, cu forță, lob) din diverse poziții și unghiuri. Folosește ținte la colțurile porții pentru a lucra la precizie. Repetă secvențele de șut rapid după primirea unei pase. Analizează poziția corpului și mișcarea piciorului pentru o tehnică corectă.",
  },
  {
    title: "Improve Passing",
    description:
      "Practică pase scurte și lungi cu un partener sau cu o țintă fixă, cum ar fi un con sau o minge statică. Concentrează-te pe precizia și viteza pasei. Lucrează la pasele sub presiune în jocuri mici, pentru a-ți îmbunătăți deciziile rapide.",
  },
  {
    title: "Improve Dribbling",
    description:
      "Exersează driblingul printre jaloane sau conuri, menținând mingea cât mai aproape de picior. Încearcă să folosești ambele picioare pentru un control mai bun. Joacă jocuri mici (1v1) pentru a dezvolta abilitatea de a învinge adversari în situații reale.",
  },
  {
    title: "Improve Speed",
    description:
      "Fă sprinturi pe distanțe scurte și repetate, cu pauze scurte între ele. Adaugă exerciții de pliometrie, cum ar fi sărituri, pentru a-ți dezvolta explozia. Include alergări cu schimbări rapide de direcție pentru a îmbunătăți agilitatea și reacția.",
  },
  {
    title: "Improve Strength",
    description:
      "Include în antrenament exerciții de forță, cum ar fi genuflexiuni, flotări sau ridicări de greutăți, adaptate vârstei și nivelului tău. Concentrează-te pe zonele de bază, cum ar fi picioarele, spatele și abdomenul. Exercițiile cu benzi elastice pot fi utile pentru stabilitate și echilibru.",
  },
  {
    title: "Improve Stamina",
    description:
      "Aleargă pe distanțe lungi pentru a-ți îmbunătăți rezistența aerobă. Integrează antrenamente de tip interval (alergare rapidă alternată cu alergare ușoară) pentru a dezvolta rezistența anaerobă. Nu uita să îți menții o hidratare și nutriție adecvată pentru a susține efortul prelungit.",
  },
];

export default function ImproveSkillsScreen() {
  const renderSkill = ({ item }) => (
    <View style={styles.skillContainer}>
      <Text style={styles.skillTitle}>{item.title}</Text>
      <Text style={styles.skillDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Improve Your Skills</Text>
      <FlatList
        data={skillsData}
        keyExtractor={(item) => item.title}
        renderItem={renderSkill}
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
  listContainer: {
    paddingBottom: 20,
  },
  skillContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  skillTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#14532d", 
  },
  skillDescription: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
  },
});