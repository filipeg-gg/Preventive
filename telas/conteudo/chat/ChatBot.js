import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

export default function ChatBot() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
                <View style={[styles.header ]}>
                  <View style={styles.headerContent}>
                    <TouchableOpacity style={styles.avatar} activeOpacity={0.8}>
                      <Icon name="user" size={24} color="#6b7280" />
                    </TouchableOpacity>
      
                    <Text style={styles.headerText}>ChatBot</Text>
      
                    <TouchableOpacity style={styles.iconButton} activeOpacity={0.8} onPress={() => navigation.navigate("Perfil")}>
                      <Icon name="settings" size={24} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                </View>

      {/* Conteúdo */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

      </ScrollView>

      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Principal")}
        >
          <Icon name="home" size={25} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Exames")}
        >
          <Icon name="file-text" size={25} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Cuidados")}
        >
          <Icon name="heart" size={25} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("ChatBot")}
        >
          <Icon name="user" size={25} color="#3b82f6" />
        </TouchableOpacity>
      </View>

    
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,  
    backgroundColor: "#AFC8FF",
    height: 120,
  },
    headerContent: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: "#6b7280",
    justifyContent: "center",
    alignItems: "center",
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  drawerContent: {
      width: "70%",
      height: "100%",
      backgroundColor: "#fff",
      paddingVertical: 30,
      paddingHorizontal: 20,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      elevation: 10,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: { width: -2, height: 2 },
  },
  drawerItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  drawerText: {
    fontSize: 14,
    color: "#333",

  },
  headerText: { fontSize: 20, fontWeight: "700", color: "#fff" },
  content: { flex: 1, padding: 16, marginTop: 16 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  cardIcon: {
    alignSelf: "flex-start",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginTop: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: "#374151",
    marginTop: 4,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 20,
    marginHorizontal: 20,
    bottom: 40,
  },
  navItem: { alignItems: "center" },
});
