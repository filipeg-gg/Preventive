import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  Animated,
  Image,
  TextInput,
  ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { getCurrentUser } from "../../../UserStore";
import { getEvents } from "./EventStore";

export default function Principal() {
  const [nomeUsuario, setNomeUsuario] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.usuario) {
      setNomeUsuario(user.usuario);
    }
  }, []);

  const navigation = useNavigation();
  const hoje = new Date();

  // ======== Eventos ========
  const [eventos, setEventos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      setLoadingEventos(true);
      try {
        const data = await getEvents();
        
        const formatados = data.map(ev => {
          // Converte "dd/mm/aaaa" para Objeto Date para ordenação e filtro
          const [dia, mes, ano] = ev.data.split("/").map(Number);
          const dataObj = new Date(ano, mes - 1, dia);
          
          return {
            ...ev,
            date: dataObj, // Objeto Date (usado para lógica)
            dataString: ev.data // String original (usada para exibir)
          };
        });

        // Ordena por data (mais recente primeiro ou mais próximo)
        formatados.sort((a, b) => a.date - b.date);

        setEventos(formatados);
      } catch (error) {
        console.log("Erro ao carregar eventos:", error);
      } finally {
        setLoadingEventos(false);
      }
    };

    const unsubscribe = navigation.addListener("focus", carregar);
    return unsubscribe;
  }, [navigation]);

  // ======== Responsividade ========
  const { width, height } = Dimensions.get("window");
  const HEADER_HEIGHT = Math.max(120, height * 0.18);
  const H_PADDING = 16;
  const GRID_GAP = 6;

  const DAY_SIZE = useMemo(() => {
    const usable = width - H_PADDING * 2 - GRID_GAP * 12; 
    const size = Math.floor(usable / 7);
    return Math.max(36, Math.min(48, size)); 
  }, [width]);

  // ======== Estados ========
  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());
  const [modalVisible, setModalVisible] = useState(false);
  const [modalInfo, setModalInfo] = useState({ type: null, day: null, event: null });

  const nomeMes = new Date(anoAtual, mesAtual, 1).toLocaleDateString("pt-BR", {
    month: "long",
  });

  // hospitais
  const [pesquisa, setPesquisa] = useState("");
  const postos = [
    { id: 1, nome: "UBS Central", endereco: "Av. Principal, 1200", imagem: "https://i.imgur.com/9Q9qFzq.png", tags: ["Público", "7h às 19h"] },
    { id: 2, nome: "Hospital São Lucas", endereco: "Rua das Flores, 300", imagem: "https://i.imgur.com/0DElr0H.png", tags: ["Particular", "24h"] },
    { id: 3, nome: "Posto Jardim Azul", endereco: "Rua Azul, 85", imagem: "https://i.imgur.com/fLkYFZ8.png", tags: ["Público", "Vacinação"] }
  ];

  const postosFiltrados = postos.filter(posto =>
    posto.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const [abaAtiva, setAbaAtiva] = useState("hoje");

  const eventosFiltrados = useMemo(() => {
    if (abaAtiva === "hoje") {
      return eventos.filter(ev => {
        return ev.date.getDate() === hoje.getDate() &&
               ev.date.getMonth() === hoje.getMonth() &&
               ev.date.getFullYear() === hoje.getFullYear();
      });
    }
    if (abaAtiva === "proximos") {
      const hojeZero = new Date();
      hojeZero.setHours(0,0,0,0);
      return eventos.filter(ev => ev.date > hojeZero);
    }
    return eventos;
  }, [abaAtiva, eventos]);

  // ======== Navegação entre meses ========
  const handlePrevMonth = () => {
    if (mesAtual === 0) {
      setMesAtual(11);
      setAnoAtual((y) => y - 1);
    } else {
      setMesAtual((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (mesAtual === 11) {
      setMesAtual(0);
      setAnoAtual((y) => y + 1);
    } else {
      setMesAtual((m) => m + 1);
    }
  };

  // ======== Calendário ========
  const generateCalendarMatrix = (month, year) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const matrix = [];

    const currentDay = new Date(firstDay);
    currentDay.setDate(
      currentDay.getDate() - (currentDay.getDay() === 0 ? 6 : currentDay.getDay() - 1)
    );

    while (currentDay <= lastDay || currentDay.getDay() !== 1) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push({
          date: new Date(currentDay),
          isCurrentMonth: currentDay.getMonth() === month,
        });
        currentDay.setDate(currentDay.getDate() + 1);
      }
      matrix.push(week);
    }
    return matrix;
  };

  const getDayEvents = (day) =>
    eventos.filter(
      (ev) =>
        ev.date.getDate() === day &&
        ev.date.getMonth() === mesAtual &&
        ev.date.getFullYear() === anoAtual
    );

  const isPastEventDay = (day) => {
    const dayEvents = getDayEvents(day);
    return dayEvents.some((ev) => ev.date < hoje);
  };

  const getDayStyle = (day) => {
    if (isPastEventDay(day)) return { backgroundColor: "red", color: "#fff" };
    const dayEvents = getDayEvents(day);
    if (dayEvents.length > 0) return { backgroundColor: dayEvents[0].color || "#3b82f6", color: "#fff" };
    if (day === hoje.getDate() && mesAtual === hoje.getMonth() && anoAtual === hoje.getFullYear())
      return { backgroundColor: "#111827", color: "#fff" };
    return { backgroundColor: "#e5e7eb", color: "#000" };
  };

  const openModal = (payload) => {
    setModalInfo(payload);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const formatDate = (date) =>
    date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

  const formatTimeMaybe = (event) => {
    if (event.hora) return ` às ${event.hora}`;
    return "";
  };

  const handleDayPress = (day) => {
    const dayEvents = getDayEvents(day);

    if (isPastEventDay(day)) {
      openModal({ type: "missed", day, event: dayEvents[0] || null });
      return;
    }

    if (dayEvents.length > 0) {
      openModal({ type: "event", day, event: dayEvents[0] });
      return;
    }

    openModal({ type: "add", day, event: null });
  };

  const renderModalContent = () => {
    const { type, day, event } = modalInfo;

    if (type === "add") {
      const data = new Date(anoAtual, mesAtual, day);
      return (
        <>
          <Text style={styles.modalTitle}>Adicionar evento?</Text>
          <Text style={styles.modalText}>Deseja adicionar um novo evento em {formatDate(data)}?</Text>
          <View style={styles.modalRow}>
            <TouchableOpacity style={[styles.modalBtn, styles.btnGhost]} onPress={closeModal}>
              <Text style={styles.modalBtnGhostText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, styles.btnPrimary]}
              onPress={() => {
                closeModal();
                navigation.navigate("NovoEve");
              }}
            >
              <Text style={styles.modalBtnText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    }

    if (type === "event" && event) {
      return (
        <>
          <Text style={styles.modalTitle}>{event.titulo}</Text>
          <Text style={styles.modalText}>
            {event.dataString}
            {formatTimeMaybe(event)}
            {"\n"}
            <Text style={{ fontWeight: "600" }}>Local:</Text> {event.local || "—"}
            {"\n"}
            <Text style={{ fontWeight: "600" }}>Obs:</Text> {event.obs || "—"}
          </Text>
          <View style={styles.modalRow}>
            <TouchableOpacity style={[styles.modalBtn, styles.btnGhost]} onPress={closeModal}>
              <Text style={styles.modalBtnGhostText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    }

    if (type === "missed") {
      const ev = event;
      return (
        <>
          <Text style={styles.modalTitle}>Evento passado</Text>
          <Text style={styles.modalText}>
            {ev?.titulo ? `${ev.titulo}\n` : ""}
            {formatDate(new Date(anoAtual, mesAtual, modalInfo.day))}
          </Text>
          <View style={styles.modalRow}>
            <TouchableOpacity style={[styles.modalBtn, styles.btnGhost]} onPress={closeModal}>
              <Text style={styles.modalBtnGhostText}>Ok</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require("../../../assets/Home.png")} style={styles.headerBg} resizeMode="cover">
        <SafeAreaView>
          <View style={[styles.header, { height: HEADER_HEIGHT, paddingHorizontal: H_PADDING }]}>
            <View style={styles.headerContent}>
              <TouchableOpacity style={styles.avatar} activeOpacity={0.8}>
                <Icon name="user" size={24} color="#6b7280" />
              </TouchableOpacity>

              <Text style={styles.headerText}>Olá, {nomeUsuario} </Text>

              <TouchableOpacity style={styles.iconButton} activeOpacity={0.8} onPress={() => navigation.navigate("Perfil")}>
                <Icon name="settings" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: H_PADDING }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity style={styles.roundBtn} onPress={handlePrevMonth} activeOpacity={0.8}>
                <Icon name="chevron-left" size={20} color="#374151" />
              </TouchableOpacity>
              <Text style={styles.sectionTitle}>
                {nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)} {anoAtual}
              </Text>
              <TouchableOpacity style={styles.roundBtn} onPress={handleNextMonth} activeOpacity={0.8}>
                <Icon name="chevron-right" size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            <View style={styles.weekHeader}>
              {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
                <Text key={d} style={[styles.weekDay, { width: DAY_SIZE }]}>{d}</Text>
              ))}
            </View>

            <View style={styles.calendar}>
              {generateCalendarMatrix(mesAtual, anoAtual).map((week, wi) => (
                <View key={wi} style={styles.weekRow}>
                  {week.map((dayObj, di) => {
                    const day = dayObj.date.getDate();
                    const styleDyn = getDayStyle(day);
                    const disabled = !dayObj.isCurrentMonth;

                    return (
                      <TouchableOpacity
                        key={di}
                        style={[
                          styles.day,
                          {
                            width: DAY_SIZE,
                            height: DAY_SIZE,
                            marginHorizontal: GRID_GAP / 2,
                            marginVertical: GRID_GAP / 2,
                            backgroundColor: dayObj.isCurrentMonth ? styleDyn.backgroundColor : "#f3f4f6",
                          },
                        ]}
                        disabled={disabled}
                        onPress={() => handleDayPress(day)}
                        activeOpacity={0.8}
                      >
                        <Text style={{ color: dayObj.isCurrentMonth ? styleDyn.color : "#9ca3af", fontWeight: "600" }}>
                          {day}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>

            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#f472b6" }]} />
                <Text style={styles.legendText}>Exame</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#60a5fa" }]} />
                <Text style={styles.legendText}>Resultado</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#fb923c" }]} />
                <Text style={styles.legendText}>Consulta</Text>
              </View>
            </View>
          </View>

        <View style={styles.sessaoEventos}>
          <Text style={styles.subtitulo}>Próximos eventos</Text>

            <View style={styles.eventos}>
              <View style={styles.abas}>
                <TouchableOpacity style={[styles.aba, abaAtiva === "todos" && styles.abaAtiva]} onPress={() => setAbaAtiva("todos")}>
                  <Text style={styles.textoAba}>Todos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.aba, abaAtiva === "hoje" && styles.abaAtiva]} onPress={() => setAbaAtiva("hoje")}>
                  <Text style={styles.textoAba}>Hoje</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.aba, abaAtiva === "proximos" && styles.abaAtiva]} onPress={() => setAbaAtiva("proximos")}>
                  <Text style={styles.textoAba}>Próximos</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.caixaEventos}>
                {loadingEventos ? (
                  <ActivityIndicator size="small" color="#1B0C45" />
                ) : (
                  <>
                    {eventosFiltrados.length === 0 ? (
                      <Text style={styles.textoEvento}>Nenhum evento encontrado</Text>
                    ) : (
                      eventosFiltrados.map((evento) => (
                        <Text key={evento.id} style={styles.textoEvento}>
                          {evento.titulo} - {evento.dataString} {evento.hora ? `às ${evento.hora}` : ""}
                        </Text>
                      ))
                    )}
                  </>
                )}
              </View>
            </View>
        </View>

        <TouchableOpacity style={styles.botaoConsulta} >
          <Image source={require('../../../assets/consulta.png')} style={styles.imagemBotaoConsulta} resizeMode="contain" />
        </TouchableOpacity>

        <View style={styles.campoPesquisa}>
          <Icon name="search" size={20} color="#666" style={styles.iconePesquisa} />
          <TextInput
            style={styles.inputPesquisa}
            placeholder="Buscar posto ou hospital..."
            value={pesquisa}
            onChangeText={setPesquisa}
          />
        </View>

        <View style={styles.listaPostos}>
          {postosFiltrados.map(posto => (
            <TouchableOpacity key={posto.id} style={styles.cardPosto}>
              <Image source={{ uri: posto.imagem }} style={styles.imagemHospital} />
              <View style={styles.infoHospital}>
                <Text style={styles.nomePosto}>{posto.nome}</Text>
                <Text style={styles.enderecoPosto}>{posto.endereco}</Text>
                <View style={styles.tags}>
                  {posto.tags.map((tag, index) => (
                    <Text key={index} style={styles.tag}>{tag}</Text>
                  ))}
                </View>
              </View>
              <Icon name="chevron-right" size={24} color="#6C63FF" />
            </TouchableOpacity>
          ))}
        </View>
        </ScrollView>
      </ImageBackground>

      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Principal")}>
          <Icon name="home" size={25} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Exames")}>
          <Icon name="file-text" size={25} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Cuidados")}>
          <Icon name="heart" size={25} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("ChatBot")}>
          <Icon name="user" size={25} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <Modal transparent animationType="fade" visible={modalVisible} onRequestClose={closeModal}>
        <View style={styles.overlay}>
          <View style={styles.modalBox}>{renderModalContent()}</View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  headerBg: { flex: 1, width: "100%" },
  header: { justifyContent: "center" },
  headerContent: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#e5e7eb", justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 3, elevation: 2 },
  iconButton: { borderRadius: 50, padding: 8, justifyContent: "center", alignItems: "center", backgroundColor: "#e5e7eb" },
  headerText: { fontSize: 18, fontWeight: "700", color: "#111827" },
  content: { flex: 1 },
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8, color: "#111827" },
  calendar: { flexDirection: "column" },
  weekHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  weekDay: { textAlign: "center", fontWeight: "700", color: "#374151" },
  weekRow: { flexDirection: "row", justifyContent: "space-between" },
  roundBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "#f3f4f6" },
  day: { borderRadius: 999, justifyContent: "center", alignItems: "center" },
  calendarHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  legend: { flexDirection: "row", marginTop: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", marginRight: 12 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { fontSize: 12, color: "#374151" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center", padding: 24 },
  modalBox: { backgroundColor: "#fff", width: "100%", borderRadius: 16, padding: 20, elevation: 6, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  modalTitle: { fontSize: 18, fontWeight: "800", textAlign: "center", marginBottom: 8, color: "#111827" },
  modalText: { fontSize: 15, color: "#374151", textAlign: "center", marginBottom: 16, lineHeight: 22 },
  modalRow: { flexDirection: "row", gap: 10 },
  modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 999, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  btnGhost: { backgroundColor: "#e5e7eb" },
  btnPrimary: { backgroundColor: "#3b82f6" },
  modalBtnText: { color: "#fff", fontWeight: "800" },
  modalBtnGhostText: { color: "#111827", fontWeight: "800" },
  sessaoEventos: { marginTop: 25 },
  subtitulo: { color: "#1B0C45", fontSize: 18, fontWeight: "600", marginBottom: 15, marginLeft: 5 },
  eventos: { borderRadius: 15, backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  abas: { flexDirection: "row", justifyContent: "space-between", marginVertical: 15, marginHorizontal: 20 },
  aba: { paddingVertical: 5, paddingHorizontal: 20, borderRadius: 20, backgroundColor: "#fff", borderColor: "#ccc", borderWidth: 1 },
  abaAtiva: { backgroundColor: "#CADBFE" },
  textoAba: { color: "#1B0C45", fontWeight: "bold", fontSize: 14 },
  caixaEventos: { backgroundColor: "#fff", padding: 15, borderRadius: 10, minHeight: 60, marginHorizontal: 20, marginBottom: 20, borderColor: "#ccc", borderWidth: 1 },
  textoEvento: { color: "#1B0C45", marginBottom: 8 },
  botaoConsulta: { alignItems: "center", justifyContent: "center", marginTop: 20, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  imagemBotaoConsulta: { height: 120, borderRadius: 16 },
  campoPesquisa: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: "#ddd", marginTop: 20 },
  iconePesquisa: { marginRight: 8 },
  inputPesquisa: { flex: 1, fontSize: 15 },
  listaPostos: { marginTop: 12 },
  cardPosto: { flexDirection: "row", alignItems: "center", backgroundColor: "#F3F6FF", padding: 12, borderRadius: 14, marginBottom: 12 },
  imagemHospital: { width: 60, height: 60, borderRadius: 10, marginRight: 12 },
  infoHospital: { flex: 1 },
  nomePosto: { fontSize: 16, fontWeight: "bold", color: "#333" },
  enderecoPosto: { fontSize: 13, color: "#666", marginTop: 2 },
  tags: { flexDirection: "row", marginTop: 6 },
  tag: { backgroundColor: "#6C63FF", color: "#fff", fontSize: 11, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginRight: 6 },
  navbar: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingVertical: 12, backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 5, borderRadius: 20, marginHorizontal: 50, bottom: 40 },
  navItem: { alignItems: "center" },
});