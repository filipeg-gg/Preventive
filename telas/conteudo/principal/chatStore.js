import { db, auth } from "../../../firebaseConfig";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc,
  serverTimestamp,
  getDoc
} from "firebase/firestore";

// Função para gerar ID único por estabelecimento (Ex: "Hospital Family" -> "hospital_family")
const gerarIdPorNome = (nome) => {
  if (!nome) return "geral";
  return nome
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "_");
};

const getChatsRef = () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");
  return collection(db, "users", user.uid, "chats");
};

// 1. Cria ou Atualiza o Chat
export const createOrGetChat = async (estabelecimentoId, nome, avatar, dadosEvento = null) => {
  const user = auth.currentUser;
  if (!user) return;

  const chatDocRef = doc(db, "users", user.uid, "chats", estabelecimentoId);
  
  // Prepara os dados para salvar
  const dadosChat = {
    nome: nome,
    avatar: avatar || "https://cdn-icons-png.flaticon.com/512/3063/3063176.png",
    updatedAt: serverTimestamp(),
    naoLido: false
  };

  // AQUI ESTÁ O SEGREDO: Salvamos os dados do evento dentro do chat para o robô ler
  if (dadosEvento) {
    dadosChat.ultimoEvento = {
      titulo: dadosEvento.titulo || "",
      data: dadosEvento.data || "",     // Garante que a data venha
      hora: dadosEvento.hora || "",     // Garante que a hora venha
      local: dadosEvento.local || "",
      obs: dadosEvento.obs || "",
      tipo: dadosEvento.tipo || ""
    };
  }

  // merge: true garante que não apagamos mensagens antigas, apenas atualizamos o evento
  await setDoc(chatDocRef, dadosChat, { merge: true });
  return estabelecimentoId;
};

// 2. Ouvinte de Chats
export const subscribeToChats = (callback) => {
  const user = auth.currentUser;
  if (!user) return () => {};

  const q = query(getChatsRef(), orderBy("updatedAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(chats);
  });
};

// 3. Ouvinte de Mensagens
export const subscribeToMessages = (chatId, callback) => {
  const user = auth.currentUser;
  if (!user) return () => {};

  const msgsRef = collection(db, "users", user.uid, "chats", chatId, "messages");
  const q = query(msgsRef, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
};

// 4. Enviar Mensagem
export const sendMessage = async (chatId, text, sender = "user", tipo = "texto", dadosExtras = null) => {
  const user = auth.currentUser;
  if (!user) return;

  const msgsRef = collection(db, "users", user.uid, "chats", chatId, "messages");
  const chatRef = doc(db, "users", user.uid, "chats", chatId);

  const payload = {
    text,
    sender,
    tipo,
    createdAt: serverTimestamp(),
    ...dadosExtras
  };

  await addDoc(msgsRef, payload);

  await updateDoc(chatRef, {
    lastMessage: text,
    updatedAt: serverTimestamp(),
    naoLido: sender !== "user"
  });
};

// 5. Notificação Automática (Chamada pelo NovoEve.js)
export const enviarNotificacaoAgendamento = async (evento) => {
  if (!evento.local) return;

  const chatId = gerarIdPorNome(evento.local);
  
  // Salva o evento no contexto do chat AGORA
  await createOrGetChat(chatId, evento.local, null, evento);

  const user = auth.currentUser;
  const msgsRef = collection(db, "users", user.uid, "chats", chatId, "messages");
  const chatRef = doc(db, "users", user.uid, "chats", chatId);

  const mensagemEstruturada = {
    sender: "hospital",
    tipo: "instrucao", 
    titulo: `Olá! Agendamento de ${evento.tipo} confirmado.`,
    subtitulo: `${evento.titulo} - ${evento.data} às ${evento.hora}`,
    itens: [
      "Chegue com 15 min de antecedência",
      "Documento com foto é obrigatório",
      "Use roupas confortáveis"
    ],
    footer: "Por favor, confirme sua presença abaixo:",
    createdAt: serverTimestamp()
  };

  await addDoc(msgsRef, mensagemEstruturada);

  await updateDoc(chatRef, {
    lastMessage: `Agendamento: ${evento.titulo}`,
    updatedAt: serverTimestamp(),
    naoLido: true
  });
};
