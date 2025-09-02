import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";

export default function Privacidade({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("*********");
  const [novaSenha, setNovaSenha] = useState("");

  const sairConta = () => {
    Alert.alert(
      "Confirmação",
      "Certeza que quer sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim", onPress: () => navigation.navigate("Login") },
      ]
    );
  };

  const excluirConta = () => {
    Alert.alert(
      "Confirmação",
      "Certeza que quer excluir a sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim", onPress: () => navigation.navigate("Inicial") },
      ]
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
        <Text style={styles.title}>Privacidade</Text>
      </View>

      {/* Cards */}
      <TouchableOpacity style={styles.card} onPress={() => setModalVisible(true)}>
        <Text style={styles.label}>Trocar a senha</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={sairConta}>
        <Text style={styles.label}>Sair da conta</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={excluirConta}>
        <Text style={styles.label}>Excluir conta</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      {/* Modal Trocar Senha */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Trocar senha</Text>

            <Text style={styles.inputLabel}>Senha atual</Text>
            <TextInput
              style={styles.input}
              value={senhaAtual}
              secureTextEntry
              onChangeText={setSenhaAtual}
            />

            <Text style={styles.inputLabel}>Nova senha</Text>
            <TextInput
              style={styles.input}
              value={novaSenha}
              secureTextEntry
              onChangeText={setNovaSenha}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={() => {
                  console.log("Senha alterada para:", novaSenha);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.saveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    color: "#1B0D3F",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    flex: 1,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  label: {
    fontSize: 14,
    color: "#333",
  },

  // Modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "85%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
    color: "#555",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#E5E5E5",
  },
  saveButton: {
    backgroundColor: "#1B0D3F",
  },
  cancelText: {
    color: "#333",
    fontWeight: "600",
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
  },
});
