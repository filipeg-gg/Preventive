import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";

export default function Informativo({ navigation }) {
  const dados = [
    {
      titulo: "Diário",
      texto: "Registre sintomas, seu humor, orientações médicas e mais.",
      img: require("../../../../assets/diario.png"),
      lado: "esq",
    },
    {
      titulo: "Yoga",
      texto: "Esse exercício é uma ótima opção para relaxar o corpo sem fazer tanto esforço físico.",
      img: require("../../../../assets/yoga.png"),
      lado: "dir",
    },
    {
      titulo: "Respiração",
      texto: "Exercícios de respiração para você relaxar a mente e o coração.",
      img: require("../../../../assets/respiracao.png"),
      lado: "esq",
    },
    {
      titulo: "Medicamentos",
      texto: "Cadastre os medicamentos que você precisa tomar, adicione um horário para lembrete e uma descrição.",
      img: require("../../../../assets/medicamento.png"),
      lado: "dir",
    },
    {
      titulo: "Comunidade",
      texto: "Rede de apoio com outras pessoas que usam a +PREVENTIVE para compartilhar motivação e experiências.",
      img: require("../../../../assets/comunidade.png"),
      lado: "esq",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {dados.map((item, index) => (
        <View
          key={index}
          style={[
            styles.card,
            item.lado === "esq" ? styles.ladoEsq : styles.ladoDir,
          ]}
        >
          <Text style={styles.titulo}>{item.titulo}</Text>
          <Text style={styles.texto}>{item.texto}</Text>
        <View style={{ alignItems: item.lado === "esq" ? "flex-start" : "flex-end" }}>
          <Image source={item.img} style={styles.imagem} />
        </View>
        </View>
      ))}

      <View style={styles.finalBox}>
        <Text style={styles.titulo}>Adquira já!</Text>
        <Text style={styles.textoCentral}>
          Desbloqueie recursos exclusivos com a versão premium.{"\n"}
          Tenha acesso completo a todas as funcionalidades!
        </Text>
        <TouchableOpacity 
        style={styles.botao}
        onPress={() => navigation.navigate('t1')}
        >
          <Text style={styles.botaoTexto}>Assinar agora</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fde2e4",
    padding: 16,
    top: 30,
  },
  card: {
    width: "80%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 40,
  },
  ladoEsq: {
    alignSelf: "flex-start",
  },
  ladoDir: {
    alignSelf: "flex-end",
  },
  imagem: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginTop: 8,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e1e1e",
    marginBottom: 6,

  },
  texto: {
    fontSize: 16,
    color: "#333",

  },
  finalBox: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  textoCentral: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginVertical: 10,
  },
  botao: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 40,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
