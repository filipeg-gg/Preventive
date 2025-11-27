import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Modal, Dimensions, Animated, Easing} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebaseConfig"; 


const { width, height } = Dimensions.get("window");

export default function Exames() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("exames");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [searchResul, setSearchResul] = useState("");
  const [filterResul, setFilterResul] = useState("Todos");
  const [selectedItem, setSelectedItem] = useState(null);


  const [fadeAnim] = useState(new Animated.Value(0));

  const openModal = (item) => {
    setSelectedItem(item);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setSelectedItem(null));
  };

  const [exames, setExames] = useState([]);
  const [examesResul, setResultados] = useState([]);

  useEffect(() => {
    const unsubscribeExames = onSnapshot(collection(db, "eventos"), snap => {
      const dados = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setExames(dados.filter(item => item.categoria === "exame"));
      setResultados(dados.filter(item => item.categoria === "resultado"));
    });

    return () => unsubscribeExames();
  }, []);



  const examesFiltrados = exames.filter(
    (exame) =>
      (exame.nome.toLowerCase().includes(search.toLowerCase()) ||
        exame.data.includes(search)) &&
      (filter === "Todos" || exame.tipo === filter)
  );

  const resultadosFiltrados = examesResul.filter(
    (exame) =>
      (exame.nome.toLowerCase().includes(searchResul.toLowerCase()) ||
        exame.data.includes(searchResul)) &&
      (filterResul === "Todos" || exame.tipo === filterResul)
  );


  const getCardColor = (categoria) => {
    return categoria === "exame" ? "#f472b6" : "#60a5fa";
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>

        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.avatar} activeOpacity={0.8}>
            <Icon name="user" size={24} color="#6b7280" />
          </TouchableOpacity>

          <Text style={styles.headerText}>Meus exames</Text>

          <TouchableOpacity
            style={styles.avatar}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Perfil")}
          >
            <Icon name="settings" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>


        <View style={styles.headerBottom}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "exames" && styles.tabButtonActive]}
            onPress={() => setActiveTab("exames")}
          >
            <Text style={[styles.tabText, activeTab === "exames" && styles.tabTextActive]}>
              Seus Exames
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "resultados" && styles.tabButtonActive]}
            onPress={() => setActiveTab("resultados")}
          >
            <Text style={[styles.tabText, activeTab === "resultados" && styles.tabTextActive]}>
              Resultados
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === "exames" && (
          <View>
            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Pesquisar um exame"
                placeholderTextColor="#9ca3af"
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
              />
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setFilter(filter === "Todos" ? "Imagem" : "Todos")}
              >
                <Text style={styles.filterText}>
                  {filter === "Todos" ? "Filtrar" : filter}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("NovoEve", { tipo: "exame" })}
            >
              <Icon name="plus" size={18} color="#fff" />
              <Text style={styles.addButtonText}>Adicionar novo</Text>
            </TouchableOpacity>

            {examesFiltrados.map((exame) => (
              <TouchableOpacity
                key={exame.id}
                style={[styles.card, { backgroundColor: getCardColor(exame.categoria) }]}
                onPress={() => openModal(exame)}
              >
                <Icon name="file-text" size={22} color="#fff" style={styles.cardIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{exame.nome}</Text>
                  <Text style={styles.cardDate}>{exame.data}</Text>
                </View>
                <Icon name="chevron-right" size={22} color="#6b7280" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === "resultados" && (
          <View>
            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Pesquisar resultado"
                placeholderTextColor="#9ca3af"
                style={styles.searchInput}
                value={searchResul}
                onChangeText={setSearchResul}
              />
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setFilterResul(filterResul === "Todos" ? "Imagem" : "Todos")}
              >
                <Text style={styles.filterText}>
                  {filterResul === "Todos" ? "Filtrar" : filterResul}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("NovoEve", { tipo: "Resultado" })}
            >
              <Icon name="plus" size={18} color="#fff" />
              <Text style={styles.addButtonText}>Adicionar novo</Text>
            </TouchableOpacity>

            {examesFiltradosResul.map((exame) => (
              <TouchableOpacity
                key={exame.id}
                style={[styles.card, { backgroundColor: getCardColor(exame.categoria) }]}
                onPress={() => openModal(exame)}
              >
                <Icon name="file-text" size={22} color="#fff" style={styles.cardIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{exame.nome}</Text>
                  <Text style={styles.cardDate}>{exame.data}</Text>
                </View>
                <Icon name="chevron-right" size={22} color="#6b7280" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>


      <Modal transparent visible={!!selectedItem} animationType="none">
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Exame</Text>
              <TouchableOpacity onPress={closeModal}>
                <Icon name="x" size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{selectedItem?.status}</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: "#fca5a5" }]}>
                <Text style={styles.tagText}>{selectedItem?.nome}</Text>
              </View>
            </View>
          <Text style={styles.modalTitle}>
            {selectedItem?.categoria === "resultado" ? "Resultado" : "Exame"}
          </Text>

          </View>
        </Animated.View>
      </Modal>


      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Principal")}>
          <Icon name="home" size={25} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Exames")}>
          <Icon name="file-text" size={25} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Cuidados")}>
          <Icon name="heart" size={25} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("ChatBot")}>
          <Icon name="user" size={25} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: "#EDEDED",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerText: { fontSize: 20, fontWeight: "700", color: "#120D37" },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, marginTop: height * 0.045 },
  headerBottom: { flexDirection: "row", justifyContent: "center", gap: 12, paddingBottom: 8, marginTop: 16 },
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
  tabButton: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20 },
  tabButtonActive: { backgroundColor: "#fbcfe8" },
  tabText: { fontSize: 14, color: "#6b7280" },
  tabTextActive: { color: "#ec4899", fontWeight: "600" },
  content: { flex: 1, padding: 16 },
  searchContainer: { flexDirection: "row", marginBottom: 12, gap: 8 },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  filterButton: { backgroundColor: "#ec4899", paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  filterText: { color: "#fff", fontWeight: "600" },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ec4899",
    padding: 14,
    borderRadius: 50,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
  },
  addButtonText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e3a8a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cardIcon: { marginRight: 12 },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  cardDate: { color: "#e5e7eb", fontSize: 13 },
  pendingCard: { padding: 16, alignItems: "center" },
  bigScheduleButton: {
    backgroundColor: "#ec4899",
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
    maxWidth: width * 0.6,
    width: "100%",
    elevation: 3,
  },
  bigScheduleText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  fab: {
    position: "absolute",
    bottom: height * 0.12,
    right: width * 0.06,
    backgroundColor: "#ec4899",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "85%",
    elevation: 5,
  },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  tagRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  tag: { backgroundColor: "#fde68a", paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },
  tagText: { fontSize: 12, fontWeight: "600", color: "#374151" },
  modalText: { fontSize: 14, color: "#374151", marginTop: 8 },
  navbar: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingVertical: 12, backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 5, borderRadius: 20, marginHorizontal: 50, bottom: 40 },
  navItem: { alignItems: "center" },
});
