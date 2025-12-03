import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Preferencias({ navigation }) {
  const [modoEscuro, setModoEscuro] = useState(false);
  const [altoContraste, setAltoContraste] = useState(false);
  const [sons, setSons] = useState(true);
  const [vibracao, setVibracao] = useState(true);
  const [idiomaAberto, setIdiomaAberto] = useState(false);
  const [idioma, setIdioma] = useState("Português (BR)");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Perfil")} style={styles.backBtn}>
           <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Preferências</Text>
        <View style={{width: 24}} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.label}>Modo escuro</Text>
          <Switch value={modoEscuro} onValueChange={setModoEscuro} trackColor={{false: "#767577", true: "#3B82F6"}} thumbColor={modoEscuro ? "#fff" : "#f4f3f4"} />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Modo alto contraste</Text>
          <Switch value={altoContraste} onValueChange={setAltoContraste} trackColor={{false: "#767577", true: "#3B82F6"}} thumbColor={altoContraste ? "#fff" : "#f4f3f4"} />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Sons do aplicativo</Text>
          <Switch value={sons} onValueChange={setSons} trackColor={{false: "#767577", true: "#3B82F6"}} thumbColor={sons ? "#fff" : "#f4f3f4"} />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Vibração</Text>
          <Switch value={vibracao} onValueChange={setVibracao} trackColor={{false: "#767577", true: "#3B82F6"}} thumbColor={vibracao ? "#fff" : "#f4f3f4"} />
        </View>

        <View style={styles.cardLink}>
          <Text style={styles.label}>Tamanho da fonte</Text>
          <View style={{flexDirection:'row', alignItems:'center'}}>
             <Text style={{color:'#6B7280', marginRight: 5}}>Médio</Text>
             <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </View>
        </View>

        <View style={styles.cardColumn}>
          <TouchableOpacity style={styles.dropdownHeader} onPress={() => setIdiomaAberto(!idiomaAberto)}>
            <Text style={styles.label}>Idioma</Text>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={{color:'#3B82F6', fontWeight:'600', marginRight:5}}>{idioma}</Text>
                <Ionicons name={idiomaAberto ? "chevron-up" : "chevron-down"} size={20} color="#6B7280" />
            </View>
          </TouchableOpacity>
          
          {idiomaAberto && (
            <View style={styles.dropdownList}>
              {["Português (BR)", "English (USA)", "Español (Latinoamerica)"].map((lang, index) => (
                <TouchableOpacity key={lang} onPress={() => { setIdioma(lang); setIdiomaAberto(false); }} style={[styles.dropdownItem, index !== 2 && {borderBottomWidth:1, borderBottomColor:'#F3F4F6'}]}>
                  <Text style={[styles.itemText, idioma === lang && {color:'#3B82F6', fontWeight:'bold'}]}>{lang}</Text>
                  {idioma === lang && <Ionicons name="checkmark" size={18} color="#3B82F6" />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15, backgroundColor: "#fff", elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 3 },
  backBtn: { padding: 5 },
  title: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  scroll: { padding: 20 },
  card: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#E5E7EB" },
  cardLink: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#E5E7EB" },
  cardColumn: { backgroundColor: "#fff", borderRadius: 12, padding: 0, marginBottom: 12, borderWidth: 1, borderColor: "#E5E7EB", overflow:'hidden' },
  label: { fontSize: 15, color: "#374151", fontWeight: "500" },
  dropdownHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  dropdownList: { backgroundColor: "#F9FAFB", borderTopWidth: 1, borderTopColor: "#E5E7EB" },
  dropdownItem: { padding: 16, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  itemText: { fontSize: 14, color: "#4B5563" },
});