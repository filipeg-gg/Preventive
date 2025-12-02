import React, { useState, useEffect } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput, Alert, Platform, ActivityIndicator, FlatList
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRoute } from "@react-navigation/native";
import * as EventStore from "../principal/EventStore";
import * as ChatStore from "../principal/chatStore"; 

// Lista fixa de estabelecimentos
const LOCAIS_DISPONIVEIS = [
  "Pronto Socorro Doutor Akira Tada", "Hospital Family", "Hospital das Clínicas",
  "Mais Vc Diagnósticos por Imagem", "Policlínica Taboão", "Pronto Socorro Antena",
  "Hapvida Notrelabs Taboão da Serra", "AmorSaúde Taboão da Serra", "Greenline (Pronto Socorros) Taboão"
];

export default function Resultado({ navigation }) { // <--- Mude o nome da função em cada arquivo
  const route = useRoute();

  // === CONFIGURAÇÃO ESPECÍFICA DE CADA TELA ===
  // Na TelaExame.js mude para "Exame"
  // Na TelaResultado.js mude para "Resultado"
  const TIPO_FIXO = "Resultado"; 
  const COR_FUNDO = "#f9f9fb"; // Consulta(#e0f7fa), Exame(#ffe4f0), Resultado(#f9f9fb)
  // ============================================

  const [loading, setLoading] = useState(false);
  const [modalLocalVisible, setModalLocalVisible] = useState(false);
  
  const [titulo, setTitulo] = useState("");
  const [local, setLocal] = useState(""); 
  const [obs, setObs] = useState("");
  const [data, setData] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [mostrarTimePicker, setMostrarTimePicker] = useState(false);

  // Se vier uma data pré-selecionada da Home
  useEffect(() => {
    if (route.params?.dataPrevia) {
      setData(new Date(route.params.dataPrevia));
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

  const salvarEvento = async () => {
    if (!titulo.trim()) {
      Alert.alert("Erro", "Preencha o título!");
      return;
    }
    if (!local) {
      Alert.alert("Erro", "Selecione o local!");
      return;
    }

    setLoading(true);
    const dotColors = { Exame: "#f472b6", Resultado: "#60a5fa", Consulta: "#fb923c" };

    const novo = {
      tipo: TIPO_FIXO,
      titulo: titulo.trim(),
      local: local,
      data: formatarData(data),
      hora: formatarHora(hora),
      obs: obs.trim(),
      color: dotColors[TIPO_FIXO] || "#3b82f6", 
    };

    try {
      await EventStore.addEvent(novo);
      if (ChatStore && ChatStore.enviarNotificacaoAgendamento) {
          await ChatStore.enviarNotificacaoAgendamento(novo);
      }
      Alert.alert("Sucesso", `${TIPO_FIXO} salvo!`);
      navigation.navigate("Principal");
    } catch (err) {
      Alert.alert("Erro", "Não foi possível salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: COR_FUNDO }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Principal")}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Nova {TIPO_FIXO}</Text>
        <View style={{width: 24}} /> 
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} keyboardShouldPersistTaps="handled">
        
        {/* Título */}
        <View style={styles.infoBox}>
          <Text style={styles.label}>Título:</Text>
          <TextInput
            style={styles.input}
            placeholder={`Ex: ${TIPO_FIXO === 'Consulta' ? 'Cardiologista' : 'Hemograma'}`}
            value={titulo}
            onChangeText={setTitulo}
          />
        </View>

        {/* Local */}
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

        {/* Data */}
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
            <DateTimePicker value={data} mode="date" display={Platform.OS === "ios" ? "spinner" : "calendar"} onChange={onChangeData} />
          )}
        </View>

        {/* Hora */}
        <View style={styles.infoBox}>
          <Text style={styles.label}>Horário:</Text>
          <TouchableOpacity
            style={[styles.input, { flexDirection: "row", alignItems: "center" }]}
            onPress={() => setMostrarTimePicker(true)}
          >
            <Icon name="clock" size={18} color="#555" style={{ marginRight: 8 }} />
            <Text style={styles.inputText}>{formatarHora(hora)}</Text>
          </TouchableOpacity>
          {mostrarTimePicker && (
            <DateTimePicker value={hora} mode="time" display={Platform.OS === "ios" ? "spinner" : "clock"} onChange={onChangeHora} />
          )}
        </View>

        {/* Obs */}
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

        {/* Botões */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.botaoCancelar} onPress={() => navigation.goBack()}>
            <Text style={styles.textoCancelar}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.botaoSalvar, loading && { opacity: 0.7 }]} onPress={salvarEvento} disabled={loading}>
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.textoSalvar}>Salvar</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>

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
                  onPress={() => { setLocal(item); setModalLocalVisible(false); }}
                >
                  <Icon name="map-pin" size={18} color="#6b7280" style={{marginRight: 10}} />
                  <Text style={styles.itemLocalTexto}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 50 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  headerTitulo: { fontSize: 20, fontWeight: "700", color: "#333" },
  infoBox: { backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, fontSize: 14 },
  inputText: { fontSize: 14, color: "#333" },
  footer: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 15 },
  botaoCancelar: { flex: 1, marginRight: 10, paddingVertical: 14, borderRadius: 10, backgroundColor: "#111827", alignItems: "center" },
  textoCancelar: { color: "#fff", fontWeight: "600", fontSize: 15 },
  botaoSalvar: { flex: 1, marginLeft: 10, paddingVertical: 14, borderRadius: 10, backgroundColor: "#3b82f6", alignItems: "center" },
  textoSalvar: { color: "#fff", fontWeight: "600", fontSize: 15 },
  modalLocalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalLocalContent: { backgroundColor: "#fff", height: "60%", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalLocalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalLocalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  itemLocal: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', flexDirection: 'row', alignItems: 'center' },
  itemLocalTexto: { fontSize: 16, color: '#333' },
});