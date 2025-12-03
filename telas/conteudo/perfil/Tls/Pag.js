import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Pagamento({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Padrão */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Perfil")} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Pagamento</Text>
        <View style={{width: 24}} />
      </View>

      {/* Conteúdo Em Desenvolvimento */}
      <View style={styles.content}>
        <Ionicons name="card-outline" size={80} color="#D1D5DB" />
        <Text style={styles.subTitle}>Em desenvolvimento</Text>
        <Text style={styles.text}>Em breve você poderá gerenciar seus métodos de pagamento por aqui.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15, backgroundColor: "#fff", elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 3 },
  backBtn: { padding: 5 },
  title: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  content: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  subTitle: { fontSize: 20, fontWeight: "bold", color: "#374151", marginTop: 20, marginBottom: 10 },
  text: { fontSize: 15, color: "#6B7280", textAlign: "center", lineHeight: 22 },
});