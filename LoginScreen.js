import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
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
        navigation.navigate("Menu"); // Redirect to MenuScreen
      })
      .catch((error) => {
        console.error("Login Error:", error);
        const friendlyMessage = getFriendlyErrorMessage(error.code);
        setErrorMessage(friendlyMessage);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
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
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#333",
  },
  errorText: {
    color: "#ff0000",
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 10,
  },
  linkText: {
    color: "#007bff",
    fontSize: 16,
  },
});
