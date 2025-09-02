import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Switch,
  Platform, 
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Medicamentos() {
  const navigation = useNavigation();

  // Estados
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);

  const [medicamentos, setMedicamentos] = useState([]);
  const [nome, setNome] = useState("");
  const [horario, setHorario] = useState(new Date());
  const [notificacao, setNotificacao] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Salvar novo medicamento
  const salvarMedicamento = () => {
    if (!nome || !horario) return;

    const novo = {
      id: Date.now(),
      nome,
      horario: horario.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      notificacao,
    };

    setMedicamentos([novo, ...medicamentos]);
    setNome("");
    setHorario(new Date());
    setNotificacao(false);
    setModalVisible(false);
  };

  // Deletar medicamento
  const deletarMedicamento = (id) => {
    setMedicamentos(medicamentos.filter((m) => m.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.headerLeft}
            onPress={() => navigation.navigate("Cuidados")}
          >
            <Icon name="arrow-left" size={22} color="#2D1E72" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Medicamentos</Text>

          <TouchableOpacity style={styles.headerRight}>
            <Icon name="more-vertical" size={22} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Conteúdo */}
      <ScrollView style={styles.content}>
        {/* Cards */}
        {medicamentos.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={styles.card}
            onPress={() => {
              setSelectedMed(m);
              setDetailModalVisible(true);
            }}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{m.nome}</Text>
              <TouchableOpacity onPress={() => deletarMedicamento(m.id)}>
                <Icon name="trash-2" size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
            <Text style={styles.cardText}>Horário: {m.horario}</Text>
            <Text style={styles.cardText}>
              Notificação: {m.notificacao ? "Sim" : "Não"}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Botão de adicionar */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="plus" size={28} color="#fff" />
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de adicionar */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Novo Medicamento</Text>

            <Text style={styles.label}>Nome do medicamento</Text>
            <TextInput
              style={styles.titleInput}
              value={nome}
              onChangeText={setNome}
              placeholder="Ex: Dipirona"
            />

            <Text style={styles.label}>Horário</Text>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timePickerText}>
                {horario.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={horario}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  setShowTimePicker(false);
                  if (selectedDate) setHorario(selectedDate);
                }}
              />
            )}

            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
              <Text style={styles.label}>Receber notificações</Text>
              <Switch value={notificacao} onValueChange={setNotificacao} />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButtonModal]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={salvarMedicamento}
              >
                <Text style={styles.confirmText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de detalhes */}
      <Modal transparent visible={detailModalVisible} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            {selectedMed && (
              <>
                <Text style={styles.modalTitle}>{selectedMed.nome}</Text>
                <Text style={styles.cardText}>Horário: {selectedMed.horario}</Text>
                <Text style={styles.cardText}>
                  Notificação: {selectedMed.notificacao ? "Sim" : "Não"}
                </Text>
              </>
            )}

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButtonModal, { marginTop: 20 }]}
              onPress={() => setDetailModalVisible(false)}
            >
              <Text style={styles.cancelText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F3FA" },

  /* Header */
  headerTop: { flexDirection: "row", justifyContent: "space-between" },
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

  content: { flex: 1, padding: 16, marginTop: 6 },

  /* Botão redondo */
  addButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ec4899",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 20,
    elevation: 5,
  },

  /* Cards */
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

  /* Modal */
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
  titleInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 20,
    paddingVertical: 4,
  },
  label: { fontSize: 14, color: "#374151", marginBottom: 4 },

  timePickerButton: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  timePickerText: { fontSize: 16, color: "#374151" },

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
  cancelButtonModal: { backgroundColor: "#f3f4f6" },
  confirmButton: { backgroundColor: "#4f46e5" },
  cancelText: { fontSize: 15, color: "#374151" },
  confirmText: { fontSize: 15, color: "#fff", fontWeight: "600" },
});
