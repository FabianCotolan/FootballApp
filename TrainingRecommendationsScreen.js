import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

export default function TrainingRecommendationsScreen() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse('');

    try {
      const result = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer sk-API`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a football training assistant. Give concise, smart, professional recommendations.' },
            { role: 'user', content: prompt },
          ],
        }),
      });

      const data = await result.json();
      console.log('OpenAI response:', JSON.stringify(data, null, 2));

      const aiMessage =
        data?.choices?.[0]?.message?.content ||
        data?.choices?.[0]?.text ||
        null;

      if (aiMessage) {
        setResponse(aiMessage.trim());
      } else {
        setResponse('Not receive a valid response.');
      }
    } catch (error) {
      console.error('Error API:', error);
      setResponse('Error with the OpenAI server.');
    }

    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Training Recommendations</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe what you need... ex: Slow speed player"
        value={prompt}
        onChangeText={setPrompt}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={getRecommendations}>
        <Text style={styles.buttonText}>Generate recommendation</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : (
        <Text style={styles.response}>{response}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#eafaf1',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1e5128',
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cfe3cc',
    minHeight: 100,
    marginBottom: 15,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17,
  },
  response: {
    marginTop: 20,
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
    backgroundColor: '#fdfdfd',
    padding: 15,
    borderRadius: 10,
    borderColor: '#cce5d8',
    borderWidth: 1,
  },
});
