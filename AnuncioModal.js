import React, { useState, useEffect } from "react";
import { 
  Modal, View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Linking
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// Recebemos a propriedade "ativo" do App.js
export default function AnuncioModal({ ativo }) {
  const [visivel, setVisivel] = useState(false);
  const TEMPO_ENTRE_ANUNCIOS = 300000; // 30 segundos para teste

  useEffect(() => {
    // SE NÃO ESTIVER ATIVO (está na tela de login/intro), NÃO FAZ NADA
    if (!ativo) {
        setVisivel(false); // Garante que fecha se voltar pro login
        return;
    }

    // Se estiver ativo, inicia o timer
    const timer = setInterval(() => {
      setVisivel(true);
    }, TEMPO_ENTRE_ANUNCIOS);

    return () => clearInterval(timer);
  }, [ativo]); // Recria o timer toda vez que o status "ativo" mudar

  const fecharAnuncio = () => {
    setVisivel(false);
  };

    const abrirOferta = () => {
        fecharAnuncio();
        // Coloque o link do app/site aqui
        Linking.openURL("https://linktr.ee/cam1lly"); 
    };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visivel}
      onRequestClose={fecharAnuncio}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.btnClose} onPress={fecharAnuncio}>
            <Ionicons name="close-circle" size={30} color="#fff" />
          </TouchableOpacity>

          <Image 
            source={require('./assets/anuncio.png')} 
            style={styles.adImage}
            resizeMode="cover"
          />

          <View style={styles.textContainer}>
            <Text style={styles.adTitle}>Querendo emagrecer?</Text>
            <Text style={styles.adText}>
              Conheça a Nutr.ia, conheça mais e ganhe 7 dias gratis.
            </Text>
            <TouchableOpacity style={styles.btnAction} onPress={abrirOferta}>
              <Text style={styles.btnText}>Ver Mais</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: width * 0.85, backgroundColor: "#fff", borderRadius: 20, overflow: "hidden", alignItems: "center" },
  btnClose: { position: "absolute", top: 10, right: 10, zIndex: 10, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 15 },
  adImage: { width: "100%", height: 250 },
  textContainer: { padding: 20, alignItems: "center" },
  adTitle: { fontSize: 22, fontWeight: "bold", color: "#1B0D3F", marginBottom: 10 },
  adText: { textAlign: "center", color: "#555", marginBottom: 20, fontSize: 14 },
  btnAction: { backgroundColor: "#1B0D3F", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 25 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});