import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
} from "react-native";
import { registerUser } from "../../../UserStore";  

const { width, height } = Dimensions.get("window");

export default function Cadastro({ navigation }) {
  const [sexo, setSexo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const handleCadastro = () => {
    if (senha !== confirmarSenha) {
      Alert.alert("Atenção", "As senhas não coincidem.");
      return;
    }
    if (!usuario || !email || !dataNascimento || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    const sucesso = registerUser({
      usuario,
      sobrenome,
      sexo,
      dataNascimento,
      email,
      password: senha, // cuidado aqui: no UserStore você usa "password" e não "senha"
    });

    if (!sucesso) {
      Alert.alert("Erro", "E-mail já cadastrado.");
      return;
    }

    Alert.alert("Sucesso!", "Conta criada com sucesso!");
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.formu}>
        <Text style={styles.titulo}>Novo(a) por aqui?</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome*"
          placeholderTextColor="#B0B0B0"
          value={usuario}
          onChangeText={setUsuario}
        />
        <TextInput
          style={styles.input}
          placeholder="Sobrenome"
          placeholderTextColor="#B0B0B0"
          value={sobrenome}
          onChangeText={setSobrenome}
        />

        <View style={styles.sexoContainer}>
          <Text style={styles.sexoLabel}>Sexo</Text>
          <View style={styles.radioRow}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setSexo("Masculino")}
            >
              <View
                style={[
                  styles.radioCircle,
                  sexo === "Masculino" && styles.radioSelecionado,
                ]}
              />
              <Text style={styles.radioText}>Masculino</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setSexo("Feminino")}
            >
              <View
                style={[
                  styles.radioCircle,
                  sexo === "Feminino" && styles.radioSelecionado,
                ]}
              />
              <Text style={styles.radioText}>Feminino</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Data de nascimento (DD/MM/AAAA)*"
          placeholderTextColor="#B0B0B0"
          value={dataNascimento}
          onChangeText={setDataNascimento}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail*"
          placeholderTextColor="#B0B0B0"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha*"
          placeholderTextColor="#B0B0B0"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar senha*"
          placeholderTextColor="#B0B0B0"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        <TouchableOpacity style={styles.botao} onPress={handleCadastro}>
          <Text style={styles.botaoTexto}>Cadastrar</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.textRow}>
          <Text style={styles.normalText}>Já possui uma conta? </Text>
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate("Login")}
          >
            Entrar
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  formu: { backgroundColor: "#F9FAFB", alignItems: "center", paddingTop: 40, marginTop: height * 0.12 },
  titulo: { fontSize: 20, fontWeight: "bold", color: "#77a5ff", marginBottom: 15 },
  input: { width: "85%", height: 45, backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 12, marginVertical: 6, borderColor: "#E5E7EB", borderWidth: 1, fontSize: 14, color: "#333" },
  sexoContainer: { width: "85%", marginVertical: 6 },
  sexoLabel: { fontSize: 14, fontWeight: "500", marginBottom: 5, color: "#333" },
  radioRow: { flexDirection: "row", alignItems: "center" },
  radioOption: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  radioCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: "#77a5ff", marginRight: 6 },
  radioSelecionado: { backgroundColor: "#77a5ff" },
  radioText: { fontSize: 14, color: "#333" },
  botao: { width: "85%", paddingVertical: 12, borderRadius: 20, backgroundColor: "#77a5ff", alignItems: "center", marginTop: 20 },
  botaoTexto: { fontSize: 16, color: "#fff", fontWeight: "600" },
  divider: { flexDirection: "row", alignItems: "center", width: "85%", marginTop: height * 0.03 },
  line: { flex: 1, height: 1, backgroundColor: "#d3d3d3" },
  dividerText: { marginHorizontal: 10, color: "#a9a9a9", fontSize: width * 0.035, fontWeight: "500" },
  textRow: { flexDirection: "row", marginTop: height * 0.02 },
  normalText: { fontSize: width * 0.035, color: "#a9a9a9", fontWeight: "bold" },
  linkText: { fontSize: width * 0.035, color: "#77a5ff", fontWeight: "bold", textDecorationLine: "underline" },
});
