import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  Dimensions
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { LineChart } from "react-native-chart-kit";

// --- IMPORTS DO FIREBASE ---
import { db, auth } from '../../../../firebaseConfig'; 
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

const screenWidth = Dimensions.get("window").width;

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function Relatorios({ navigation }) {
  // --- DADOS DO MÊS ATUAL ---
  const dataAtual = new Date();
  const mesAtualIndex = dataAtual.getMonth();
  const anoAtual = dataAtual.getFullYear();
  const nomeMesAtual = months[mesAtualIndex];

  // --- STATES ---
  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState({
    totalConsultas: 0,
    totalExames: 0,
    examesRecentes: [],
    dadosHumor: [], 
  });

  // --- BUSCAR DADOS ---
  useEffect(() => {
    const buscarDados = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) return;

        // Definir o intervalo do mês atual
        const startOfMonth = new Date(anoAtual, mesAtualIndex, 1);
        const endOfMonth = new Date(anoAtual, mesAtualIndex + 1, 0, 23, 59, 59);

        // 1. Consultas (Mantido igual, caso você tenha essa tela separada)
        const qConsultas = query(
          collection(db, "consultas"),
          where("uid", "==", user.uid),
          where("data", ">=", startOfMonth),
          where("data", "<=", endOfMonth)
        );
        const snapConsultas = await getDocs(qConsultas);

        // 2. Exames (Mantido igual)
        const qExames = query(
          collection(db, "exames"),
          where("uid", "==", user.uid),
          where("data", ">=", startOfMonth),
          where("data", "<=", endOfMonth)
        );
        const snapExames = await getDocs(qExames);
        
        const listaExames = [];
        snapExames.forEach(doc => listaExames.push({ id: doc.id, ...doc.data() }));

        // 3. Humor (Diário) - AQUI ESTAVA O SEGREDO
        // Estamos buscando na coleção "diario" e filtrando por data
        const qHumor = query(
          collection(db, "diario"), 
          where("uid", "==", user.uid),
          where("data", ">=", startOfMonth),
          where("data", "<=", endOfMonth),
          orderBy("data", "asc") // Se der erro de índice aqui, remova esta linha
        );
        
        // Se der erro de índice no console, o Firebase vai pedir pra criar.
        // Se preferir evitar o erro agora, comente a linha orderBy acima.
        
        const snapHumor = await getDocs(qHumor);
        
        const humorData = [];
        snapHumor.forEach(doc => {
          const d = doc.data();
          if (d.data && d.data.toDate) {
             const dataObj = d.data.toDate();
             const dia = dataObj.getDate(); 
             // Adiciona ao gráfico: Dia e Nível
             humorData.push({ dia: dia, nivel: d.humorNivel || 0 }); 
          }
        });

        // Ordenar por dia (caso a query não tenha ordenado)
        humorData.sort((a, b) => a.dia - b.dia);

        setDados({
          totalConsultas: snapConsultas.size,
          totalExames: snapExames.size,
          examesRecentes: listaExames,
          dadosHumor: humorData,
        });

      } catch (error) {
        console.log("Erro ao buscar relatório:", error);
      } finally {
        setLoading(false);
      }
    };

    buscarDados();
  }, []);

  // --- CONFIG DO GRÁFICO ---
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(45, 30, 114, ${opacity})`, // Roxo #2D1E72
    labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
    strokeWidth: 3, 
    barPercentage: 0.5,
    decimalPlaces: 0, // Sem casas decimais (humor é inteiro)
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: "#2D1E72"
    }
  };

  const dadosGrafico = {
    labels: dados.dadosHumor.length > 0 ? dados.dadosHumor.map(h => h.dia) : ["0"],
    datasets: [{
      data: dados.dadosHumor.length > 0 ? dados.dadosHumor.map(h => h.nivel) : [0],
    }]
  };

  return (
    <View style={styles.container}>
      {/* Header Fixo */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Cuidados")} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#2D1E72" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerSubtitle}>Relatório Mensal</Text>
          <Text style={styles.headerTitle}>{nomeMesAtual} {anoAtual}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2D1E72" />
          <Text style={styles.loadingText}>Calculando suas estatísticas...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* --- CARDS DE RESUMO (GRID) --- */}
          <View style={styles.statsRow}>
            {/* Card Consultas */}
            <View style={[styles.statCard, { marginRight: 10 }]}>
              <View style={[styles.iconCircle, { backgroundColor: '#E0E7FF' }]}>
                <Icon name="activity" size={22} color="#2D1E72" />
              </View>
              <Text style={styles.statNumber}>{dados.totalConsultas}</Text>
              <Text style={styles.statLabel}>Consultas</Text>
            </View>

            {/* Card Exames */}
            <View style={[styles.statCard, { marginLeft: 10 }]}>
              <View style={[styles.iconCircle, { backgroundColor: '#E0F2F1' }]}>
                <Icon name="clipboard" size={22} color="#00695C" />
              </View>
              <Text style={styles.statNumber}>{dados.totalExames}</Text>
              <Text style={styles.statLabel}>Exames</Text>
            </View>
          </View>

          {/* --- GRÁFICO DE HUMOR --- */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Icon name="smile" size={18} color="#2D1E72" />
              <Text style={styles.sectionTitle}>Variação de Humor</Text>
            </View>
            
            {dados.dadosHumor.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <LineChart
                  data={dadosGrafico}
                  width={Math.max(screenWidth - 64, dados.dadosHumor.length * 50)} // Cresce se tiver muitos dias
                  height={180}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chartStyle}
                  withInnerLines={false}
                  withOuterLines={false}
                  fromZero={true}
                  yAxisInterval={1}
                />
              </ScrollView>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Nenhum registro de humor neste mês.</Text>
              </View>
            )}
            <Text style={styles.chartHelper}>Dia do mês vs. Nível (1-5)</Text>
          </View>

          {/* --- LISTA DE EXAMES RECENTES --- */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Icon name="file-text" size={18} color="#2D1E72" />
              <Text style={styles.sectionTitle}>Resultados Recentes</Text>
            </View>

            {dados.examesRecentes.length === 0 ? (
               <View style={styles.emptyState}>
                 <Text style={styles.emptyStateText}>Nenhum exame realizado em {nomeMesAtual}.</Text>
               </View>
            ) : (
              dados.examesRecentes.map((exame, index) => (
                <View key={index} style={styles.resultItem}>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultTitle}>{exame.titulo || "Exame sem nome"}</Text>
                    <Text style={styles.resultDate}>Realizado em {nomeMesAtual}</Text>
                  </View>
                  <View style={styles.resultBadge}>
                    <Text style={styles.resultBadgeText}>{exame.resultado || "Pendente"}</Text>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={{height: 30}} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA", 
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: "#fff",
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backButton: {
    marginRight: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F5F6FA'
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2D1E72",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 12,
    color: '#888',
    fontSize: 14
  },
  scrollContent: {
    padding: 24,
  },
  
  /* GRID DE STATS */
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'flex-start',
    shadowColor: "#2D1E72",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },

  /* SECTIONS (Gráfico e Lista) */
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D1E72',
    marginLeft: 8,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartHelper: {
    textAlign: 'center',
    fontSize: 10,
    color: '#AAA',
    marginTop: 5,
  },
  
  /* LISTA DE RESULTADOS */
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  resultDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  resultBadge: {
    backgroundColor: '#F3F0FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  resultBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D1E72',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#AAA',
    fontStyle: 'italic',
  }
});