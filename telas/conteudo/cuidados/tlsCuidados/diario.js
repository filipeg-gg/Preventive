import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

export default function Diario() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("diario");

  // Controle do modal e notas
  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [humor, setHumor] = useState("");
  const [sintomas, setSintomas] = useState("");
  const [tratamento, setTratamento] = useState("");
  const [outro, setOutro] = useState("");
  const [notas, setNotas] = useState([]);

  const [humorModal, setHumorModal] = useState(false);
  const [humorSelecionado, setHumorSelecionado] = useState(null);
  const [humorHistorico, setHumorHistorico] = useState([]);

  const salvarNota = () => {
    if (!titulo.trim()) return; // título obrigatório
    const novaNota = { titulo, humor, sintomas, tratamento, outro };
    setNotas([...notas, novaNota]);
    setTitulo("");
    setHumor("");
    setSintomas("");
    setTratamento("");
    setOutro("");
    setModalVisible(false);
  };

  const salvarHumor = () => {
    if (!humorSelecionado) return;
    const data = new Date().toLocaleDateString("pt-BR");
    setHumorHistorico([...humorHistorico, { tipo: humorSelecionado, data }]);
    setHumorSelecionado(null);
    setHumorModal(false);
  };

  return (
    <View style={styles.container}>
      {/* Header igual ao Relatórios */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
        <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.navigate("Cuidados")}>
          <Icon name="arrow-left" size={22} color="#2D1E72" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Diário</Text>

        <TouchableOpacity style={styles.headerRight}>
          <Icon name="more-vertical" size={22} color="#6b7280" />
        </TouchableOpacity>
        </View>

        {/* Box das tabs logo abaixo do header (mantendo o visual anterior) */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "diario" && styles.tabButtonActive]}
            onPress={() => setActiveTab("diario")}
          >
            <Text style={[styles.tabText, activeTab === "diario" && styles.tabTextActive]}>
              Notas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "humor" && styles.tabButtonActive]}
            onPress={() => setActiveTab("humor")}
          >
            <Text style={[styles.tabText, activeTab === "humor" && styles.tabTextActive]}>
              Humor
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Conteúdo */}
      <ScrollView style={styles.content}>
        {activeTab === "diario" && (
          <View>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <Icon name="plus" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Criar Nota</Text>
            </TouchableOpacity>

            {notas.map((nota, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{nota.titulo}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      const novasNotas = notas.filter((_, i) => i !== index);
                      setNotas(novasNotas);
                    }}
                  >
                    <Icon name="trash-2" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.cardText}>Humor: {nota.humor}</Text>
                <Text style={styles.cardText}>Sintomas: {nota.sintomas}</Text>
                <Text style={styles.cardText}>Tratamento: {nota.tratamento}</Text>
                <Text style={styles.cardText}>Outro: {nota.outro}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === "humor" && (
          <View style={styles.humorContainer}>
            <View style={styles.humorCard}>
              <Icon name="smile" size={36} color="#f59e0b" style={{ marginBottom: 8 }} />
              <Text style={styles.humorTitle}>Acompanhe seu humor</Text>
              <Text style={styles.humorDesc}>
                Registre diariamente como você está se sentindo e acompanhe seu bem-estar ao longo do tempo.
              </Text>

              <TouchableOpacity
                style={styles.humorButton}
                onPress={() => setHumorModal(true)}
              >
                <Icon name="plus-circle" size={20} color="#fff" />
                <Text style={styles.humorButtonText}>Novo Humor</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.historicoTitle}>Histórico</Text>
            {humorHistorico.length === 0 ? (
              <Text style={styles.historicoVazio}>Nenhum humor registrado ainda.</Text>
            ) : (
              humorHistorico.map((h, i) => (
                <View key={i} style={styles.humorItem}>
                  <View style={styles.humorItemLeft}>
                    <Icon
                      name={
                        h.tipo === "Feliz"
                          ? "smile"
                          : h.tipo === "Triste"
                          ? "frown"
                          : h.tipo === "Normal"
                          ? "meh"
                          : h.tipo === "Ansioso"
                          ? "alert-circle"
                          : "x-circle"
                      }
                      size={22}
                      color="#ec4899"
                    />
                    <Text style={styles.humorText}>{h.tipo}</Text>
                  </View>
                  <Text style={styles.humorData}>{h.data}</Text>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Modal Criar Nota */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <Text style={styles.dateText}>{new Date().toLocaleDateString("pt-BR")}</Text>

            <TextInput
              style={styles.titleInput}
              placeholder="Adicione um título"
              value={titulo}
              onChangeText={setTitulo}
            />

            <Text style={styles.label}>Como você está se sentindo hoje?</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Escreva aqui..."
              value={humor}
              onChangeText={setHumor}
              multiline
            />

            <Text style={styles.label}>Você notou algum sintoma?</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Escreva aqui..."
              value={sintomas}
              onChangeText={setSintomas}
              multiline
            />

            <Text style={styles.label}>Como está o tratamento?</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Escreva aqui..."
              value={tratamento}
              onChangeText={setTratamento}
              multiline
            />

            <Text style={styles.label}>Você tem dúvidas sobre a doença?</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Escreva aqui..."
              value={outro}
              onChangeText={setOutro}
              multiline
            />

            <TouchableOpacity style={styles.saveButton} onPress={salvarNota}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Humor */}
      <Modal visible={humorModal} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Como você está se sentindo?</Text>

            <View style={styles.humorOptions}>
              {[
                { tipo: "Feliz", icon: "smile" },
                { tipo: "Triste", icon: "frown" },
                { tipo: "Normal", icon: "meh" },
                { tipo: "Ansioso", icon: "alert-circle" },
                { tipo: "Raiva", icon: "x-circle" },
                { tipo: "Cansado", icon: "heart" },
              ].map((h) => (
                <TouchableOpacity
                  key={h.tipo}
                  style={[
                    styles.humorOption,
                    humorSelecionado === h.tipo && styles.humorOptionActive,
                  ]}
                  onPress={() => setHumorSelecionado(h.tipo)}
                >
                  <Icon
                    name={h.icon}
                    size={32}
                    color={humorSelecionado === h.tipo ? "#fff" : "#374151"}
                  />
                  <Text
                    style={[
                      styles.humorLabel,
                      humorSelecionado === h.tipo && { color: "#fff" },
                    ]}
                  >
                    {h.tipo}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButtonModal]}
                onPress={() => setHumorModal(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={salvarHumor}
              >
                <Text style={styles.confirmText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Navbar (mantive a sua) */}
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
  container: { flex: 1, backgroundColor: "#F4F3FA" },

  /* Header - igual ao Relatórios */
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 18,
    backgroundColor: "#fff",
    top: 20,
  },
  headerLeft: { width: 36, alignItems: "flex-start" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#2D1E72",
  },
  headerRight: { width: 36, alignItems: "flex-end" },

  /* Tabs abaixo do header (visual separado) */
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 18,
    marginTop: 25,
    paddingBottom: 8,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  tabButtonActive: { backgroundColor: "#fbcfe8" },
  tabText: { fontSize: 14, color: "#6b7280" },
  tabTextActive: { color: "#ec4899", fontWeight: "600" },

  content: { flex: 1, padding: 16, marginTop: 6 },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ec4899",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    top: 10,
  },
  addButtonText: { color: "#fff", fontWeight: "600", marginLeft: 6 },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardText: { fontSize: 14, color: "#374151", marginBottom: 2 },

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
    width: "90%",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  dateText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 10,
  },
  titleInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 20,
    paddingVertical: 4,
  },
  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
    marginTop: 10,
  },
  textArea: {
    fontSize: 14,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 6,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#4f46e5",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: { color: "#fff", fontWeight: "600" },
  cancelButtonText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 12,
  },

  humorContainer: { marginTop: 20 },
  humorCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
  },
  humorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 6,
  },
  humorDesc: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 14,
  },
  humorButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ec4899",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  humorButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },

  historicoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#374151",
  },
  historicoVazio: {
    fontSize: 14,
    color: "#9ca3af",
    fontStyle: "italic",
    textAlign: "center",
  },

  humorItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  humorItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  humorText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
  },
  humorData: {
    fontSize: 13,
    color: "#6b7280",
  },

  humorOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  humorOption: {
    width: "30%",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  humorOptionActive: {
    backgroundColor: "#ec4899",
    borderColor: "#ec4899",
  },
  humorLabel: {
    marginTop: 6,
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 6,
  },
  cancelButtonModal: {
    backgroundColor: "#f3f4f6",
  },
  confirmButton: {
    backgroundColor: "#4f46e5",
  },
  cancelText: {
    fontSize: 15,
    color: "#374151",
  },
  confirmText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "600",
  },

  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingBottom: 10,
  },
  navItem: { alignItems: "center" },
});
