import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

// --- FIREBASE CONFIG ---
import { db, auth } from '../../../../firebaseConfig'; 
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  deleteDoc, 
  doc
} from "firebase/firestore";

export default function Diario() {
  const navigation = useNavigation();
  const user = auth.currentUser;

  const [activeTab, setActiveTab] = useState("diario");
  const [loading, setLoading] = useState(false);

  // === ESTADOS DO DIÁRIO (NOTAS) ===
  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [notas, setNotas] = useState([]);

  // === ESTADOS DO HUMOR ===
  const [humorModal, setHumorModal] = useState(false);
  const [humorSelecionado, setHumorSelecionado] = useState(null);
  const [humorHistorico, setHumorHistorico] = useState([]);

  const opcoesHumor = [
    { tipo: "Radiante", nivel: 5, icon: "sun", color: "#FDB813" },
    { tipo: "Feliz",    nivel: 4, icon: "smile", color: "#10B981" },
    { tipo: "Normal",   nivel: 3, icon: "meh", color: "#6B7280" },
    { tipo: "Cansado",  nivel: 2, icon: "battery-charging", color: "#8B5CF6" },
    { tipo: "Ansioso",  nivel: 2, icon: "alert-circle", color: "#F59E0B" },
    { tipo: "Triste",   nivel: 1, icon: "frown", color: "#3B82F6" },
    { tipo: "Raiva",    nivel: 1, icon: "x-circle", color: "#EF4444" },
  ];

  // === 1. BUSCAR DADOS EM TEMPO REAL (SEM ORDERBY DO BANCO PARA EVITAR ERROS) ===
  useEffect(() => {
    if (!user) return;

    // A) Buscar Notas
    const qNotas = query(
      collection(db, "diario_notas"),
      where("uid", "==", user.uid)
    );
    
    const unsubscribeNotas = onSnapshot(qNotas, (snapshot) => {
      const lista = snapshot.docs.map(doc => {
        const data = doc.data();
        // Proteção de Data
        let dataFormatada = "--/--";
        let timestamp = 0;
        
        if (data.data && data.data.toDate) {
            const d = data.data.toDate();
            dataFormatada = d.toLocaleDateString('pt-BR');
            timestamp = d.getTime();
        }

        return {
          id: doc.id,
          ...data,
          dataFormatada,
          timestamp // Usado para ordenar manualmente
        };
      });

      // Ordenar do mais novo para o mais antigo (Javascript)
      lista.sort((a, b) => b.timestamp - a.timestamp);
      
      setNotas(lista);
    });

    // B) Buscar Humor
    const qHumor = query(
      collection(db, "diario"),
      where("uid", "==", user.uid)
    );

    const unsubscribeHumor = onSnapshot(qHumor, (snapshot) => {
      const lista = snapshot.docs.map(doc => {
        const data = doc.data();
        let dataFormatada = "--/--";
        let horaFormatada = "--:--";
        let timestamp = 0;

        if (data.data && data.data.toDate) {
             const d = data.data.toDate();
             dataFormatada = d.toLocaleDateString('pt-BR');
             horaFormatada = d.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
             timestamp = d.getTime();
        }

        return {
          id: doc.id,
          ...data,
          dataFormatada,
          horaFormatada,
          timestamp
        };
      });

      // Ordenar manualmente
      lista.sort((a, b) => b.timestamp - a.timestamp);

      setHumorHistorico(lista);
    });

    return () => {
      unsubscribeNotas();
      unsubscribeHumor();
    };
  }, [user]);

  // === 2. SALVAR NOTA ===
  const salvarNota = async () => {
    if (!titulo.trim() || !texto.trim()) {
        Alert.alert("Atenção", "Preencha o título e o texto.");
        return;
    }

    setLoading(true);
    try {
        await addDoc(collection(db, "diario_notas"), {
            uid: user.uid,
            titulo,
            texto,
            data: new Date(),
        });

        setTitulo("");
        setTexto("");
        setModalVisible(false);
    } catch (error) {
        console.error("Erro ao salvar nota:", error);
        Alert.alert("Erro", "Não foi possível salvar.");
    } finally {
        setLoading(false);
    }
  };

  const deletarNota = async (id) => {
    try {
        await deleteDoc(doc(db, "diario_notas", id));
    } catch (error) {
        console.error("Erro ao deletar:", error);
    }
  };

  // === 3. SALVAR HUMOR ===
  const salvarHumor = async () => {
    if (!humorSelecionado) return;
    
    setLoading(true);
    try {
        await addDoc(collection(db, "diario"), {
            uid: user.uid,
            tipo: humorSelecionado.tipo,
            humorNivel: humorSelecionado.nivel,
            icon: humorSelecionado.icon,
            color: humorSelecionado.color,
            data: new Date()
        });

        setHumorSelecionado(null);
        setHumorModal(false);
    } catch (error) {
        console.error("Erro humor:", error);
        Alert.alert("Erro", "Falha ao registrar humor.");
    } finally {
        setLoading(false);
    }
  };

  const getIconColor = (tipo) => {
      const found = opcoesHumor.find(op => op.tipo === tipo);
      return found ? found.color : "#2D1E72";
  };
  
  const getIconName = (tipo) => {
    const found = opcoesHumor.find(op => op.tipo === tipo);
    return found ? found.icon : "circle";
  };

  return (
    <View style={styles.container}>
      {/* Header Fixo */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
            <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate("Cuidados")}>
                <Icon name="arrow-left" size={24} color="#2D1E72" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Meu Diário</Text>
            {/* View vazia para equilibrar o header */}
            <View style={styles.headerBtn} /> 
        </View>

        {/* Tabs Modernas */}
        <View style={styles.tabContainer}>
            <TouchableOpacity 
                style={[styles.tabItem, activeTab === "diario" && styles.tabItemActive]}
                onPress={() => setActiveTab("diario")}
            >
                <Icon name="book" size={16} color={activeTab === "diario" ? "#fff" : "#2D1E72"} />
                <Text style={[styles.tabText, activeTab === "diario" && styles.tabTextActive]}>Anotações</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.tabItem, activeTab === "humor" && styles.tabItemActive]}
                onPress={() => setActiveTab("humor")}
            >
                <Icon name="smile" size={16} color={activeTab === "humor" ? "#fff" : "#2D1E72"} />
                <Text style={[styles.tabText, activeTab === "humor" && styles.tabTextActive]}>Humor</Text>
            </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* --- ABA DIÁRIO --- */}
        {activeTab === "diario" && (
          <>
            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <Icon name="plus" size={24} color="#fff" />
                <Text style={styles.fabText}>Nova Nota</Text>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 80}}>
                {notas.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Icon name="edit-3" size={40} color="#DDD" />
                        <Text style={styles.emptyText}>Escreva sobre o seu dia...</Text>
                    </View>
                ) : (
                    notas.map((nota) => (
                    <View key={nota.id} style={styles.noteCard}>
                        <View style={styles.noteHeader}>
                            <Text style={styles.noteTitle}>{nota.titulo}</Text>
                            <Text style={styles.noteDate}>{nota.dataFormatada}</Text>
                        </View>
                        <Text style={styles.noteBody} numberOfLines={4}>{nota.texto}</Text>
                        
                        <View style={styles.noteFooter}>
                             <TouchableOpacity style={styles.deleteBtn} onPress={() => deletarNota(nota.id)}>
                                <Icon name="trash-2" size={16} color="#FF6B6B" />
                                <Text style={styles.deleteText}>Excluir</Text>
                             </TouchableOpacity>
                        </View>
                    </View>
                    ))
                )}
            </ScrollView>
          </>
        )}

        {/* --- ABA HUMOR --- */}
        {activeTab === "humor" && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 80}}>
            <View style={styles.ctaCard}>
                <View style={styles.ctaTextContainer}>
                    <Text style={styles.ctaTitle}>Como você está?</Text>
                    <Text style={styles.ctaSubtitle}>Registrar seu humor ajuda a gerar relatórios precisos.</Text>
                </View>
                <TouchableOpacity style={styles.ctaButton} onPress={() => setHumorModal(true)}>
                    <Text style={styles.ctaButtonText}>Registrar</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Histórico Recente</Text>
            
            {humorHistorico.length === 0 ? (
                <View style={styles.emptyState}>
                    <Icon name="activity" size={40} color="#DDD" />
                    <Text style={styles.emptyText}>Nenhum registro de humor este mês.</Text>
                </View>
            ) : (
                humorHistorico.map((h) => (
                <View key={h.id} style={styles.humorRow}>
                    <View style={[styles.humorIconBox, { backgroundColor: getIconColor(h.tipo) + '20' }]}>
                        <Icon name={getIconName(h.tipo)} size={20} color={getIconColor(h.tipo)} />
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={styles.humorType}>{h.tipo}</Text>
                        <Text style={styles.humorTime}>{h.dataFormatada} • {h.horaFormatada}</Text>
                    </View>
                    <View style={styles.levelIndicator}>
                         {[...Array(5)].map((_, i) => (
                             <View 
                                key={i} 
                                style={[
                                    styles.dot, 
                                    { backgroundColor: i < h.humorNivel ? getIconColor(h.tipo) : '#E0E0E0' }
                                ]} 
                             />
                         ))}
                    </View>
                </View>
                ))
            )}
          </ScrollView>
        )}
      </View>

      {/* === MODAL: NOVA NOTA === */}
      <Modal visible={modalVisible} animationType="slide" transparent>
         <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Nova Anotação</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Icon name="x" size={24} color="#888" />
                    </TouchableOpacity>
                </View>

                <TextInput 
                    placeholder="Título" 
                    style={styles.inputTitle} 
                    value={titulo}
                    onChangeText={setTitulo}
                />
                
                <TextInput 
                    placeholder="Escreva aqui..." 
                    style={styles.inputBody} 
                    multiline 
                    textAlignVertical="top"
                    value={texto}
                    onChangeText={setTexto}
                />

                <TouchableOpacity 
                    style={styles.saveButton} 
                    onPress={salvarNota}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Salvar no Diário</Text>}
                </TouchableOpacity>
            </View>
         </KeyboardAvoidingView>
      </Modal>

      {/* === MODAL: SELECIONAR HUMOR === */}
      <Modal visible={humorModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={[styles.modalTitle, {textAlign: 'center', marginBottom: 20}]}>O que você está sentindo?</Text>
                
                <View style={styles.gridHumor}>
                    {opcoesHumor.map((opcao) => (
                        <TouchableOpacity 
                            key={opcao.tipo} 
                            style={[
                                styles.gridItem, 
                                humorSelecionado?.tipo === opcao.tipo && { borderColor: opcao.color, backgroundColor: opcao.color + '10' }
                            ]}
                            onPress={() => setHumorSelecionado(opcao)}
                        >
                            <Icon name={opcao.icon} size={32} color={opcao.color} />
                            <Text style={[styles.gridLabel, {color: opcao.color}]}>{opcao.tipo}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.modalActions}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => setHumorModal(false)}>
                        <Text style={styles.cancelBtnText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.confirmBtn, !humorSelecionado && {opacity: 0.5}]} 
                        onPress={salvarHumor}
                        disabled={!humorSelecionado || loading}
                    >
                         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmBtnText}>Confirmar</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },
  
  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: '#fff',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    marginTop: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2D1E72',
  },
  headerBtn: { 
    width: 40,
    marginTop: 6, // Ajuste fino da seta
  },
  
  // Tabs
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#F0F0F5',
    borderRadius: 12,
    padding: 4,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    gap: 8,
  },
  tabItemActive: {
    backgroundColor: '#2D1E72',
  },
  tabText: {
    fontWeight: '600',
    color: '#2D1E72',
  },
  tabTextActive: {
    color: '#fff',
  },

  // Content
  content: {
    flex: 1,
    padding: 20,
  },

  // FAB (Botão de Adicionar Nota)
  fab: {
    backgroundColor: '#2D1E72',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#2D1E72",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },

  // Note Card
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  noteDate: {
    fontSize: 12,
    color: '#999',
  },
  noteBody: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  noteFooter: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 8,
    alignItems: 'flex-end'
  },
  deleteBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4
  },
  deleteText: {
      color: '#FF6B6B',
      fontSize: 12,
      fontWeight: '600'
  },

  // Humor Styles
  ctaCard: {
    backgroundColor: '#2D1E72',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaTextContainer: { flex: 1, paddingRight: 10 },
  ctaTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  ctaSubtitle: { color: '#D1C4E9', fontSize: 12, marginTop: 4 },
  ctaButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  ctaButtonText: { color: '#2D1E72', fontWeight: 'bold' },

  sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 15
  },
  humorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 12,
      borderRadius: 12,
      marginBottom: 10,
  },
  humorIconBox: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
  },
  humorType: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  humorTime: { fontSize: 12, color: '#999' },
  levelIndicator: { flexDirection: 'row', gap: 3 },
  dot: { width: 6, height: 6, borderRadius: 3 },

  // Empty State
  emptyState: { alignItems: 'center', marginTop: 40, opacity: 0.5 },
  emptyText: { marginTop: 10, fontSize: 16 },

  // Modals
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end' 
  },
  modalContent: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      minHeight: 400,
  },
  modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  inputTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      borderBottomWidth: 1,
      borderBottomColor: '#EEE',
      paddingVertical: 10,
      marginBottom: 15,
  },
  inputBody: {
      flex: 1,
      textAlignVertical: 'top',
      fontSize: 16,
      color: '#333',
      minHeight: 150,
  },
  saveButton: {
      backgroundColor: '#2D1E72',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // Grid de Humor no Modal
  gridHumor: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 12,
  },
  gridItem: {
      width: '30%',
      backgroundColor: '#F9F9F9',
      alignItems: 'center',
      padding: 15,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: 'transparent',
      marginBottom: 10
  },
  gridLabel: { marginTop: 8, fontSize: 12, fontWeight: '600' },
  modalActions: { flexDirection: 'row', marginTop: 20, gap: 15 },
  cancelBtn: { flex: 1, padding: 15, alignItems: 'center' },
  confirmBtn: { flex: 1, backgroundColor: '#2D1E72', padding: 15, borderRadius: 12, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontWeight: 'bold' },
  cancelBtnText: { color: '#666', fontWeight: 'bold' }
});