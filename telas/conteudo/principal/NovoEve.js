import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  TextInput, 
  Alert, 
  Platform, 
  ActivityIndicator,
  FlatList
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRoute } from "@react-navigation/native";
import * as EventStore from "./EventStore";
import * as ChatStore from "./chatStore"; 

// Lista fixa de estabelecimentos
const LOCAIS_DISPONIVEIS = [
  "Pronto Socorro Doutor Akira Tada",
  "Hospital Family",
  "Hospital das Clínicas",
  "Mais Vc Diagnósticos por Imagem",
  "Policlínica Taboão",
  "Pronto Socorro Antena",
  "Hapvida Notrelabs Taboão da Serra",
  "AmorSaúde Taboão da Serra",
  "Greenline (Pronto Socorros) Taboão"
];

export default function NovoEve({ navigation }) {
const route = useRoute();

  const [evento, setEvento] = useState(route.params?.tipo || null);
  const [visible, setVisible] = useState(route.params?.abrirModal ?? false);
  const [loading, setLoading] = useState(false);
  const [modalLocalVisible, setModalLocalVisible] = useState(route.params?.abrirModalLocal ?? false);
  const [titulo, setTitulo] = useState("");
  const [local, setLocal] = useState(""); // Agora armazenará um dos nomes da lista
  const [obs, setObs] = useState("");
  const [data, setData] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [mostrarTimePicker, setMostrarTimePicker] = useState(false);  
// ============================================================
  // ADICIONE ESTE BLOCO ABAIXO DOS SEUS STATES
  // ============================================================
  useEffect(() => {
    if (route.params) {
      
      const deveAbrirModalTipo = route.params.abrirModal ?? false;
      setVisible(deveAbrirModalTipo);

      const deveAbrirModalLocal = route.params.abrirModalLocal ?? false;
      setModalLocalVisible(deveAbrirModalLocal);
      setEvento(route.params.tipo || null);
    if (!route.params.tipo) setLocal(""); 
    }
  }, [route.params]); 




  const formatarData = (d) => {
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const formatarHora = (d) => {
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  }

  const onChangeData = (event, selectedDate) => {
    setMostrarDatePicker(false);
    if (selectedDate) setData(selectedDate);
  };
  
  const onChangeHora = (event, selectedTime) => {
    setMostrarTimePicker(false);
    if (selectedTime) setHora(selectedTime);
  }

  const salvarEvento = async (tipo) => {
    if (!titulo.trim()) {
      Alert.alert("Erro", "Preencha o título do evento!");
      return;
    }
    if (!local) {
      Alert.alert("Erro", "Selecione o local do atendimento!");
      return;
    }

    setLoading(true);

    const dotColors = {
      Exame: "#f472b6",
      Resultado: "#60a5fa",
      Consulta: "#fb923c",
    };

    const novo = {
      tipo,
      titulo: titulo.trim(),
      local: local, // O local agora é obrigatoriamente um da lista
      data: formatarData(data),
      hora: formatarHora(hora),
      obs: obs.trim(),
      color: dotColors[tipo] || "#3b82f6", 
    };

    try {
      // 1. Salva o evento no Firestore (EventStore)
      await EventStore.addEvent(novo);
      
      // 2. Envia a notificação automática para o chat (ChatStore)
      if (ChatStore && ChatStore.enviarNotificacaoAgendamento) {
          await ChatStore.enviarNotificacaoAgendamento(novo);
      }

      Alert.alert("Sucesso", `${tipo} salvo com sucesso!`);
      navigation.navigate("Principal");
    } catch (err) {
      console.error("Erro ao salvar evento:", err);
      Alert.alert("Erro", "Não foi possível salvar o evento.");
    } finally {
      setLoading(false);
    }
  };

  const escolherEvento = (tipo) => {
    setEvento(tipo);
    setVisible(false);
  };

  const renderCamposComuns = () => (
    <>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Título:</Text>
        <TextInput
          style={styles.input}
          placeholder={
            evento === "Consulta"
              ? "Ex: Ginecologista"
              : evento === "Exame"
              ? "Ex: Mamografia"
              : "Ex: Papanicolau"
          }
          value={titulo}
          onChangeText={setTitulo}
        />
      </View>

      {/* CAMPO DE LOCAL (DROPDOWN/MODAL) */}
      <View style={styles.infoBox}>
        <Text style={styles.label}>Local:</Text>
        <TouchableOpacity 
          style={[styles.input, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}
          onPress={() => setModalLocalVisible(true)}
        >
          <Text style={{ color: local ? "#333" : "#9ca3af", fontSize: 14 }}>
            {local || "Selecione o estabelecimento"}
          </Text>
          <Icon name="chevron-down" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Data:</Text>
        <TouchableOpacity
          style={[styles.input, { flexDirection: "row", alignItems: "center" }]}
          onPress={() => setMostrarDatePicker(true)}
        >
          <Icon name="calendar" size={18} color="#555" style={{ marginRight: 10 }} />
          <Text style={{ color: "#333", fontSize: 14 }}>{formatarData(data)}</Text>
        </TouchableOpacity>
        {mostrarDatePicker && (
          <DateTimePicker
            value={data}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "calendar"}
            onChange={onChangeData}
          />
        )}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Horário</Text>
        <TouchableOpacity
          style={[styles.input, styles.row]}
          onPress={() => setMostrarTimePicker(true)}
        >
          <Icon name="clock" size={18} color="#555" style={{ marginRight: 8 }} />
          <Text style={styles.inputText}>{formatarHora(hora)}</Text>
        </TouchableOpacity>
        {mostrarTimePicker && (
          <DateTimePicker
            value={hora}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "clock"}
            onChange={onChangeHora}
          />
        )}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Observações:</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Digite observações..."
          multiline
          value={obs}
          onChangeText={setObs}
        />
      </View>
    </>
  );

  const renderConteudo = () => {
    if (!evento) return null;

    const coresContainer = {
      Exame: "#ffe4f0",
      Consulta: "#e0f7fa",
      Resultado: "#f9f9fb",
    };

    return (
      <View style={[styles.tela, { backgroundColor: coresContainer[evento] }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Principal")}>
            <Icon name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>{evento}</Text>
          <TouchableOpacity onPress={() => setVisible(true)}>
            <Icon name="refresh-cw" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          {renderCamposComuns()}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={() => navigation.navigate("Principal")}
            >
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.botaoSalvar, loading && { opacity: 0.7 }]}
              onPress={() => salvarEvento(evento)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.textoSalvar}>Salvar</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Modal de Tipo de Evento */}
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Qual o evento?</Text>
            <TouchableOpacity style={styles.botao} onPress={() => escolherEvento("Exame")}>
              <Text style={styles.botaoTexto}>Exame</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botao} onPress={() => escolherEvento("Consulta")}>
              <Text style={styles.botaoTexto}>Consulta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botao} onPress={() => escolherEvento("Resultado")}>
              <Text style={styles.botaoTexto}>Resultado</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Seleção de Local */}
      <Modal visible={modalLocalVisible} transparent animationType="slide" onRequestClose={() => setModalLocalVisible(false)}>
        <View style={styles.modalLocalOverlay}>
          <View style={styles.modalLocalContent}>
            <View style={styles.modalLocalHeader}>
              <Text style={styles.modalLocalTitle}>Selecione o local</Text>
              <TouchableOpacity onPress={() => setModalLocalVisible(false)}>
                <Icon name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList 
              data={LOCAIS_DISPONIVEIS}
              keyExtractor={(item) => item}
              renderItem={({item}) => (
                <TouchableOpacity 
                  style={styles.itemLocal}
                  onPress={() => {
                    setLocal(item);
                    setModalLocalVisible(false);
                  }}
                >
                  <Icon name="map-pin" size={18} color="#6b7280" style={{marginRight: 10}} />
                  <Text style={styles.itemLocalTexto}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <View style={styles.conteudo}>{renderConteudo()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9fb" },
  conteudo: { flex: 1 },
  tela: { flex: 1, paddingHorizontal: 20, paddingTop: 50 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  headerTitulo: { fontSize: 20, fontWeight: "700", color: "#333" },
  infoBox: { backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, fontSize: 14 },
  inputText: { fontSize: 14, color: "#333" },
  row: { flexDirection: "row", alignItems: "center" },
  footer: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 15 },
  botaoCancelar: { flex: 1, marginRight: 10, paddingVertical: 14, borderRadius: 10, backgroundColor: "#111827", alignItems: "center" },
  textoCancelar: { color: "#fff", fontWeight: "600", fontSize: 15 },
  botaoSalvar: { flex: 1, marginLeft: 10, paddingVertical: 14, borderRadius: 10, backgroundColor: "#3b82f6", alignItems: "center" },
  textoSalvar: { color: "#fff", fontWeight: "600", fontSize: 15 },
  
  // Modais
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center" },
  modalBox: { backgroundColor: "#fff", padding: 25, borderRadius: 15, width: "80%", alignItems: "center" },
  modalTitulo: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  botao: { backgroundColor: "#3b82f6", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, marginVertical: 5, width: "100%", alignItems: "center" },
  botaoTexto: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  // Modal Local
  modalLocalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalLocalContent: { backgroundColor: "#fff", height: "60%", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalLocalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalLocalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  itemLocal: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', flexDirection: 'row', alignItems: 'center' },
  itemLocalTexto: { fontSize: 16, color: '#333' },
});
