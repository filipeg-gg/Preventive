import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";

export default function Ajuda({ navigation }) {
  const contatos = [
    { label: "🌐 Nosso Site", url: "https://aedesblock.com" },
    { label: "✉️ Email", url: "mailto:contato@aedesblock.com" },
    { label: "📸 Instagram", url: "https://instagram.com/aedesblock" },
    { label: "💬 WhatsApp", url: "https://wa.me/5511999999999" },
    { label: "📘 Facebook", url: "https://facebook.com/aedesblock" },
  ];

  const abrirLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Erro ao abrir link:", err)
    );
  };

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
        <Text style={styles.title}>Ajuda</Text>
      </View>

      {/* Lista de contatos */}
      {contatos.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.contactItem}
          onPress={() => abrirLink(item.url)}
        >
          <Text style={styles.contactText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    flex: 1,
  },
  contactItem: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
});
