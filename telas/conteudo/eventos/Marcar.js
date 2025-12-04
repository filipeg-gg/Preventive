import React, { useState, useEffect } from "react";
import { 
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, TextInput, Alert, ActivityIndicator 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as EventStore from "../principal/EventStore"; 
import * as ChatStore from "../principal/chatStore"; 

export default function Marcar({ route, navigation }) {
  const { hospital } = route.params;

  // === ESTADOS DE CONTROLE VISUAL ===
  const [introVisible, setIntroVisible] = useState(false);
  const [modalFlowVisible, setModalFlowVisible] = useState(false);
  const [step, setStep] = useState(1); // 1: Agendar, 2: Pagamento, 3: Sucesso

  // === DADOS DO AGENDAMENTO ===
  const [tipoServico, setTipoServico] = useState("Exame"); // "Exame" ou "Consulta"
  const [exameSelecionado, setExameSelecionado] = useState(""); 
  const [data, setData] = useState(new Date());
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("Particular"); // "Convenio" ou "Particular"
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Dados Mockados para simular a imagem
  const listaExames = ["Papanicolau", "Ultrassom transvaginal", "Colposcopia", "Teste de HPV", "Exame de sangue"];
  const listaConsultas = ["Ginecologia", "Obstetrícia", "Mastologia", "Dermatologia", "Clínico Geral"];
  const horariosManha = ["08:00", "09:30", "10:00", "11:15"];
  const horariosTarde = ["13:00", "13:30", "14:30", "15:00", "16:45", "17:00"];

  // 1. MODAL DE INTRODUÇÃO (Abre ao entrar)
  useEffect(() => {
    setTimeout(() => {
        setIntroVisible(true);
    }, 600);
  }, []);

  const formatarData = (d) => {
    return d.toLocaleDateString("pt-BR");
  };

  // Inicia o fluxo de agendamento
  const iniciarAgendamento = (tipo) => {
    setTipoServico(tipo);
    setStep(1);
    setExameSelecionado("");
    setHorarioSelecionado("");
    setModalFlowVisible(true);
  };

  // Salvar no Banco (Executado no Passo 3)
  const finalizarAgendamento = async () => {
    setLoading(true);
    
    const novoEvento = {
      tipo: tipoServico,
      titulo: exameSelecionado || `${tipoServico} Geral`,
      local: hospital.nome,
      data: formatarData(data),
      hora: horarioSelecionado || "08:00",
      obs: `Pagamento: ${metodoPagamento}. Agendado via App.`,
      color: tipoServico === "Exame" ? "#f472b6" : "#fb923c",
    };

    try {
      await EventStore.addEvent(novoEvento);
      if (ChatStore && ChatStore.enviarNotificacaoAgendamento) {
        await ChatStore.enviarNotificacaoAgendamento(novoEvento);
      }
      setLoading(false);
      // Avança para a tela de Sucesso
      setStep(3); 
    } catch (error) {
      setLoading(false);
      Alert.alert("Erro", "Falha ao salvar agendamento.");
    }
  };

  // --- RENDERIZADORES DE CADA PASSO DO MODAL ---

  // PASSO 1: ESCOLHER SERVIÇO, DATA E HORA
  const renderStep1 = () => {
    // LÓGICA NOVA: Define qual lista usar baseada no botão que clicou
    const opcoesParaMostrar = tipoServico === "Exame" ? listaExames : listaConsultas;
    const tituloSecao = tipoServico === "Exame" ? "Exames oferecidos" : "Especialidades disponíveis";

    return (
      <>
        <Text style={styles.modalTitle}>Agende {tipoServico === "Exame" ? "um exame" : "uma consulta"}</Text>
        
        <Text style={styles.sectionLabel}>{tituloSecao}</Text>
        
        {/* Aqui ele mapeia a lista correta (Exames ou Consultas) */}
        {opcoesParaMostrar.map((item, idx) => (
          <TouchableOpacity key={idx} style={styles.radioRow} onPress={() => setExameSelecionado(item)}>
            <View style={[styles.radioOuter, exameSelecionado === item && styles.radioActive]}>
              {exameSelecionado === item && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioText}>{item}</Text>
          </TouchableOpacity>
        ))}
  
        <Text style={styles.sectionLabel}>Escolha uma data</Text>
        <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar-outline" size={20} color="#333" />
          <Text style={styles.dateText}>{formatarData(data)}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
              value={data}
              mode="date"
              display="default"
              onChange={(e, d) => { setShowDatePicker(false); if(d) setData(d); }}
          />
        )}
  
        <Text style={styles.sectionLabel}>Escolha um horário</Text>
        <View style={styles.timeGrid}>
          {[...horariosManha, ...horariosTarde].map((hora, idx) => (
             <TouchableOpacity 
               key={idx} 
               style={[
                 styles.timeBadge, 
                 horarioSelecionado === hora ? styles.timeBadgeActive : styles.timeBadgeInactive
               ]}
               onPress={() => setHorarioSelecionado(hora)}
             >
               <Text style={[styles.timeText, horarioSelecionado === hora && {color:'#fff'}]}>{hora}</Text>
             </TouchableOpacity>
          ))}
        </View>
  
        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.btnOutline} onPress={() => setModalFlowVisible(false)}>
              <Text style={styles.btnOutlineText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
              style={[styles.btnSolid, (!exameSelecionado || !horarioSelecionado) && {opacity: 0.5}]} 
              disabled={!exameSelecionado || !horarioSelecionado}
              onPress={() => setStep(2)}
          >
              <Text style={styles.btnSolidText}>Prosseguir</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  // PASSO 2: PAGAMENTO
  const renderStep2 = () => (
    <>
      <Text style={styles.modalTitle}>Escolha um método</Text>

      {/* Convênio */}
      <Text style={styles.sectionLabel}>Convênio</Text>
      {["Unimed", "Amil", "Bradesco Saúde", "SulAmérica"].map((conv, idx) => (
        <TouchableOpacity key={idx} style={styles.radioRow} onPress={() => setMetodoPagamento(conv)}>
          <View style={[styles.radioOuter, metodoPagamento === conv && styles.radioActive]}>
             {metodoPagamento === conv && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.radioText}>{conv}</Text>
        </TouchableOpacity>
      ))}
      
      {/* Campos fake de convênio */}
      <View style={{gap: 10, marginTop: 10}}>
        <TextInput style={styles.input} placeholder="Nº da carteirinha" keyboardType="numeric" />
        <View style={{flexDirection:'row', gap: 10}}>
             <TextInput style={[styles.input, {flex:1}]} placeholder="Validade (MM/AA)" />
             <TextInput style={[styles.input, {flex:1}]} placeholder="Tipo de plano" />
        </View>
      </View>

      {/* Particular */}
      <Text style={[styles.sectionLabel, {marginTop: 20}]}>Particular</Text>
      <View style={styles.priceBox}>
        <Text style={styles.priceBoxText}>Total a pagar = {tipoServico === "Exame" ? hospital.precoExame : hospital.precoConsulta}</Text>
      </View>
      
      <View style={styles.modalFooter}>
        <TouchableOpacity style={styles.btnOutline} onPress={() => setStep(1)}>
            <Text style={styles.btnOutlineText}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSolid} onPress={finalizarAgendamento}>
            {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnSolidText}>Finalizar</Text>}
        </TouchableOpacity>
      </View>
    </>
  );

  // PASSO 3: SUCESSO
  const renderStep3 = () => (
    <View style={{alignItems:'center'}}>
      <Text style={styles.successTitle}>Obrigada por cuidar da sua saúde com a <Text style={{color:'#5A8DFF'}}>Preventive</Text>.</Text>
      
      <Text style={styles.successBody}>
        Nós já avisamos o hospital sobre o seu agendamento.
        {"\n\n"}
        Disponibilizamos, no seu <Text style={{color:'#5A8DFF', textDecorationLine:'underline'}}>canal de comunicação</Text> do aplicativo, um chat individual entre você e o hospital.
        {"\n\n"}
        Se não conseguir ajuda, entre em contato com o suporte.
      </Text>

      <TouchableOpacity 
        style={[styles.btnSolid, {width: '100%', marginTop: 20, backgroundColor: '#1B0D3F'}]} 
        onPress={() => {
            setModalFlowVisible(false);
            navigation.navigate("Principal");
        }}
      >
        <Text style={styles.btnSolidText}>Entendido</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header com Imagem */}
      <View style={styles.headerContainer}>
        <Image source={{ uri: hospital.imagem }} style={styles.headerImage} resizeMode="cover" />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Principal")}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner Azul */}
        <View style={styles.bannerNome}>
            <Text style={styles.bannerText}>{hospital.nome}</Text>
        </View>

        {/* Cards de Informação */}
        <View style={styles.card}>
            <Text style={styles.label}>Endereço</Text>
            <Text style={styles.infoText}>{hospital.endereco}</Text>
        </View>

        <View style={styles.row}>
            <View style={[styles.card, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>E-mail</Text>
                <Text style={styles.infoText} numberOfLines={1}>{hospital.email}</Text>
            </View>
            <View style={[styles.card, { flex: 1 }]}>
                <Text style={styles.label}>Telefone</Text>
                <Text style={styles.infoText}>{hospital.telefone}</Text>
            </View>
        </View>

        <View style={styles.row}>
            <View style={[styles.card, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Valor do exame</Text>
                <Text style={styles.priceText}>{hospital.precoExame}</Text>
            </View>
            <View style={[styles.card, { flex: 1 }]}>
                <Text style={styles.label}>Valor da consulta</Text>
                <Text style={styles.priceText}>{hospital.precoConsulta}</Text>
            </View>
        </View>

        <View style={styles.card}>
            <Text style={styles.label}>Avaliação do público</Text>
            <View style={styles.tagsContainer}>
                {hospital.tags?.map((tag, index) => (
                    <View key={index} style={styles.tagBadge}>
                        <Text style={styles.tagText}>{tag}</Text>
                    </View>
                ))}
            </View>
        </View>
              {/* Botões do Rodapé */}
        <View style={styles.footerButtons}>
            <TouchableOpacity style={styles.btnMain} onPress={() => iniciarAgendamento("Exame")}>
                <Text style={styles.btnMainText}>Exame</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnMain} onPress={() => iniciarAgendamento("Consulta")}>
                <Text style={styles.btnMainText}>Consulta</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>


      {/* MODAL 1: INTRODUÇÃO */}
      <Modal visible={introVisible} transparent animationType="fade" onRequestClose={() => setIntroVisible(false)}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalIntroContent}>
                <Ionicons name="medical" size={40} color="#5A8DFF" style={{marginBottom: 10}} />
                <Text style={styles.introTitle}>Parceiro Preventive</Text>
                <Text style={styles.introText}>
                    Aqui você pode agendar consultas e exames particulares com integração direta ao seu calendário.
                </Text>
                <TouchableOpacity style={styles.btnIntro} onPress={() => setIntroVisible(false)}>
                    <Text style={styles.btnIntroText}>OK, Entendi</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

      {/* MODAL 2: FLUXO DE AGENDAMENTO (3 PASSOS) */}
      <Modal visible={modalFlowVisible} transparent animationType="slide" onRequestClose={() => setModalFlowVisible(false)}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalFlowContent}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EFEFEF" },
  
  // Header Style
  headerContainer: { height: 200, position: 'relative' },
  headerImage: { width: '100%', height: '100%', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  backButton: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(255,255,255,0.9)', padding: 8, borderRadius: 20 },

  // Content Style
  scrollContent: { padding: 20, paddingBottom: 100 },
  bannerNome: { backgroundColor: '#5A8DFF', paddingVertical: 12, borderRadius: 25, alignItems: 'center', marginBottom: 20 },
  bannerText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 1 },
  row: { flexDirection: 'row' },
  label: { fontSize: 12, color: '#9CA3AF', marginBottom: 4 },
  infoText: { fontSize: 14, color: '#333', fontWeight: '500' },
  priceText: { fontSize: 16, color: '#22C55E', fontWeight: 'bold' },
  
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 5 },
  tagBadge: { backgroundColor: '#Dbeafe', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tagText: { color: '#1e3a8a', fontSize: 11, fontWeight: '600' },

  // Footer Buttons
  footerButtons: { flexDirection: 'row', padding: 20, position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#EFEFEF', gap: 15 },
  btnMain: { flex: 1, backgroundColor: '#1B0D3F', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  btnMainText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  // Modals Overlay
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  
  // Intro Modal
  modalIntroContent: { backgroundColor: '#fff', width: '80%', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 10 },
  introTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  introText: { textAlign: 'center', color: '#666', marginBottom: 20 },
  btnIntro: { backgroundColor: '#1B0D3F', paddingHorizontal: 30, paddingVertical: 10, borderRadius: 20 },
  btnIntroText: { color: '#fff', fontWeight: 'bold' },

  // Flow Modal (White Card)
  modalFlowContent: { backgroundColor: '#fff', width: '90%', borderRadius: 15, padding: 20, maxHeight: '85%', elevation: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1B0D3F', textAlign: 'center', marginBottom: 20 },
  sectionLabel: { fontSize: 14, color: '#555', marginTop: 15, marginBottom: 8, fontWeight: '600' },
  
  // Radio Buttons
  radioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ccc', marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  radioActive: { borderColor: '#5A8DFF' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#5A8DFF' },
  radioText: { color: '#333' },

  // Date Input
  dateInput: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, gap: 10 },
  dateText: { color: '#333' },

  // Time Grid
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeBadge: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, backgroundColor: '#f0f0f0' },
  timeBadgeActive: { backgroundColor: '#1B0D3F' },
  timeBadgeInactive: { backgroundColor: '#e5e5e5' },
  timeText: { fontSize: 12, color: '#333' },

  // Inputs Payment
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 13, backgroundColor: '#fff' },
  priceBox: { backgroundColor: '#A7F3D0', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  priceBoxText: { color: '#065F46', fontWeight: 'bold' },

  // Success Step
  successTitle: { fontSize: 22, fontStyle: 'italic', fontWeight: 'bold', color: '#1B0D3F', textAlign: 'center', marginBottom: 20 },
  successBody: { textAlign: 'center', color: '#555', lineHeight: 20 },

  // Modal Footer Buttons
  modalFooter: { flexDirection: 'row', marginTop: 30, gap: 15 },
  btnOutline: { flex: 1, borderWidth: 1, borderColor: '#FF6B6B', paddingVertical: 12, borderRadius: 25, alignItems: 'center' },
  btnOutlineText: { color: '#FF6B6B', fontWeight: 'bold' },
  btnSolid: { flex: 1, backgroundColor: '#5A8DFF', paddingVertical: 12, borderRadius: 25, alignItems: 'center' },
  btnSolidText: { color: '#fff', fontWeight: 'bold' },
});