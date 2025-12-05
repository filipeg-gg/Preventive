import React, { useState, useEffect } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  Alert, Modal, ScrollView 
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Feather";
import { getCurrentUser } from "../../../UserStore";

export default function Perfil({ navigation }) {

  const [user, setUser] = useState({usuario: "", sobrenome: ""});
  
  // Estados do Modal de Termos/Privacidade
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitulo, setModalTitulo] = useState("");
  const [modalConteudo, setModalConteudo] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.log("Erro ao carregar usuário:", error);
      }
    };
    loadUser();
  }, []);

  // Função para abrir o modal com o texto correto
const abrirTermos = (tipo) => {
    if (tipo === 'privacidade') {
        setModalTitulo("Política de Privacidade");
        setModalConteudo("Aqui vai o texto da sua Política de Privacidade.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit...");
    } else {
        setModalTitulo("Termos de Uso");
        setModalConteudo(`Termos de Uso – Preventive

1. Uso dos Recursos de Prevenção e Conteúdo
As informações, alertas e relatórios de risco disponibilizados pelo Preventive são de uso estritamente pessoal e intransferível. O usuário não deve compartilhar, reproduzir ou utilizar os dados de inteligência preventiva gerados pela plataforma para fins comerciais ou públicos sem autorização, sob pena de violação dos direitos de propriedade intelectual.

2. Responsabilidade do Usuário e Veracidade dos Dados
O usuário é inteiramente responsável pela precisão das informações inseridas no aplicativo, especialmente no que tange ao registro de ocorrências ("Novos Eventos"), dados de localização e perfil de risco. A eficácia das funcionalidades de prevenção depende da veracidade desses dados. O Preventive não se responsabiliza por falhas de monitoramento causados por informações incorretas fornecidas pelo usuário.

3. Cancelamento da Assinatura
O usuário poderá cancelar sua assinatura a qualquer momento através da área de gerenciamento. O cancelamento interrompe a renovação automática para o ciclo seguinte, mas não gera direito a reembolso referente ao período já pago e não utilizado.

4. Limitação de Responsabilidade e Caráter Informativo
O Preventive é uma ferramenta de apoio à gestão de riscos, não substituindo, em hipótese alguma, os serviços oficiais de emergência e segurança pública (como Polícia ou Bombeiros). O aplicativo não garante a prevenção total de incidentes. Em situações de perigo iminente, acione imediatamente as autoridades.

5. Alterações nos Termos
O Preventive reserva-se o direito de alterar estes Termos de Uso a qualquer momento. O uso contínuo do aplicativo após tais alterações implica na concordância com os novos termos.`);
    }
    setModalVisible(true);
  };

  const OptionItem = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.optionItem} onPress={onPress}>
      <View style={styles.optionLeft}>
        {icon}
        <Text style={styles.optionText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#5E5E5E" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      
      {/* Seção de Ícone e Nome */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
            <Ionicons name="person" size={50} color="#fff" />
        </View>
        <Text style={styles.profileName}>
          {user.usuario} {user.sobrenome}
        </Text>
      </View>

      {/* Lista de opções */}
      <View style={styles.optionsList}>
        <OptionItem 
          icon={<Ionicons name="person-outline" size={20} color="#5E5E5E" />} 
          title="Editar perfil" 
          onPress={() => navigation.navigate("EditP")}  
        />
        <OptionItem 
          icon={<Ionicons name="settings-outline" size={20} color="#5E5E5E" />} 
          title="Preferências" 
          onPress={() => navigation.navigate("Preferencias")}  
        />
        <OptionItem 
          icon={<Ionicons name="notifications-outline" size={20} color="#5E5E5E" />} 
          title="Notificações" 
          onPress={() => navigation.navigate("Notificacoes")}  
        />
        <OptionItem 
          icon={<MaterialIcons name="payment" size={20} color="#332e2e" />} 
          title="Pagamento" 
          onPress={() => navigation.navigate("Pagamento")}  
        />
        <OptionItem 
          icon={<Feather name="shield" size={20} color="#5E5E5E" />} 
          title="Privacidade" 
          onPress={() => navigation.navigate("Privacidade")}  
        />
        <OptionItem 
          icon={<Feather name="help-circle" size={20} color="#5E5E5E" />} 
          title="Ajuda" 
          onPress={() => navigation.navigate("Ajuda")}  
        />
      </View>

      {/* Rodapé com Links Clicáveis */}
      <View style={styles.footer}>
        <Text style={styles.appName}>Preventive - O Inadiável em alerta</Text>
        <Text style={styles.version}>Versão 2.0</Text>
        <Text style={styles.copy}>2025 Preventive, ltd</Text>

        <View style={styles.links}>
          <TouchableOpacity onPress={() => abrirTermos('termos')}>
            <Text style={styles.linkText}>Política de privacidade</Text>
          </TouchableOpacity>
          <Text style={{ color: "#BFBEBF" }}> • </Text>
          <TouchableOpacity onPress={() => abrirTermos('termos')}>
            <Text style={styles.linkText}>Termos de Uso</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Navbar */}
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
          <Icon name="message-circle" size={25} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* MODAL DE TERMOS E PRIVACIDADE */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{modalTitulo}</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Icon name="x" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.modalBody}>
                    <Text style={styles.modalText}>{modalConteudo}</Text>
                </ScrollView>
                <TouchableOpacity 
                    style={styles.modalButton} 
                    onPress={() => setModalVisible(false)}
                >
                    <Text style={styles.modalButtonText}>Entendi</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  profileSection: { 
    alignItems: "center", 
    paddingVertical: 30, 
    marginTop: 40 
  },
  // Estilo novo para o ícone circular
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#d1d5db", // Cinza claro
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  profileName: { 
    fontSize: 18, 
    fontWeight: "600", 
    marginTop: 5, 
    color: "#333" 
  },
  optionsList: { marginTop: 20 },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionLeft: { flexDirection: "row", alignItems: "center" },
  optionText: { fontSize: 16, marginLeft: 12, color: "#333" },
  footer: { 
    alignItems: "center", 
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 80, 
  },
  appName: { fontSize: 12, fontWeight: "bold", color: "#BFBEBF" },
  version: { fontSize: 10, color: "#BFBEBF" },
  copy: { fontSize: 10, color: "#BFBEBF", marginBottom: 5 },
  links: { flexDirection: "row", alignItems: "center" },
  linkText: { fontSize: 12, color: "#007AFF", fontWeight: "600" },
  navbar: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingVertical: 12, backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 5, borderRadius: 20, marginHorizontal: 50, bottom: 40 },
  navItem: { alignItems: "center" },

  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "100%",
    height: "70%",
    borderRadius: 15,
    padding: 20,
    elevation: 5
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  modalBody: {
    flex: 1,
    marginBottom: 15
  },
  modalText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    textAlign: 'justify'
  },
  modalButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});