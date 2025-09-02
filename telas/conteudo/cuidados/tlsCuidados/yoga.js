import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

export default function Yoga() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [praticaSelecionada, setPraticaSelecionada] = useState(null);

  const praticas = [
    { id: 1, titulo: "Sessão rápida", tempo: "5 minutos", grupo: "Iniciantes" },
    { id: 2, titulo: "Sessão simples", tempo: "10 minutos", grupo: "Outros" },
    { id: 3, titulo: "Sessão leve", tempo: "15 minutos", grupo: "Outros" },
    { id: 4, titulo: "Sessão moderada", tempo: "20 minutos", grupo: "Outros" },
    { id: 5, titulo: "Sessão intensa", tempo: "30 minutos", grupo: "Outros" },
  ];

  const abrirModal = (pratica) => {
    setPraticaSelecionada(pratica);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.cab}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.navigate("Cuidados")}>
            <Icon name="arrow-left" size={24} color="#2D0036" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Yoga</Text>
          <TouchableOpacity>
            <Icon name="more-vertical" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Iniciantes */}
        <Text style={styles.section}>Iniciantes</Text>
        {praticas
          .filter((p) => p.grupo === "Iniciantes")
          .map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.card, styles.cardDestaque]}
              onPress={() => abrirModal(p)}
            >
              <View>
                <Text style={styles.cardTitulo}>{p.titulo}</Text>
                <Text style={styles.cardTempo}>{p.tempo}</Text>
              </View>
              <Text style={styles.seta}>{">"}</Text>
            </TouchableOpacity>
          ))}

        {/* Outros */}
        <Text style={styles.section}>Outros</Text>
        {praticas
          .filter((p) => p.grupo === "Outros")
          .map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.card}
              onPress={() => abrirModal(p)}
            >
              <View>
                <Text style={styles.cardTitulo}>{p.titulo}</Text>
                <Text style={styles.cardTempo}>{p.tempo}</Text>
              </View>
              <Text style={styles.seta}>{">"}</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>{praticaSelecionada?.titulo}</Text>
            <Text style={styles.modalTexto}>{praticaSelecionada?.tempo}</Text>
            <TouchableOpacity
              style={styles.modalBotao}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalBotaoTexto}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

            <View style={styles.navbar}>
              <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Principal")}>
                <Icon name="home" size={25} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Exames")}>
                <Icon name="file-text" size={25} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Cuidados")}>
                <Icon name="heart" size={25} color="#3b82f6" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Perfil")}>
                <Icon name="user" size={25} color="#6b7280" />
              </TouchableOpacity>
            </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
cab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 10,
    height: 130,
    top: 25,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerBottom: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    paddingBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: { fontSize: 18, fontWeight: "600" },

  scroll: { padding: 20, top: 10 },
  section: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 10,
    marginTop: 15,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#C4B5FD",
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
  },
  cardDestaque: {
    backgroundColor: "#7C3AED",
  },
  cardTitulo: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  cardTempo: { fontSize: 13, color: "#EDE9FE", marginTop: 5 },
  seta: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  modalTitulo: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalTexto: { fontSize: 16, color: "#444", marginBottom: 20 },
  modalBotao: {
    backgroundColor: "#7C3AED",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalBotaoTexto: { color: "#fff", fontSize: 16, fontWeight: "bold" },

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
    bottom: 50,
  },
  navItem: { alignItems: "center" },
});
