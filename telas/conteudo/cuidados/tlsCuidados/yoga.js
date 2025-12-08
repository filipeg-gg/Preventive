import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function Yoga() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [praticaSelecionada, setPraticaSelecionada] = useState(null);

  const praticas = [
    { id: 1, titulo: "Sessão Rápida", tempo: "5 min", grupo: "Iniciantes", icon: "sun" },
    { id: 2, titulo: "Alongamento Simples", tempo: "10 min", grupo: "Outros", icon: "activity" },
    { id: 3, titulo: "Relaxamento Leve", tempo: "15 min", grupo: "Outros", icon: "wind" },
    { id: 4, titulo: "Fluxo Moderado", tempo: "20 min", grupo: "Outros", icon: "layers" },
    { id: 5, titulo: "Yoga Intensa", tempo: "30 min", grupo: "Outros", icon: "zap" },
  ];

  const abrirModal = (pratica) => {
    setPraticaSelecionada(pratica);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate("Cuidados")}
          >
            <Icon name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Yoga & Meditação</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="more-vertical" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Encontre seu equilíbrio hoje.</Text>
      </View>

      {/* Lista Principal */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção Destaque (Iniciantes) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Para Começar</Text>
          <Icon name="star" size={16} color="#F59E0B" />
        </View>

        {praticas
          .filter((p) => p.grupo === "Iniciantes")
          .map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.card, styles.cardDestaque]}
              activeOpacity={0.9}
              onPress={() => abrirModal(p)}
            >
              <View style={styles.cardIconContainerDestaque}>
                 <Icon name={p.icon} size={24} color="#FFF" />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.cardTituloDestaque}>{p.titulo}</Text>
                <View style={styles.tagContainerDestaque}>
                   <Icon name="clock" size={12} color="#E0C2FF" style={{marginRight: 4}}/>
                   <Text style={styles.cardTempoDestaque}>{p.tempo}</Text>
                </View>
              </View>
              <View style={styles.playButtonDestaque}>
                <Icon name="play" size={20} color="#7C3AED" />
              </View>
            </TouchableOpacity>
          ))}

        {/* Seção Outros */}
        <Text style={styles.sectionTitle}>Sessões Disponíveis</Text>
        {praticas
          .filter((p) => p.grupo === "Outros")
          .map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => abrirModal(p)}
            >
              <View style={styles.cardIconContainer}>
                 <Icon name={p.icon} size={22} color="#7C3AED" />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.cardTitulo}>{p.titulo}</Text>
                <View style={styles.tagContainer}>
                   <Icon name="clock" size={12} color="#9CA3AF" style={{marginRight: 4}}/>
                   <Text style={styles.cardTempo}>{p.tempo}</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={20} color="#CBD5E1" />
            </TouchableOpacity>
          ))}
      </ScrollView>

      {/* Navbar Flutuante */}
      <View style={styles.navbarContainer}>
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Principal")}>
            <Icon name="home" size={24} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Exames")}>
            <Icon name="file-text" size={24} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItemActive} onPress={() => navigation.navigate("Cuidados")}>
            <Icon name="heart" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Perfil")}>
            <Icon name="user" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal Bottom Sheet */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalDragIndicator} />
            
            <View style={styles.modalHeader}>
                <View style={[styles.cardIconContainer, {backgroundColor: '#F3E8FF'}]}>
                    <Icon name={praticaSelecionada?.icon || 'activity'} size={28} color="#7C3AED" />
                </View>
                <View style={{marginLeft: 15}}>
                    <Text style={styles.modalTitulo}>{praticaSelecionada?.titulo}</Text>
                    <Text style={styles.modalSubtitulo}>Yoga • {praticaSelecionada?.grupo}</Text>
                </View>
            </View>

            <View style={styles.modalInfoBox}>
                <Icon name="clock" size={18} color="#7C3AED" />
                <Text style={styles.modalInfoText}>Duração estimada: {praticaSelecionada?.tempo}</Text>
            </View>

            <Text style={styles.modalDescricao}>
                Esta sessão foi desenhada para ajudar você a encontrar equilíbrio e foco.
                Prepare seu tapete e respire fundo.
            </Text>

            <TouchableOpacity
              style={styles.modalBotao}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalBotaoTexto}>Iniciar Sessão</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F9FAFB" 
  },
  
  // Header Styles
  header: {
    paddingTop: StatusBar.currentHeight + 10 || 40,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: "700", 
    color: "#1F2937" 
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  
  // Scroll & Sections
  scrollContent: { 
    paddingHorizontal: 24, 
    paddingTop: 24,
    paddingBottom: 120, // Espaço extra para a navbar não cobrir
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 12,
    marginRight: 8,
    marginTop: 10,
  },

  // Cards (Geral)
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6"
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F3E8FF", // Roxo bem clarinho
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTitulo: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#374151" 
  },
  tagContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
  },
  cardTempo: { 
    fontSize: 13, 
    color: "#6B7280",
    fontWeight: "500"
  },

  // Card Destaque (Estilo diferente)
  cardDestaque: {
    backgroundColor: "#7C3AED", // Roxo Vibrante
    borderColor: "#7C3AED",
    paddingVertical: 20,
    elevation: 8,
    shadowColor: "#7C3AED",
    shadowOpacity: 0.3,
  },
  cardIconContainerDestaque: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTituloDestaque: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#fff" 
  },
  tagContainerDestaque: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 6,
      backgroundColor: "rgba(255,255,255,0.15)",
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
  },
  cardTempoDestaque: { 
    fontSize: 13, 
    color: "#E9D5FF",
    fontWeight: "600"
  },
  playButtonDestaque: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
  },

  // Navbar
  navbarContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  navbar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    width: width * 0.85,
    height: 70,
    borderRadius: 35,
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
    // Shadow forte para destacar
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  navItem: {
    alignItems: "center",
    padding: 10,
  },
  navItemActive: {
      backgroundColor: '#3B82F6', // Azul ativo
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: "#3B82F6",
      shadowOpacity: 0.4,
      shadowRadius: 10,
      shadowOffset: {width: 0, height: 4},
      elevation: 5,
      marginTop: -20, // Efeito "saltando" para fora da barra
  },

  // Modal (Bottom Sheet Style)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
    elevation: 20,
  },
  modalDragIndicator: {
      width: 40,
      height: 5,
      backgroundColor: '#E5E7EB',
      borderRadius: 3,
      alignSelf: 'center',
      marginBottom: 20,
  },
  modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
  },
  modalTitulo: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#1F2937",
  },
  modalSubtitulo: {
      fontSize: 14,
      color: "#6B7280",
      marginTop: 2,
  },
  modalInfoBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F3E8FF',
      padding: 12,
      borderRadius: 12,
      marginBottom: 20,
  },
  modalInfoText: {
      marginLeft: 10,
      color: '#7C3AED',
      fontWeight: '600',
  },
  modalDescricao: { 
    fontSize: 16, 
    color: "#4B5563", 
    lineHeight: 24,
    marginBottom: 30 
  },
  modalBotao: {
    backgroundColor: "#7C3AED",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  modalBotaoTexto: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
});