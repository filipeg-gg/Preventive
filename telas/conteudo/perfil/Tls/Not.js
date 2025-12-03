import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, SafeAreaView, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Notificacoes({ navigation }) {
  const [lembretes, setLembretes] = useState(true);
  const [som, setSom] = useState(true);
  const [vibracao, setVibracao] = useState(false);

  const renderSwitch = (label, value, setValue) => (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Switch 
        value={value} 
        onValueChange={setValue} 
        trackColor={{false: "#767577", true: "#3B82F6"}} 
        thumbColor={value ? "#fff" : "#f4f3f4"}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Perfil")} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Notificações</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {renderSwitch("Emitir lembretes", lembretes, setLembretes)}
        {renderSwitch("Emitir som", som, setSom)}
        {renderSwitch("Emitir vibração", vibracao, setVibracao)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15, backgroundColor: "#fff", elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 3 },
  backBtn: { padding: 5 },
  title: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  scroll: { padding: 20 },
  card: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#E5E7EB" },
  label: { fontSize: 15, color: "#374151", fontWeight: "500" },
});