import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, SafeAreaView, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Ajuda({ navigation }) {
  const contatos = [
    { label: "Nosso Site", url: "https://aedesblock.com", icon: "globe-outline", color: "#3B82F6" },
    { label: "Envie um Email", url: "mailto:contato@aedesblock.com", icon: "mail-outline", color: "#EA580C" },
    { label: "Instagram", url: "https://instagram.com/aedesblock", icon: "logo-instagram", color: "#EC4899" },
    { label: "WhatsApp", url: "https://wa.me/5511999999999", icon: "logo-whatsapp", color: "#22C55E" },
    { label: "Facebook", url: "https://facebook.com/aedesblock", icon: "logo-facebook", color: "#1D4ED8" },
  ];

  const abrirLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Erro ao abrir link:", err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Perfil")} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Central de Ajuda</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {contatos.map((item, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => abrirLink(item.url)}>
            <View style={styles.cardContent}>
              <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}> 
                 {/* O '20' no final da cor hex adiciona transparência automática */}
                 <Ionicons name={item.icon} size={22} color={item.color} />
              </View>
              <Text style={styles.label}>{item.label}</Text>
            </View>
            <Ionicons name="open-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
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
  cardContent: { flexDirection: "row", alignItems: "center" },
  iconBox: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  label: { fontSize: 15, color: "#374151", fontWeight: "600" },
});