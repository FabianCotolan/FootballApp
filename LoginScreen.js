import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const getFriendlyErrorMessage = (errorCode) => {
    const errorMessages = {
      "auth/invalid-email": "The email address is not valid. Please check and try again.",
      "auth/user-disabled": "This account has been disabled. Please contact support.",
      "auth/user-not-found": "No account found with this email. Please sign up first.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/too-many-requests": "Too many login attempts. Please wait and try again later.",
    };
    return errorMessages[errorCode] || "An unexpected error occurred. Please try again.";
  };

  const handleLogin = () => {
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please fill out both email and password fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User logged in:", user);
        navigation.navigate("Menu");
      })
      .catch((error) => {
        console.error("Login Error:", error);
        const friendlyMessage = getFriendlyErrorMessage(error.code);
        setErrorMessage(friendlyMessage);
      });
  };

  return (
    <View style={styles.container}>

      <Image
      source={require("./assets/images/logoFapp.png")} 
      style={styles.logo}
      resizeMode="contain"
      />
      
      <Text style={styles.emoji}>⚽</Text>
      <Text style={styles.title}>Welcome to FootballApp</Text>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eafaf1", 
    padding: 20,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1e5128", 
    marginBottom: 30,
  },
  errorText: {
    color: "#d90429",
    fontSize: 15,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderColor: "#cfe3cc",
    borderWidth: 1,
    fontSize: 16,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#28a745",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  linkButton: {
    marginTop: 10,
  },
  linkText: {
    color: "#14532d",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  logo: {
  width: 120,
  height: 120,
  marginBottom: 10,
},
});
