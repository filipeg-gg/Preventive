import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  FlatList,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function Relatorios({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [relatorioSelecionado, setRelatorioSelecionado] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(3); // Abril
  const [selectedYear, setSelectedYear] = useState(2025);

  const relatorios = useMemo(
    () => [
      { id: 1, mes: "Abril", ano: 2025 },
      { id: 2, mes: "Março", ano: 2025 },
      { id: 3, mes: "Fevereiro", ano: 2025 },
      { id: 4, mes: "Janeiro", ano: 2025 },
      { id: 5, mes: "Dezembro", ano: 2024 },
    ],
    []
  );

  const abrirRelatorio = (item) => {
    setRelatorioSelecionado(item);
    setModalVisible(true);
  };

  const toggleDatePicker = () => setDatePickerVisible((v) => !v);

  const filtered = relatorios.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (`${r.mes} ${r.ano}`.toLowerCase().includes(q) || String(r.ano).includes(q));
  });

  const applyDateFilter = () => {
    // If you want to filter the list by the selected month/year, uncomment below
    // const selected = relatorios.filter(r => r.mes === months[selectedMonthIndex] && r.ano === selectedYear)
    // setFilteredList(selected)
    setDatePickerVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => navigation.navigate("Cuidados")}
        >
          <Icon name="arrow-left" size={22} color="#2D1E72" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Relatórios</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Search + Filter Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputBox}>
          <Icon name="search" size={16} color="#9A98B5" />
          <TextInput
            placeholder="Pesquisar por mês ou ano"
            placeholderTextColor="#9A98B5"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}> 
              <Icon name="x" size={16} color="#9A98B5" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.filterButton} onPress={toggleDatePicker}>
          <Icon name="calendar" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Lista de relatórios */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => {
          const isActive =
            item.mes === months[selectedMonthIndex] && item.ano === selectedYear;
          return (
            <TouchableOpacity
              style={[styles.card, isActive && styles.cardActive]}
              onPress={() => abrirRelatorio(item)}
            >
              <View>
                <Text style={styles.cardTitulo}>Relatório de {item.mes} {item.ano}</Text>
                <Text style={styles.cardTexto}>Confira o relatório sobre sua saúde desse mês</Text>
              </View>
              <Icon name="chevron-right" size={18} color="#C7C2E6" />
            </TouchableOpacity>
          );
        }}
      />

      {/* Modal de relatório */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          {/* Header Modal */}
          <View style={styles.headerModal}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Icon name="arrow-left" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerModalTitle}>Relatório sobre sua saúde</Text>
            <View style={{ width: 22 }} />
          </View>

          <ScrollView style={{ padding: 18 }}>
            {relatorioSelecionado && (
              <>
                <Text style={styles.sectionTitle}>Período: {relatorioSelecionado.mes} de {relatorioSelecionado.ano}</Text>

                <View style={styles.box}>
                  <Text style={styles.boxTitle}>Resumo de atividades</Text>
                  <Text style={styles.boxLine}>Consultas realizadas: 3</Text>
                  <Text style={styles.boxLine}>Consultas marcadas: 5</Text>
                  <Text style={styles.boxLine}>Exames realizados: 2</Text>
                  <Text style={styles.boxLine}>Exames marcados: 4</Text>
                </View>

                <View style={styles.box}>
                  <Text style={styles.boxTitle}>Resultado dos exames principais</Text>
                  <Text style={styles.boxText}>Exames laboratoriais estão dentro da normalidade. Atenção à manutenção de hábitos saudáveis.</Text>
                </View>

                <View style={styles.box}>
                  <Text style={styles.boxTitle}>Variações de humor</Text>
                  <Text style={styles.boxText}>Nesse mês, você se sentiu mais <Text style={{ fontWeight: "700" }}>animado</Text>.</Text>
                  <View style={styles.fakeChart}><Text style={{ color: "#2D1E72" }}>[Gráfico ilustrativo]</Text></View>
                </View>

                <View style={styles.box}>
                  <Text style={styles.boxTitle}>Sintomas</Text>
                  <Text style={styles.boxText}>Nesse mês, você sentiu: cansaço leve e dor de cabeça.</Text>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Date Picker modal (custom) */}
      <Modal visible={datePickerVisible} transparent animationType="fade">
        <View style={styles.datePickerOverlay}>
          <View style={styles.datePickerCard}>
            <Text style={styles.pickerLabel}>Escolha o mês/ano</Text>

            <View style={styles.pickerRow}>
              <TouchableOpacity
                onPress={() => setSelectedYear((y) => y - 1)}
                style={styles.chevBtn}
              >
                <Icon name="chevrons-left" size={18} color="#2D1E72" />
              </TouchableOpacity>

              <View style={styles.pickerColumn}>
                <View style={styles.pickerMonthRow}>
                  <TouchableOpacity onPress={() => setSelectedMonthIndex((m) => (m - 1 + 12) % 12)}>
                    <Icon name="chevron-left" size={22} color="#2D1E72" />
                  </TouchableOpacity>

                  <Text style={styles.monthText}>{months[selectedMonthIndex]}</Text>

                  <TouchableOpacity onPress={() => setSelectedMonthIndex((m) => (m + 1) % 12)}>
                    <Icon name="chevron-right" size={22} color="#2D1E72" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.yearText}>{selectedYear}</Text>
              </View>

              <TouchableOpacity
                onPress={() => setSelectedYear((y) => y + 1)}
                style={styles.chevBtn}
              >
                <Icon name="chevrons-right" size={18} color="#2D1E72" />
              </TouchableOpacity>
            </View>

            <View style={styles.pickerActions}>
              <TouchableOpacity style={styles.pickerCancel} onPress={() => setDatePickerVisible(false)}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.pickerOk} onPress={applyDateFilter}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F3FA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 18,
    backgroundColor: "transparent",
    top: 20,
  },
  headerLeft: { width: 36 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#2D1E72",
  },
  headerRight: { width: 36 },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    marginTop: 25,
  },
  searchInputBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
    padding: 0,
  },
  filterButton: {
    marginLeft: 12,
    backgroundColor: "#2D1E72",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 44,
  },

  lista: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 60 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#4B3D8C",
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: "transparent",
  },
  cardActive: {
    borderColor: "#E6E0FF",
    backgroundColor: "#fff",
  },
  cardTitulo: { fontSize: 16, fontWeight: "700", color: "#2D1E72" },
  cardTexto: { color: "#7C7A8F", marginTop: 4 },

  modalContainer: { flex: 1, backgroundColor: "#fff" },
  headerModal: {
    backgroundColor: "#2D1E72",
    paddingTop: Platform.OS === "ios" ? 50 : 24,
    paddingBottom: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  headerModalTitle: { flex: 1, textAlign: "center", color: "#fff", fontWeight: "700", fontSize: 16 },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2D1E72",
    marginBottom: 10,
  },
  box: {
    backgroundColor: "#F8F8FB",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
  },
  boxTitle: { fontSize: 14, fontWeight: "700", marginBottom: 6, color: "#2D1E72" },
  boxText: { color: "#444" },
  boxLine: { color: "#444", marginBottom: 4 },
  fakeChart: {
    marginTop: 10,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E9E6F8",
    borderRadius: 8,
  },

  /* Date picker */
  datePickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  datePickerCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
  },
  pickerLabel: { fontWeight: "700", color: "#2D1E72", marginBottom: 12 },
  pickerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  chevBtn: { padding: 8 },
  pickerColumn: { flex: 1, alignItems: "center" },
  pickerMonthRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12 },
  monthText: { marginHorizontal: 18, fontSize: 16, fontWeight: "700", color: "#2D1E72" },
  yearText: { marginTop: 6, color: "#6C6B80", fontWeight: "600" },
  pickerActions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16 },
  pickerCancel: { padding: 10, marginRight: 10 },
  pickerOk: { backgroundColor: "#2D1E72", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 },
});
