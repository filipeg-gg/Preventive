import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getCurrentUser } from "../../../../UserStore";

export default function EditP({ navigation }) {
  const [usuario, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [sexo, setSexo] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  useEffect(() => {
    const carregarDados = async () => {
      const user = await getCurrentUser();
      if (user) {
        setNome(user.usuario || "");
        setSobrenome(user.sobrenome || "");
        setSexo(user.sexo || "");
        setNascimento(user.dataNascimento || "");
        setEmail(user.email || "");
        setSenha(user.password ? "********" : "");
      }
    };
    carregarDados();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Perfil")} style={styles.backBtn}>
           <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Perfil</Text>
        <View style={{width: 24}} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome</Text>
          <TextInput style={styles.input} value={usuario} onChangeText={setNome} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sobrenome</Text>
          <TextInput style={styles.input} value={sobrenome} onChangeText={setSobrenome} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sexo</Text>
          <View style={styles.radioRow}>
            <TouchableOpacity style={styles.radioOption} onPress={() => setSexo("Masculino")}>
              <View style={[styles.radioCircle, sexo === "Masculino" && styles.radioSelected]} />
              <Text style={styles.radioText}>Masculino</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.radioOption} onPress={() => setSexo("Feminino")}>
              <View style={[styles.radioCircle, sexo === "Feminino" && styles.radioSelected]} />
              <Text style={styles.radioText}>Feminino</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Data de nascimento</Text>
          <TextInput style={styles.input} value={nascimento} onChangeText={setNascimento} keyboardType="numeric" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha</Text>
          <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry />
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Perfil")}>
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15, backgroundColor: "#fff", elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 3 },
  backBtn: { padding: 5 },
  title: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  scroll: { padding: 20, paddingBottom: 40 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 14, fontSize: 15, color: "#111827" },
  radioRow: { flexDirection: "row", gap: 20, marginTop: 5 },
  radioOption: { flexDirection: "row", alignItems: "center" },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#D1D5DB", marginRight: 8 },
  radioSelected: { borderColor: "#3B82F6", backgroundColor: "#3B82F6" },
  radioText: { fontSize: 15, color: "#374151" },
  button: { backgroundColor: "#3B82F6", paddingVertical: 16, borderRadius: 12, alignItems: "center", marginTop: 10, shadowColor: "#3B82F6", shadowOpacity: 0.3, shadowRadius: 5, elevation: 4 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});