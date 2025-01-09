import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const getFriendlyErrorMessage = (errorCode) => {
    const errorMessages = {
      "auth/invalid-email": "The email address is not valid. Please check and try again.",
      "auth/email-already-in-use": "This email is already associated with an account.",
      "auth/weak-password": "The password is too weak. Please use a stronger password.",
      "auth/too-many-requests": "Too many attempts. Please wait and try again later.",
    };

    return errorMessages[errorCode] || "An unexpected error occurred. Please try again.";
  };

  const handleSignUp = () => {
    setErrorMessage(""); // Reset error message

    if (!email || !password) {
      setErrorMessage("Please fill out both email and password fields.");
      return;
    }

    // Perform sign-up with Firebase
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User created:", user);
        setErrorMessage("Account created successfully! Redirecting...");
        navigation.navigate("Login"); // Redirect to LoginScreen after successful sign-up
      })
      .catch((error) => {
        console.error("Firebase SignUp Error:", error);
        const friendlyMessage = getFriendlyErrorMessage(error.code);
        setErrorMessage(friendlyMessage);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.linkText}>Already have an account? Login</Text>
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
    backgroundColor: "#28a745",
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
