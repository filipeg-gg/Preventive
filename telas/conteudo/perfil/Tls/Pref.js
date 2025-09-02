import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";

export default function Preferencias({ navigation }) {
  const [modoEscuro, setModoEscuro] = useState(false);
  const [altoContraste, setAltoContraste] = useState(false);
  const [sons, setSons] = useState(true);
  const [vibracao, setVibracao] = useState(true);
  const [idiomaAberto, setIdiomaAberto] = useState(false);
  const [idioma, setIdioma] = useState("Português (BR)");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Perfil")}
        >
          <Text style={styles.arrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Preferências</Text>
      </View>

      {/* Modo escuro */}
      <View style={styles.card}>
        <Text style={styles.label}>Modo escuro</Text>
        <Switch value={modoEscuro} onValueChange={setModoEscuro} />
      </View>

      {/* Alto contraste */}
      <View style={styles.card}>
        <Text style={styles.label}>Modo alto contraste</Text>
        <Switch value={altoContraste} onValueChange={setAltoContraste} />
      </View>

      {/* Tamanho da fonte */}
      <View style={styles.card}>
        <Text style={styles.label}>Tamanho da fonte</Text>
      </View>

      {/* Sons */}
      <View style={styles.card}>
        <Text style={styles.label}>Sons</Text>
        <Switch value={sons} onValueChange={setSons} />
      </View>

      {/* Vibração */}
      <View style={styles.card}>
        <Text style={styles.label}>Vibração</Text>
        <Switch value={vibracao} onValueChange={setVibracao} />
      </View>

      {/* Idiomas */}
      <View style={styles.cardColumn}>
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={() => setIdiomaAberto(!idiomaAberto)}
        >
          <Text style={styles.label}>Idiomas</Text>
          <Text style={styles.arrow}>{idiomaAberto ? "▲" : "▼"}</Text>
        </TouchableOpacity>
        {idiomaAberto && (
          <View style={styles.dropdownList}>
            {["Português (BR)", "English (USA)", "Español (Latinoamerica)"].map(
              (lang) => (
                <TouchableOpacity
                  key={lang}
                  onPress={() => {
                    setIdioma(lang);
                    setIdiomaAberto(false);
                  }}
                >
                  <Text style={styles.dropdownItem}>{lang}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  backButton: {
    padding: 10,
  },
  arrow: {
    fontSize: 24,
    color: "#333",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    flex: 1,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  cardColumn: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  label: {
    fontSize: 14,
    color: "#333",
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownList: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  dropdownItem: {
    padding: 10,
    fontSize: 14,
    color: "#333",
  },
});
