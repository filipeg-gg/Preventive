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

export default function Cuidados() {
  const navigation = useNavigation();

    // ======== Drawer lateral ========
    const [drawerVisible, setDrawerVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(Dimensions.get("window").width)).current;
  
    useEffect(() => {
      if (drawerVisible) {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(slideAnim, {
          toValue: Dimensions.get("window").width,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }, [drawerVisible]);

  const cuidados = [
    {
      id: 1,
      titulo: "Relatórios",
      desc: "Historico de relatórios sobre sua saúde",
      icon: "file-text",
      colors: ["#8DF3C7", "#FFDFE0"],
      screen: "Relatorios",
    },
    {
      id: 2,
      titulo: "Medicamentos",
      desc: "Adicione seus medicamentos",
      icon: "plus-circle",
      colors: ["#FF8F8F", "#FFDFE0"],
      screen: "Medicamentos",
    },
    {
      id: 3,
      titulo: "Seu diário",
      desc: "Registre seu dia, acompanhe sua luta",
      icon: "book",
      colors: ["#CADBFE", "#DFEAFF"],
      screen: "Diario",
    },
    {
      id: 4,
      titulo: "Yoga",
      desc: "Que tal relaxar o corpo e a mente?",
      icon: "wind",
      colors: ["#DACDFF", "#fbcfe8"],
      screen: "Yoga",
    },
    {
      id: 5,
      titulo: "Respiração",
      desc: "Amenize sua ansiedade",
      icon: "activity",
      colors: ["#FF9ED3", "#FFDFF1"],
      screen: "Respiracao",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.avatar}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Perfil")}
        >
          <Icon name="user" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Meus cuidados</Text>

              <TouchableOpacity
                style={styles.iconButton}
                activeOpacity={0.8}
                onPress={() => setDrawerVisible(true)} 
              >
                <Icon name="more-vertical" size={24} color="#6b7280" />
              </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {cuidados.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                {
                  backgroundColor: item.colors[0],
                  shadowColor: item.colors[1],
                },
              ]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Icon
                name={item.icon}
                size={22}
                color="#1f2937"
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
          <Icon name="heart" size={25} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Perfil")}
        >
          <Icon name="user" size={25} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Drawer lateral */}
            <Modal
              visible={drawerVisible}
              transparent
              animationType="none"
              onRequestClose={() => setDrawerVisible(false)}
            >
              <TouchableOpacity
                style={styles.drawerOverlay}
                activeOpacity={1}
                onPressOut={() => setDrawerVisible(false)}
              >
                <Animated.View
                  style={[
                    styles.drawerContent,
                    { transform: [{ translateX: slideAnim }] },
                  ]}
                >
                  <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate("Principal")}>
                    <Text style={styles.drawerText}>Principal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate("Exames")}>
                    <Text style={styles.drawerText}>Exames</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate("Cuidados")}>
                    <Text style={styles.drawerText}>Cuidados</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate("Perfil")}>
                    <Text style={styles.drawerText}>Perfil</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.drawerItem} onPress={() => alert("Inicial")}>
                    <Text style={styles.drawerText}>Sair</Text>
                  </TouchableOpacity>
                </Animated.View>
      
              </TouchableOpacity>
            </Modal>
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
