import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, SafeAreaView, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from '@react-navigation/native';

export default function Privacidade({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  const sairConta = () => {
    Alert.alert("Confirmação", "Certeza que quer sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Sim", 
        onPress: () => {
          // Reseta o histórico para impedir voltar ao perfil
          navigation.dispatch(
            CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] })
          );
        }
      },
    ]);
  };

  const excluirConta = () => {
    Alert.alert("Confirmação", "Certeza que quer excluir a sua conta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sim", onPress: () => navigation.navigate("Inicial") },
    ]);
  };

  const renderCard = (text, onPress, isDestructive = false) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={[styles.label, isDestructive && {color: '#EF4444'}]}>{text}</Text>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Perfil")} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Privacidade</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {renderCard("Trocar a senha", () => setModalVisible(true))}
        {renderCard("Sair da conta", sairConta)}
        {renderCard("Excluir conta", excluirConta, true)}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Trocar senha</Text>

            <Text style={styles.inputLabel}>Senha atual</Text>
            <TextInput style={styles.input} value={senhaAtual} secureTextEntry onChangeText={setSenhaAtual} />

            <Text style={styles.inputLabel}>Nova senha</Text>
            <TextInput style={styles.input} value={novaSenha} secureTextEntry onChangeText={setNovaSenha} />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={() => { setModalVisible(false); }}>
                <Text style={styles.saveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15, backgroundColor: "#fff", elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 3 },
  backBtn: { padding: 5 },
  title: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  scroll: { padding: 20 },
  card: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#E5E7EB" },
  label: { fontSize: 15, color: "#374151", fontWeight: "500" },
  
  // Modal
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 24, borderRadius: 16, width: "85%", elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#111827" },
  inputLabel: { fontSize: 14, marginBottom: 6, color: "#4B5563", fontWeight: "600" },
  input: { backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 8, padding: 12, fontSize: 14, marginBottom: 16 },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 10 },
  button: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  cancelButton: { backgroundColor: "#F3F4F6" },
  saveButton: { backgroundColor: "#3B82F6" },
  cancelText: { color: "#374151", fontWeight: "600" },
  saveText: { color: "#fff", fontWeight: "600" },
});