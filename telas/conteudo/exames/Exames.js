import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Modal, Dimensions, Animated, Easing} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

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

  const exames = [
    { id: 1, nome: "Mamografia", data: "07 de maio de 2025", tipo: "Imagem", status: "Em andamento" },
    { id: 2, nome: "Transvaginal", data: "18 de março de 2025", tipo: "Ultrassom", status: "Pendente" },
    { id: 3, nome: "Papanicolau", data: "03 de junho de 2023", tipo: "Preventivo", status: "Concluído" },
  ];

  const examesResul = [
    { id: 1, nome: "Resultado Mamografia", data: "24 de março de 2025", tipo: "Imagem", status: "Disponível" },
    { id: 2, nome: "Resultado Transvaginal", data: "30 de abril de 2024", tipo: "Ultrassom", status: "Disponível" },
    { id: 3, nome: "Resultado Papanicolau", data: "15 de junho de 2023", tipo: "Preventivo", status: "Disponível" },
  ];

  const examesFiltrados = exames.filter(
    (exame) =>
      (exame.nome.toLowerCase().includes(search.toLowerCase()) ||
        exame.data.includes(search)) &&
      (filter === "Todos" || exame.tipo === filter)
  );

  const examesFiltradosResul = examesResul.filter(
    (exame) =>
      (exame.nome.toLowerCase().includes(searchResul.toLowerCase()) ||
        exame.data.includes(searchResul)) &&
      (filterResul === "Todos" || exame.tipo === filterResul)
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.cab}>
        <View style={styles.headerTop}>
              <TouchableOpacity
                style={styles.avatar}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("Perfil")}
              >
                <Icon name="user" size={24} color="#6b7280" />
              </TouchableOpacity>
          <Text style={styles.headerText}>Exames</Text>
                    <TouchableOpacity style={styles.iconButton} activeOpacity={0.8} onPress={() => navigation.navigate("Perfil")}>
                      <Icon name="settings" size={24} color="#6b7280" />
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
                style={styles.card}
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

            <View style={styles.pendingCard}>
              <TouchableOpacity
                style={styles.bigScheduleButton}
                onPress={() =>
                  Alert.alert("Funcionalidade futura", "Em breve você poderá agendar exames por aqui!")
                }
              >
                <Text style={styles.bigScheduleText}>Agendar outro Exame</Text>
              </TouchableOpacity>
            </View>
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

            {examesFiltradosResul.map((exame) => (
              <TouchableOpacity
                key={exame.id}
                style={styles.card}
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

      {activeTab === "resultados" && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("NovoEve", { tipo: "resultado" })}
        >
          <Icon name="plus" size={28} color="#fff" />
        </TouchableOpacity>
      )}

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
            <Text style={styles.modalText}>
              Você agendou {selectedItem?.nome} para o dia {selectedItem?.data}.{"\n"}
              Tipo: {selectedItem?.tipo}.
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
  cab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: height * 0.015,
    height: height * 0.2,

  },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, marginTop: height * 0.035 },
  headerBottom: { flexDirection: "row", justifyContent: "center", gap: 12, paddingBottom: 8 },
  avatar: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: "#d1d5db",
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
  headerText: { fontSize: 18, fontWeight: "600" },
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
