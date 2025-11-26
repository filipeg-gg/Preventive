import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
  Linking,
  StatusBar,
  Dimensions
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import * as RealChatStore from "../principal/chatStore"; 

const { height } = Dimensions.get("window");

export default function ChatBot() {
  const navigation = useNavigation();
  
  const [chatAtivoId, setChatAtivoId] = useState(null);
  const [listaConversas, setListaConversas] = useState([]);
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modoInteracao, setModoInteracao] = useState('main'); 

  const scrollViewRef = useRef();

  // Encontra o chat atual na lista para pegar os dados mais recentes (ultimoEvento)
  const chatAtivo = listaConversas.find(c => c.id === chatAtivoId);

  // 1. Carregar Lista
  useEffect(() => {
    const unsubscribe = RealChatStore.subscribeToChats((chats) => {
      setListaConversas(chats);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Carregar Mensagens e Resetar Menu
  useEffect(() => {
    let unsubscribe = () => {};
    if (chatAtivoId) {
      setMensagens([]); 
      setModoInteracao('main'); 

      unsubscribe = RealChatStore.subscribeToMessages(chatAtivoId, (msgs) => {
        setMensagens(msgs);
      });
    }
    return () => unsubscribe();
  }, [chatAtivoId]);

  // --- LÓGICA DE RESPOSTA ---

  const enviarOpcao = (textoUsuario) => {
    if (!chatAtivo) return;
    // 1. Envia a msg do usuário
    RealChatStore.sendMessage(chatAtivo.id, textoUsuario, "user");
    // 2. Robô pensa e responde
    processarRespostaRobo(textoUsuario);
  };

  const processarRespostaRobo = (textoUsuario) => {
    const texto = textoUsuario.toLowerCase();
    const chatId = chatAtivo.id;
    // PEGA OS DADOS DO EVENTO SALVOS NO CHAT
    const dadosEvento = chatAtivo.ultimoEvento || {}; 

    setTimeout(() => {
      if (texto.includes("engano")) {
        // Manda o aviso mas NÃO fecha o chat, mantém as opções
        RealChatStore.sendMessage(chatId, "", "hospital", "aviso_cancelamento");
        setModoInteracao('main'); 
      } 
      else if (texto.includes("ciente")) {
        RealChatStore.sendMessage(chatId, "Ótimo! Agradecemos a confirmação. Qualquer dúvida, estamos à disposição.", "hospital");
        setModoInteracao('main');
      }
      else if (texto.includes("duvidas") || texto.includes("dúvidas")) {
        RealChatStore.sendMessage(chatId, "Entendi. Selecione abaixo qual informação você deseja consultar:", "hospital");
        setModoInteracao('duvidas');
      }
      else {
        // Respostas Específicas lendo do 'dadosEvento'
        let resposta = "Desculpe, informação indisponível no momento.";

        if (texto.includes("horário")) {
           resposta = dadosEvento.hora 
             ? `O seu agendamento é às ${dadosEvento.hora}.` 
             : "O horário não consta no sistema.";
        }
        else if (texto.includes("dia")) {
           resposta = dadosEvento.data 
             ? `A data reservada é ${dadosEvento.data}.` 
             : "A data não consta no sistema.";
        }
        else if (texto.includes("local")) {
           resposta = dadosEvento.local 
             ? `Você deve comparecer em: ${dadosEvento.local}.` 
             : `O local é: ${chatAtivo.nome}`;
        }
        else if (texto.includes("roupa")) {
           resposta = "Recomendamos roupas leves e confortáveis (duas peças) para facilitar o exame.";
        }
        else if (texto.includes("documento")) {
           resposta = "É obrigatório levar documento original com foto (RG/CNH) e a carteirinha do convênio.";
        }

        RealChatStore.sendMessage(chatId, resposta, "hospital");
        setModoInteracao('duvidas'); // Mantém no menu de dúvidas
      }
    }, 800);
  };

  const ligarParaEstabelecimento = () => {
    Linking.openURL('tel:11999999999');
  };

  // --- RENDERIZADORES ---

  const renderMsgInstruction = (msg) => (
    <View key={msg.id} style={styles.msgRowLeft}>
      <Image source={{ uri: chatAtivo?.avatar }} style={styles.avatarMsg} />
      <View style={styles.bubbleInstruction}>
        <Text style={styles.instTitle}>{msg.titulo}</Text>
        <Text style={styles.instSubtitle}>{msg.subtitulo}</Text>
        <View style={styles.divider} />
        {msg.itens && msg.itens.map((item, i) => (
          <Text key={i} style={styles.bullet}>• {item}</Text>
        ))}
        <View style={styles.divider} />
        <Text style={styles.instFooter}>{msg.footer}</Text>
        
        <TouchableOpacity style={styles.btnDownload}>
           <Icon name="download" size={16} color="#3b82f6" />
           <Text style={styles.btnDownloadText}>Baixe aqui o seu protocolo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMsgCancelamento = (msg) => (
    <View key={msg.id} style={styles.msgRowLeft}>
      <Image source={{ uri: chatAtivo?.avatar }} style={styles.avatarMsg} />
      <View style={styles.bubbleSimple}>
        <Text style={styles.textHospital}>
          Sem problemas! Caso queira cancelar a consulta, entre em contato com o estabelecimento através do seguinte número:{"\n\n"}
          <Text style={styles.linkPhone} onPress={ligarParaEstabelecimento}>
            (11) 00000-0000
          </Text>
        </Text>
      </View>
    </View>
  );

  const renderMsgText = (msg) => {
    const isUser = msg.sender === 'user';
    return (
      <View key={msg.id} style={isUser ? styles.msgRowRight : styles.msgRowLeft}>
        {!isUser && <Image source={{ uri: chatAtivo?.avatar }} style={styles.avatarMsg} />}
        <View style={isUser ? styles.bubbleUser : styles.bubbleSimple}>
          <Text style={isUser ? styles.textUser : styles.textHospital}>{msg.text}</Text>
        </View>
      </View>
    );
  };

  // --- TELA: LISTA DE MENSAGENS ---
  if (!chatAtivoId) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
        
        <View style={styles.headerLista}>
          <Text style={styles.headerTitle}>Mensagens</Text>
        </View>

        {loading ? (
          <ActivityIndicator color="#3b82f6" style={{marginTop: 50}} />
        ) : (
          <ScrollView style={styles.lista}>
            {listaConversas.length === 0 && (
              <View style={styles.emptyState}>
                <Icon name="message-square" size={40} color="#ddd" />
                <Text style={styles.emptyText}>Nenhuma conversa encontrada.</Text>
                <Text style={styles.emptySubText}>Agende um exame para iniciar um chat.</Text>
              </View>
            )}
            {listaConversas.map(chat => (
              <TouchableOpacity key={chat.id} style={styles.chatRow} onPress={() => setChatAtivoId(chat.id)}>
                <Image source={{ uri: chat.avatar }} style={styles.chatAvatar} />
                <View style={styles.chatInfo}>
                  <View style={styles.chatHeaderRow}>
                    <Text style={styles.chatName} numberOfLines={1}>{chat.nome}</Text>
                    {chat.naoLido && <View style={styles.dot} />}
                  </View>
                  <Text style={styles.chatPreview} numberOfLines={1}>
                    {chat.lastMessage || "Toque para ver as informações"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Navbar Fixa na Lista */}
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Principal")}>
            <Icon name="home" size={25} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Exames")}>
            <Icon name="file-text" size={25} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Cuidados")}>
            <Icon name="heart" size={25} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("ChatBot")}>
            <Icon name="user" size={25} color="#3b82f6" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- TELA: CONVERSA ABERTA (SEM NAVBAR) ---
  return (
    <View style={styles.containerChat}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      
      {/* Header Integrado */}
      <View style={styles.headerChat}>
        <TouchableOpacity onPress={() => setChatAtivoId(null)} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color="#1B0C45" />
        </TouchableOpacity>
        <Image source={{ uri: chatAtivo?.avatar }} style={styles.headerAvatar} />
        <Text style={styles.headerName} numberOfLines={1}>{chatAtivo?.nome}</Text>
      </View>

      <ScrollView 
        style={styles.chatScroll} 
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      >
        <View style={{height: 10}} />
        {mensagens.map(msg => {
          if (msg.tipo === 'instrucao') return renderMsgInstruction(msg);
          if (msg.tipo === 'aviso_cancelamento') return renderMsgCancelamento(msg);
          return renderMsgText(msg);
        })}
      </ScrollView>

      {/* Footer de Opções (Sem input) */}
      <View style={styles.optionsContainer}>
        {/* MENU PRINCIPAL */}
        {modoInteracao === 'main' && (
          <View style={styles.chipsRow}>
            <TouchableOpacity style={styles.chip} onPress={() => enviarOpcao("Foi um engano")}>
              <Text style={styles.chipText}>Foi um engano</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chip} onPress={() => enviarOpcao("Tenho dúvidas")}>
              <Text style={styles.chipText}>Tenho dúvidas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chip} onPress={() => enviarOpcao("Estou ciente")}>
              <Text style={styles.chipText}>Estou ciente</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* MENU DÚVIDAS */}
        {modoInteracao === 'duvidas' && (
          <View style={styles.chipsWrap}>
            <Text style={styles.chipsLabel}>O que você gostaria de saber?</Text>
            <View style={styles.wrapContainer}>
                <TouchableOpacity style={styles.chipOutline} onPress={() => enviarOpcao("Qual o horário?")}>
                  <Text style={styles.chipTextOutline}>Horário</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chipOutline} onPress={() => enviarOpcao("Qual o dia?")}>
                  <Text style={styles.chipTextOutline}>Dia</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chipOutline} onPress={() => enviarOpcao("Onde é o local?")}>
                  <Text style={styles.chipTextOutline}>Local</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chipOutline} onPress={() => enviarOpcao("Quais roupas usar?")}>
                  <Text style={styles.chipTextOutline}>Roupas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chipOutline} onPress={() => enviarOpcao("Quais documentos?")}>
                  <Text style={styles.chipTextOutline}>Documentos</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.btnVoltarMenu} onPress={() => setModoInteracao('main')}>
                <Text style={styles.btnVoltarText}>Voltar às opções iniciais</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  containerChat: { flex: 1, backgroundColor: "#FAFAFA" },

  headerLista: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 15, backgroundColor: "#FAFAFA" },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "#1B0C45" },

  lista: { flex: 1 },
  emptyState: { alignItems: 'center', marginTop: 100, opacity: 0.6 },
  emptyText: { marginTop: 15, fontSize: 18, fontWeight: "600", color: "#333" },
  emptySubText: { marginTop: 5, fontSize: 14, color: "#999" },

  chatRow: { flexDirection: "row", paddingVertical: 16, paddingHorizontal: 24, alignItems: "center", backgroundColor: "#FAFAFA" },
  chatAvatar: { width: 56, height: 56, borderRadius: 28, marginRight: 16, backgroundColor: '#eee' },
  chatInfo: { flex: 1, justifyContent: 'center' },
  chatHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  chatName: { fontSize: 16, fontWeight: "700", color: "#333", flex: 1 },
  chatPreview: { fontSize: 14, color: "#888" },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#3b82f6" },

  navbar: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingVertical: 12, backgroundColor: "#fff", borderTopWidth: 1, borderColor: "#f0f0f0", paddingBottom: 30 },
  navItem: { alignItems: "center" },

  headerChat: { flexDirection: "row", alignItems: "center", paddingTop: 50, paddingBottom: 10, paddingHorizontal: 16, backgroundColor: "#FAFAFA" },
  backBtn: { padding: 8, marginRight: 4 },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  headerName: { fontSize: 18, fontWeight: "700", color: "#1B0C45", flex: 1 },

  chatScroll: { flex: 1, paddingHorizontal: 20 },
  
  msgRowLeft: { flexDirection: "row", marginBottom: 20, alignItems: "flex-end" },
  msgRowRight: { flexDirection: "row", marginBottom: 20, justifyContent: "flex-end" },
  avatarMsg: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },

  bubbleSimple: { backgroundColor: "#fff", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 20, borderBottomLeftRadius: 4, maxWidth: "80%", borderWidth: 1, borderColor: "#F0F0F0" },
  textHospital: { fontSize: 15, color: "#333", lineHeight: 22 },
  linkPhone: { color: "#3b82f6", fontWeight: "bold" },

  bubbleUser: { backgroundColor: "#3b82f6", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 20, borderBottomRightRadius: 4, maxWidth: "80%" },
  textUser: { fontSize: 15, color: "#fff", lineHeight: 22 },

  bubbleInstruction: { backgroundColor: "#fff", borderRadius: 20, borderBottomLeftRadius: 4, maxWidth: "85%", padding: 16, borderWidth: 1, borderColor: "#F0F0F0" },
  instTitle: { fontSize: 16, fontWeight: "bold", color: "#1B0C45", marginBottom: 4 },
  instSubtitle: { fontSize: 14, color: "#666", marginBottom: 10 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 8 },
  bullet: { fontSize: 14, color: "#444", marginBottom: 4, lineHeight: 20 },
  instFooter: { fontSize: 14, fontWeight: "600", color: "#1B0C45", marginTop: 8 },
  btnDownload: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  btnDownloadText: { color: "#3b82f6", fontWeight: "600", marginLeft: 6, fontSize: 14 },

  optionsContainer: { padding: 20, paddingBottom: 40, backgroundColor: "#FAFAFA" },
  chipsRow: { flexDirection: "row", justifyContent: "center", gap: 10 },
  chip: { backgroundColor: "#fff", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 25, borderWidth: 1, borderColor: "#E0E0E0", elevation: 1 },
  chipText: { color: "#555", fontWeight: "600", fontSize: 13 },

  chipsWrap: { alignItems: 'center' },
  chipsLabel: { fontSize: 14, color: "#1B0C45", fontWeight: "600", marginBottom: 12 },
  wrapContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  chipOutline: { borderWidth: 1, borderColor: "#3b82f6", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: "#fff" },
  chipTextOutline: { color: "#3b82f6", fontWeight: "600", fontSize: 13 },
  btnVoltarMenu: { marginTop: 15 },
  btnVoltarText: { color: "#999", fontSize: 12, textDecorationLine: "underline" },
});
