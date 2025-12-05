import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import { registerUser } from "../../../UserStore";  
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function Cadastro({ navigation }) {
  const [sexo, setSexo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Novos estados para os Termos
  const [aceitoTermos, setAceitoTermos] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // --- FUNÇÃO DE MÁSCARA AUTOMÁTICA PARA DATA ---
  const handleDateChange = (text) => {
    // 1. Remove tudo que não é número
    let cleaned = text.replace(/\D/g, '');

    // 2. Limita a 8 números (ddmmaaaa)
    if (cleaned.length > 8) {
        cleaned = cleaned.substring(0, 8);
    }

    // 3. Aplica a formatação (Barras)
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    }
    if (cleaned.length > 4) {
      formatted = formatted.substring(0, 5) + '/' + cleaned.substring(4);
    }

    setDataNascimento(formatted);
  };
  // ------------------------------------

  const handleCadastro = async () => {
    if (!aceitoTermos) {
      Alert.alert("Atenção", "Você precisa aceitar os Termos de Uso para se cadastrar.");
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert("Atenção", "As senhas não coincidem.");
      return;
    }
    if (!usuario || !email || !dataNascimento || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }
    if (dataNascimento.length !== 10) {
        Alert.alert("Atenção", "Data inválida. Preencha completamente: DD/MM/AAAA");
        return;
    }

    setLoading(true);

    const resultado = await registerUser({
      usuario,
      sobrenome,
      sexo,
      dataNascimento,
      email,
      password: senha,
    });

    setLoading(false);

    if (resultado.success) {
      Alert.alert("Sucesso!", "Conta criada com sucesso!");
      navigation.navigate("Login");
    } else {
      Alert.alert("Erro", resultado.error);
    }
  };

  return (
      <View style={styles.container}>
        {/* Fundo (Azul + Onda) */}
        <View style={styles.waveContainer}>
          <Svg
            width={width}
            height={height * 0.4}
            viewBox="0 0 1440 320"
          >
            <Path
              fill="#F9FAFB"
              d="M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,197.3C672,181,768,107,864,96C960,85,1056,139,1152,165.3C1248,192,1344,192,1392,192L1440,192V320H0Z"
            />
          </Svg>
        </View>

        <View style={styles.formu}>
        <ScrollView contentContainerStyle={{alignItems: 'center', paddingBottom: 50}} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.titulo}>Crie sua conta</Text>

          {/* Inputs */}
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
                <View style={[styles.radioCircle, sexo === "Masculino" && styles.radioSelecionado]} />
                <Text style={styles.radioText}>Masculino</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setSexo("Feminino")}
              >
                <View style={[styles.radioCircle, sexo === "Feminino" && styles.radioSelecionado]} />
                <Text style={styles.radioText}>Feminino</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* INPUT DATA COM MÁSCARA AUTOMÁTICA */}
          <TextInput
            style={styles.input}
            placeholder="Nascimento (DD/MM/AAAA)*"
            placeholderTextColor="#B0B0B0"
            value={dataNascimento}
            onChangeText={handleDateChange} // <--- Aplica a máscara aqui
            keyboardType="numeric"
            maxLength={10} // Limita caracteres
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

          {/* CHECKBOX TERMOS DE USO */}
          <View style={styles.termosContainer}>
            <TouchableOpacity 
                style={[styles.checkbox, aceitoTermos && styles.checkboxActive]} 
                onPress={() => setAceitoTermos(!aceitoTermos)}
            >
                {aceitoTermos && <Ionicons name="checkmark" size={16} color="#fff" />}
            </TouchableOpacity>
            
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <Text style={styles.termosText}>Li e aceito os </Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={styles.termosLink}>Termos de Uso</Text>
                </TouchableOpacity>
            </View>
          </View>

          {/* BOTÃO CADASTRAR */}
          <TouchableOpacity 
            style={[styles.botao, loading && { opacity: 0.7 }]} 
            onPress={handleCadastro}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.botaoTexto}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          {/* LINK LOGIN (Colado no botão) */}
          <View style={styles.textRow}>
            <Text style={styles.normalText}>Já tem conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                 <Text style={styles.linkText}>Faça Login</Text>
            </TouchableOpacity>
          </View>

          </ScrollView>
        </View>

        {/* MODAL DE TERMOS */}
        <Modal visible={modalVisible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Termos de Uso</Text>
                    <ScrollView style={styles.modalScroll}>
                        <Text style={styles.modalText}>
                            1. Uso dos Recursos de Prevenção e Conteúdo{"\n"}
                           As informações, alertas e relatórios de risco disponibilizados pelo Preventive são de uso estritamente pessoal e intransferível. O usuário não deve compartilhar, reproduzir ou utilizar os dados de inteligência preventiva gerados pela plataforma para fins comerciais ou públicos sem autorização, sob pena de violação dos direitos de propriedade intelectual e cancelamento do acesso ao serviço.{"\n\n"}
                            
                            2. Responsabilidade do Usuário e Veracidade dos Dados{"\n"}
                            O usuário é inteiramente responsável pela precisão das informações inseridas no aplicativo, especialmente no que tange ao registro de ocorrências ("Novos Eventos"), dados de localização e perfil de risco. A eficácia das funcionalidades de prevenção depende da veracidade desses dados. O Preventive não se responsabiliza por falhas de monitoramento ou alertas imprecisos causados por informações incorretas, desatualizadas ou falsas fornecidas pelo usuário.{"\n\n"}
                            
                            3. Cancelamento de Serviços{"\n"}
                            O usuário poderá cancelar sua assinatura a qualquer momento através da área de gerenciamento de conta no aplicativo. O cancelamento interrompe a renovação automática para o ciclo seguinte, mas não gera direito a reembolso (proporcional ou integral) referente ao período já pago e não utilizado, mantendo-se o acesso ativo até o fim da vigência atual.{"\n\n"}
                            
                            4. Limitação de Responsabilidade e Caráter Informativo{"\n"}
                            O Preventive é uma ferramenta de apoio à tomada de decisão e gestão de riscos, não substituindo, em hipótese alguma, os serviços oficiais de emergência e segurança pública (como Polícia, Bombeiros ou Defesa Civil). O aplicativo não garante a prevenção total de incidentes. Em situações de perigo iminente ou emergência real, o usuário deve acionar imediatamente as autoridades competentes.{"\n\n"}
                            
                            5. Alterações nos Termos e Serviços{"\n"}
                            O Preventive reserva-se o direito de alterar, atualizar ou modificar estes Termos de Uso a qualquer momento para refletir melhorias no sistema ou adequações legais. Os usuários serão notificados sobre mudanças relevantes através da plataforma ou e-mail cadastrado. O uso contínuo do aplicativo após tais alterações implica na concordância tácita e irrestrita com os novos termos.{"\n\n"}
                            
                        </Text>
                    </ScrollView>
                    <TouchableOpacity style={styles.modalBtn} onPress={() => setModalVisible(false)}>
                        <Text style={styles.modalBtnText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#AFC8FF',
  },
  waveContainer: {
    position: 'absolute',
    top: height * -0.05,
    zIndex: 1,
  },
  formu: {
    backgroundColor: "#F9FAFB",
    flex: 1,
    width: '100%',
    marginTop: height * 0.18, 
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
  },
  titulo: { fontSize: 22, fontWeight: "bold", color: "#77a5ff", marginBottom: 15, alignSelf: 'center' },
  
  input: { 
    width: "85%", 
    height: 42, 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    paddingHorizontal: 15, 
    marginVertical: 5, 
    borderColor: "#E5E7EB", 
    borderWidth: 1, 
    fontSize: 14, 
    color: "#333" 
  },
  
  sexoContainer: { width: "85%", marginVertical: 5 },
  sexoLabel: { fontSize: 13, fontWeight: "600", marginBottom: 4, color: "#555" },
  radioRow: { flexDirection: "row", alignItems: "center" },
  radioOption: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  radioCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: "#77a5ff", marginRight: 6 },
  radioSelecionado: { backgroundColor: "#77a5ff" },
  radioText: { fontSize: 14, color: "#333" },

  // Checkbox e Termos
  termosContainer: { flexDirection: 'row', alignItems: 'center', width: '85%', marginTop: 15, marginBottom: 5 },
  checkbox: { width: 22, height: 22, borderWidth: 2, borderColor: '#77a5ff', borderRadius: 4, marginRight: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  checkboxActive: { backgroundColor: '#77a5ff' },
  termosText: { color: '#555', fontSize: 13 },
  termosLink: { color: '#77a5ff', fontWeight: 'bold', fontSize: 13, textDecorationLine: 'underline' },

  botao: { width: "85%", paddingVertical: 14, borderRadius: 25, backgroundColor: "#77a5ff", alignItems: "center", marginTop: 15, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  botaoTexto: { fontSize: 16, color: "#fff", fontWeight: "bold" },

  textRow: { flexDirection: "row", marginTop: 15 },
  normalText: { fontSize: 13, color: "#888" },
  linkText: { fontSize: 13, color: "#77a5ff", fontWeight: "bold" },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', height: '60%', backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 10, textAlign: 'center' },
  modalScroll: { flex: 1, marginBottom: 15 },
  modalText: { fontSize: 14, color: '#555', lineHeight: 22, textAlign: 'justify' },
  modalBtn: { backgroundColor: '#77a5ff', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  modalBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});