import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Modal, 
  Dimensions, 
  Animated, 
  Easing,
  ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getEvents } from "../principal/EventStore"; 

const { width, height } = Dimensions.get("window");

export default function Exames() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("exames");
  
  // Estados de dados
  const [listaCompleta, setListaCompleta] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados de busca/filtro
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [searchResul, setSearchResul] = useState("");
  const [filterResul, setFilterResul] = useState("Todos");
  
  // Modal e Animação
  const [selectedItem, setSelectedItem] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  // ==========================================================
  // CARREGAMENTO DOS DADOS (Igual à tela Principal)
  // ==========================================================
  const carregarDados = async () => {
    setLoading(true);
    try {
      const eventos = await getEvents(); // Busca do EventStore
      setListaCompleta(eventos);
    } catch (error) {
      console.error("Erro ao carregar exames:", error);
    } finally {
      setLoading(false);
    }
  };

  // Usa useFocusEffect para recarregar sempre que entrar na tela
  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  // ==========================================================
  // FILTRAGEM (Separando Exames e Resultados)
  // ==========================================================
  
  // 1. Filtra apenas os EXAMES da lista completa
  const listaExames = listaCompleta.filter(item => item.tipo === "Exame");

  const examesFiltrados = listaExames.filter(
    (item) =>
      ((item.titulo || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.data || "").includes(search)) &&
      (filter === "Todos" || filter === "Imagem") // Lógica simplificada
  );

  // 2. Filtra apenas os RESULTADOS da lista completa
  const listaResultados = listaCompleta.filter(item => item.tipo === "Resultado");

  const resultadosFiltrados = listaResultados.filter(
    (item) =>
      ((item.titulo || "").toLowerCase().includes(searchResul.toLowerCase()) ||
        (item.data || "").includes(searchResul)) &&
      (filterResul === "Todos" || filterResul === "Imagem")
  );

  // ==========================================================
  // FUNÇÕES VISUAIS
  // ==========================================================
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

  const getCardColor = (tipo) => {
    if (tipo === "Exame") return "#f472b6";
    if (tipo === "Resultado") return "#60a5fa";
    return "#3b82f6";
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

      <View style={styles.contentContainer}>
        {loading ? (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <ActivityIndicator size="large" color="#ec4899" />
            </View>
        ) : (
            <ScrollView style={styles.content}>
                
                {/* === ABA EXAMES === */}
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
                        onPress={() => navigation.navigate("Exame")}
                    >
                        <Icon name="plus" size={18} color="#fff" />
                        <Text style={styles.addButtonText}>Adicionar novo</Text>
                    </TouchableOpacity>

                    {examesFiltrados.length === 0 ? (
                        <Text style={styles.emptyText}>Nenhum exame agendado.</Text>
                    ) : (
                        examesFiltrados.map((item) => (
                        <TouchableOpacity
                            key={item.id || Math.random().toString()} // Fallback para ID
                            style={[styles.card, { backgroundColor: getCardColor(item.tipo) }]}
                            onPress={() => openModal(item)}
                        >
                            <Icon name="file-text" size={22} color="#fff" style={styles.cardIcon} />
                            <View style={{ flex: 1 }}>
                                {/* Exibindo TITULO corretamente */}
                                <Text style={styles.cardTitle}>{item.titulo}</Text>
                                <Text style={styles.cardDate}>{item.data} {item.hora ? `- ${item.hora}` : ""}</Text>
                            </View>
                            <Icon name="chevron-right" size={22} color="#fff" />
                        </TouchableOpacity>
                        ))
                    )}
                </View>
                )}

                {/* === ABA RESULTADOS === */}
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
                        onPress={() => navigation.navigate("Resultado")}
                    >
                        <Icon name="plus" size={18} color="#fff" />
                        <Text style={styles.addButtonText}>Adicionar novo</Text>
                    </TouchableOpacity>

                    {resultadosFiltrados.length === 0 ? (
                        <Text style={styles.emptyText}>Nenhum resultado disponível.</Text>
                    ) : (
                        resultadosFiltrados.map((item) => (
                        <TouchableOpacity
                            key={item.id || Math.random().toString()}
                            style={[styles.card, { backgroundColor: getCardColor(item.tipo) }]}
                            onPress={() => openModal(item)}
                        >
                            <Icon name="check-circle" size={22} color="#fff" style={styles.cardIcon} />
                            <View style={{ flex: 1 }}>
                                {/* Exibindo TITULO corretamente */}
                                <Text style={styles.cardTitle}>{item.titulo}</Text>
                                <Text style={styles.cardDate}>{item.data} {item.hora ? `- ${item.hora}` : ""}</Text>
                            </View>
                            <Icon name="chevron-right" size={22} color="#fff" />
                        </TouchableOpacity>
                        ))
                    )}
                </View>
                )}
            </ScrollView>
        )}
      </View>


      {/* ================= MODAL DE DETALHES ================= */}
      <Modal transparent visible={!!selectedItem} animationType="none" onRequestClose={closeModal}>
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes</Text>
              <TouchableOpacity onPress={closeModal}>
                <Icon name="x" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.tagRow}>
              {selectedItem?.tipo && (
                 <View style={[styles.tag, { backgroundColor: getCardColor(selectedItem.tipo) }]}>
                   <Text style={[styles.tagText, {color:'#fff'}]}>{selectedItem.tipo}</Text>
                 </View>
              )}
            </View>

            {/* Conteúdo do Modal lendo os campos corretos */}
            <Text style={styles.labelModal}>O que é:</Text>
            <Text style={styles.textModalBig}>{selectedItem?.titulo}</Text>

            <View style={styles.divider} />

            <Text style={styles.labelModal}>Quando:</Text>
            <Text style={styles.textModal}>{selectedItem?.data} às {selectedItem?.hora}</Text>

            <Text style={styles.labelModal}>Onde:</Text>
            <Text style={styles.textModal}>{selectedItem?.local || "Local não informado"}</Text>

            {selectedItem?.obs ? (
              <>
                <Text style={styles.labelModal}>Observações:</Text>
                <Text style={styles.textModal}>{selectedItem.obs}</Text>
              </>
            ) : null}

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
    borderBottomWidth:1, 
    borderColor:'#f0f0f0'
  },
  headerContent: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerText: { fontSize: 20, fontWeight: "700", color: "#120D37" },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EDEDED",
    justifyContent: "center",
    alignItems: "center",
  },
  headerBottom: { flexDirection: "row", justifyContent: "center", gap: 12, marginTop: 16 },
  tabButton: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, backgroundColor:'#f3f4f6' },
  tabButtonActive: { backgroundColor: "#fbcfe8" },
  tabText: { fontSize: 14, color: "#6b7280", fontWeight:'500' },
  tabTextActive: { color: "#ec4899", fontWeight: "700" },
  
  contentContainer: { flex: 1 },
  content: { padding: 16 },
  
  searchContainer: { flexDirection: "row", marginBottom: 15, gap: 8 },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    color:'#333'
  },
  filterButton: { backgroundColor: "#ec4899", paddingHorizontal: 16, justifyContent:'center', borderRadius: 12 },
  filterText: { color: "#fff", fontWeight: "600" },
  
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ec4899",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#ec4899",
    shadowOpacity:0.3,
    shadowRadius:5
  },
  addButtonText: { color: "#fff", fontWeight: "700", marginLeft: 8, fontSize:16 },
  
  emptyText: { textAlign: 'center', color: '#9ca3af', marginTop: 20, fontSize: 14 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset:{width:0, height:2}
  },
  cardIcon: { marginRight: 15 },
  cardTitle: { color: "#fff", fontSize: 17, fontWeight: "700", marginBottom:4 },
  cardDate: { color: "rgba(255,255,255,0.9)", fontSize: 13 },
  
  // MODAL
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    width: "85%",
    elevation: 10,
  },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  modalTitle: { fontSize: 20, fontWeight: "800", color:'#111827' },
  
  tagRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  tag: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
  tagText: { fontSize: 12, fontWeight: "700" },
  
  labelModal: { fontSize:13, color:'#9ca3af', fontWeight:'600', marginTop:10 },
  textModalBig: { fontSize:18, color:'#374151', fontWeight:'700' },
  textModal: { fontSize:16, color:'#374151', fontWeight:'500' },
  divider: { height:1, backgroundColor:'#f3f4f6', marginVertical:10 },

  navbar: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingVertical: 12, backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 5, borderRadius: 20, marginHorizontal: 50, bottom: 40 },
  navItem: { alignItems: "center" },
});