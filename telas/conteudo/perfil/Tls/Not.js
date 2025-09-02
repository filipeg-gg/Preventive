import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";

export default function Notificacoes({ navigation }) {
  const [lembretes, setLembretes] = useState(true);
  const [som, setSom] = useState(true);
  const [vibracao, setVibracao] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Perfil")}
        >
          <Text style={styles.arrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Notificações</Text>
      </View>

      {/* Opções */}
      <View style={styles.card}>
        <Text style={styles.label}>Emitir lembretes</Text>
        <Switch value={lembretes} onValueChange={setLembretes} />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Emitir som</Text>
        <Switch value={som} onValueChange={setSom} />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Emitir vibração</Text>
        <Switch value={vibracao} onValueChange={setVibracao} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  backButton: {
    padding: 10,
  },
  arrow: {
    fontSize: 24,
    color: "#333",
  },
  title: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    flex: 1,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  label: {
    fontSize: 14,
    color: "#333",
  },
});
