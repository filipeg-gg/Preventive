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
  Platform,
  SafeAreaView,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { Linking } from "react-native";
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
    useEffect(() => {
    // Função que busca os eventos salvos em memória
    const carregar = () => {
      const data = getEvents();

      // converte a data de texto (dd/mm/aaaa) para objeto Date
      const formatados = data.map(ev => ({
        ...ev,
        date: new Date(ev.data.split("/").reverse().join("-")),
      }));

      setEventos(formatados);
    };

    // Carrega ao abrir e toda vez que voltar pra essa tela
    const unsubscribe = navigation.addListener("focus", carregar);
    return unsubscribe;
  }, [navigation]);

  // ======== Drawer lateral ========
  const [drawerVisible, setDrawerVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(Dimensions.get("window").width)).current;

  useEffect(() => {
    if (drawerVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get("window").width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [drawerVisible]);



  // ======== Responsividade ========
  const { width, height } = Dimensions.get("window");
  const HEADER_HEIGHT = Math.max(120, height * 0.18);
  const H_PADDING = 16;
  const GRID_GAP = 6;

  // calcula o tamanho do dia do calendário dinamicamente
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

  // ======== Cabeçalho (mês) ========
  const nomeMes = new Date(anoAtual, mesAtual, 1).toLocaleDateString("pt-BR", {
    month: "long",
  });



  const proximosEventos = eventos.filter((ev) => ev.date >= hoje);

  // ======== Artigos ========
  const artigos = [
    {
      id: 1,
      title: "Conheça os exames preventivos",
      desc: "Saiba quais são importantes para sua saúde",
      color: "#3b82f6",
      link: "https://www.exmed.com.br/blog/saude/exame-preventivo-de-rotina/",
    },
    {
      id: 2,
      title: "(Ainda não disponível!)",
      desc: "conheça a Nutr.ia",
      color: "#10b981",
      link: "https://www.instagram.com/nutr.ia__/",
    },
    {
      id: 3,
      title: "(Ainda não disponível!)",
      desc: "Conheça a Etec de Taboão da Serra",
      color: "#f59e0b",
      link: "https://www.instagram.com/etecdetaboaodaserra/",
    },
    {
      id: 4,
      title: "(Ainda não disponível!)",
      desc: "secreto",
      color: "#ef4444",
      link: "https://www.instagram.com/filipeg_gg/",
    },
  ];

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
    // inicia na segunda-feira
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
    if (dayEvents.length > 0) return { backgroundColor: dayEvents[0].color, color: "#fff" };
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

  const formatTimeMaybe = (date) => {
    const hh = date.getHours();
    const mm = date.getMinutes();
    if (hh === 0 && mm === 0) return "";
    return ` às ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
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

  const handleProximoEventoPress = (ev) => {
    openModal({ type: "event", day: ev.date.getDate(), event: ev });
  };

  const renderModalContent = () => {
    const { type, day, event } = modalInfo;

    if (type === "add") {
      const data = new Date(hoje.getFullYear(), hoje.getMonth(), day);
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
          <Text style={styles.modalTitle}>{event.title}</Text>
          <Text style={styles.modalText}>
            {formatDate(event.date)}
            {formatTimeMaybe(event.date)}
            {"\n"}
            <Text style={{ fontWeight: "600" }}>Detalhes:</Text> {event.local || "—"}
          </Text>
          <View style={styles.modalRow}>
            <TouchableOpacity style={[styles.modalBtn, styles.btnGhost]} onPress={closeModal}>
              <Text style={styles.modalBtnGhostText}>Fechar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, styles.btnPrimary]}
              onPress={() => {
                closeModal();
                navigation.navigate(event.screen);
              }}
            >
              <Text style={styles.modalBtnText}>Ver detalhes</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    }

    if (type === "missed") {
      const ev = event;
      return (
        <>
          <Text style={styles.modalTitle}>Evento perdido</Text>
          <Text style={styles.modalText}>
            {ev?.title ? `${ev.title}\n` : ""}
            {formatDate(new Date(hoje.getFullYear(), hoje.getMonth(), modalInfo.day))}
            {ev ? formatTimeMaybe(ev.date) : ""}
            {ev?.local ? `\n Detalhes: ${ev.local}` : ""}
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
              <TouchableOpacity
                style={styles.avatar}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("Perfil")}
              >
                <Icon name="user" size={24} color="#6b7280" />
              </TouchableOpacity>

              <Text style={styles.headerText}>Olá, {nomeUsuario} </Text>

              <TouchableOpacity
                style={styles.iconButton}
                activeOpacity={0.8}
                onPress={() => setDrawerVisible(true)} 
              >
                <Icon name="more-vertical" size={24} color="#6b7280" />
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

          <View style={styles.cardArt}>
            <Text style={styles.sectionTitle}>Próximos eventos</Text>
            {proximosEventos.length === 0 && <Text style={{ color: "#6b7280" }}>Nenhum evento futuro</Text>}
            {proximosEventos.map((event, index) => (
              <TouchableOpacity
                key={event.id}
                onPress={() => handleProximoEventoPress(event)}
                style={[
                  styles.eventItem,
                  index === proximosEventos.length - 1 && { borderBottomWidth: 0 },
                ]}
                activeOpacity={0.8}
              >
                <View style={styles.eventLeft}>
                  <View style={[styles.eventDot, { backgroundColor: event.color }]} />
                  <Text style={{ fontWeight: "600", color: "#111827" }}>{event.title}</Text>
                </View>
                <Text style={styles.eventDate}>{event.date.toLocaleDateString("pt-BR")}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Em alta</Text>

            <TouchableOpacity
              style={[styles.articleBig, { backgroundColor: artigos[0].color }]}
              onPress={() => Linking.openURL(artigos[0].link)}
              activeOpacity={0.85}
            >
              <Text style={styles.articleTitle}>{artigos[0].title}</Text>
              <Text style={styles.articleDesc}>{artigos[0].desc}</Text>
              <Text style={styles.link}>Ver mais</Text>
            </TouchableOpacity>

            {artigos.slice(1).map((article) => (
              <TouchableOpacity
                key={article.id}
                style={[styles.articleSmall, { borderLeftColor: article.color }]}
                onPress={() => Linking.openURL(article.link)}
                activeOpacity={0.85}
              >
                <View>
                  <Text style={styles.articleSmallTitle}>{article.title}</Text>
                  <Text style={styles.articleSmallDesc}>{article.desc}</Text>
                </View>
                <Text style={{ color: article.color, fontWeight: "700" }}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </ImageBackground>

      {/* Navbar */}
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
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Perfil")}>
            <Icon name="user" size={25} color="#6b7280" />
          </TouchableOpacity> 
      </View>

      <Modal transparent animationType="fade" visible={modalVisible} onRequestClose={closeModal}>
        <View style={styles.overlay}>
          <View style={styles.modalBox}>{renderModalContent()}</View>
        </View>
      </Modal>
      
      {/* Drawer lateral */}
      <Modal
        visible={drawerVisible}
        transparent
        animationType="none"
        onRequestClose={() => setDrawerVisible(false)}
      >
        <TouchableOpacity
          style={styles.drawerOverlay}
          activeOpacity={1}
          onPressOut={() => setDrawerVisible(false)}
        >
          <Animated.View
            style={[
              styles.drawerContent,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate("Principal")}>
              <Text style={styles.drawerText}>Principal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate("Exames")}>
              <Text style={styles.drawerText}>Exames</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate("Cuidados")}>
              <Text style={styles.drawerText}>Cuidados</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate("Perfil")}>
              <Text style={styles.drawerText}>Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawerItem} onPress={() => alert("Inicial")}>
              <Text style={styles.drawerText}>Sair</Text>
            </TouchableOpacity>
          </Animated.View>

        </TouchableOpacity>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  headerBg: { flex: 1, width: "100%" },
  header: {
    justifyContent: "center",
  },
  headerContent: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  drawerContent: {
      width: "70%",
      height: "100%",
      backgroundColor: "#fff",
      paddingVertical: 30,
      paddingHorizontal: 20,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      elevation: 10,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: { width: -2, height: 2 },
  },
  drawerItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  drawerText: {
    fontSize: 14,
    color: "#333",
  },
  headerText: { fontSize: 18, fontWeight: "700", color: "#111827" },
  content: { flex: 1 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardArt: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8, color: "#111827" },
  calendar: { flexDirection: "column" },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  weekDay: {
    textAlign: "center",
    fontWeight: "700",
    color: "#374151",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  roundBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },
  day: {
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  legend: { flexDirection: "row", marginTop: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", marginRight: 12 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { fontSize: 12, color: "#374151" },
  eventItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  eventLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  eventDot: { width: 16, height: 16, borderRadius: 8 },
  eventDate: { fontSize: 12, color: "#6b7280" },
  articleBig: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  articleTitle: { fontWeight: "800", fontSize: 18, color: "#fff" },
  articleDesc: { fontSize: 14, color: "#eef2ff", marginTop: 4 },
  link: { color: "#fff", fontSize: 13, marginTop: 6, fontWeight: "700" },
  articleSmall: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 4,
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  articleSmallTitle: { fontSize: 14, fontWeight: "700", color: "#111827" },
  articleSmallDesc: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalBox: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 16,
    padding: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    color: "#111827",
  },
  modalText: {
    fontSize: 15,
    color: "#374151",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 22,
  },
  modalRow: {
    flexDirection: "row",
    gap: 10,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  btnGhost: {
    backgroundColor: "#e5e7eb",
  },
  btnPrimary: {
    backgroundColor: "#3b82f6",
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "800",
  },
  modalBtnGhostText: {
    color: "#111827",
    fontWeight: "800",
  },

  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 20,
    marginHorizontal: 20,
    bottom: 40,
  },
  navItem: { alignItems: "center" },

});
