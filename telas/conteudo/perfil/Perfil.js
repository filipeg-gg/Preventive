import React, { useState } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  Image, Alert 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Feather";

export default function Perfil({ navigation }) {
  const [image, setImage] = useState(null);

  // Selecionar imagem do dispositivo (teste)
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Componente de item da lista de opções
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
      
      {/* Seção de imagem e nome */}
      <View style={styles.profileSection}>
        <TouchableOpacity 
          style={styles.profileImageWrapper} 
          onPress={pickImage}
        >
          <Image
            source={image ? { uri: image } : require("../../../assets/respiracao.png")}
            style={styles.profileImage}
          />
          <View style={styles.editIcon}>
            <Ionicons name="create-outline" size={18} color="#FF617B" />
          </View>
        </TouchableOpacity>
        <Text style={styles.profileName}>Marcela Soares</Text>
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

      {/* Rodapé */}
      <View style={styles.footer}>
        <Text style={styles.appName}>Preventive - O Inadiável em alerta</Text>
        <Text style={styles.version}>Versão 1.0</Text>
        <Text style={styles.copy}>2025 Preventive, ltd</Text>

        <View style={styles.links}>
          <TouchableOpacity onPress={() => Alert.alert("Política de Privacidade")}>
            <Text style={styles.linkText}>Política de privacidade</Text>
          </TouchableOpacity>
          <Text style={{ color: "#BFBEBF" }}> • </Text>
          <TouchableOpacity onPress={() => Alert.alert("Termos de Uso")}>
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
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Perfil")}>
          <Icon name="user" size={25} color="#3b82f6" />
        </TouchableOpacity>
      </View>
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
  profileImageWrapper: { position: "relative" },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 4,
  },
  profileName: { 
    fontSize: 18, 
    fontWeight: "600", 
    marginTop: 10, 
    color: "#333" 
  },
  optionsList: { marginTop: 30 },
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
  linkText: { fontSize: 12, color: "#007AFF" },
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
    bottom: -15,
  },
  navItem: { alignItems: "center" },
});
