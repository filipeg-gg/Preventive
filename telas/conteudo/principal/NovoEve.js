import React, { useState } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, Modal, 
  ScrollView, TextInput, Alert 
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useRoute } from "@react-navigation/native";

export default function NovoEve({ navigation }) {
  const route = useRoute();
  const [evento, setEvento] = useState(route.params?.tipo || null); 
  const [visible, setVisible] = useState(!route.params?.tipotrue); 


  const escolherEvento = (tipo) => {
    setEvento(tipo);
    setVisible(false); 
  };

  // === Telas de Conteúdo ===
  const TelaExame = () => (
    <View style={styles.tela}>
      <View style={styles.exameContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Principal")}>
            <Icon name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Exame</Text>
          <TouchableOpacity onPress={() => setVisible(true)}>
            <Icon name="refresh-cw" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Formulário */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Seleção de exame */}
          <View style={styles.infoBox}>
            <Text style={styles.label}>Indique o tipo de exame:</Text>
            <View style={styles.radioGroup}>
              {["Mamografia","Papanicolau","Ultr. Transvaginal","Colposcopia","Exame de IST"].map((opcao)=>(
                <TouchableOpacity
                  key={opcao}
                  style={styles.radioItem}
                >
                  <Text style={styles.radioTexto}>{opcao}</Text>
                </TouchableOpacity>
              ))}
              <TextInput style={styles.input} placeholder="Outro exame? Qual?" />
            </View>
          </View>

          {/* Local */}
          <View style={styles.infoBox}>
            <Text style={styles.label}>Local:</Text>
            <View style={styles.radioGroup}>
              {["Hospital Complex","Hospital Brasil","UBS Hortência"].map((item)=>( 
                <TouchableOpacity key={item} style={styles.radioItem}>
                  <Text style={styles.radioTexto}>{item}</Text>
                </TouchableOpacity>
              ))}
              <TextInput style={styles.input} placeholder="Outro local? Qual?" />
            </View>
          </View>

          {/* Data */}
          <View style={styles.infoBox}> 
            <Text style={styles.label}>Data</Text>
            <TextInput
              style={styles.input}
              placeholder="dd/mm/aaaa"
              keyboardType="numeric"
            />
          </View>

          {/* Observações */}
          <View style={styles.infoBox}>
            <Text style={styles.label}>Observações</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Digite observações"
              multiline
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.botaoCancelar} onPress={() => navigation.navigate("Principal")}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoSalvar} onPress={() => Alert.alert("Exame salvo")}>
              <Text style={styles.textoSalvar}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );

  const TelaConsulta = () => (
    <View style={styles.tela}>
      <View style={styles.consulContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Principal")}>
            <Icon name="arrow-left" size={22} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Consulta</Text>
          <TouchableOpacity onPress={() => setVisible(true)}>
            <Icon name="refresh-cw" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.infoBox}>
            <Text style={styles.label}>Qual a consulta?</Text>
            <TextInput style={styles.input} placeholder="Escreva.." />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.label}>Local:</Text>
            <TextInput style={styles.input} placeholder="Qual o local?" />
          </View>

          <View style={styles.infoBox}> 
            <Text style={styles.label}>Data</Text>
            <TextInput
              style={styles.input}
              placeholder="dd/mm/aaaa"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.label}>Observações</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Digite observações"
              multiline
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.botaoCancelar} onPress={() => navigation.navigate("Principal")}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoSalvar} onPress={() => Alert.alert("Consulta salva")}>
              <Text style={styles.textoSalvar}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );

  const TelaResultado = () => (
    <View style={styles.tela}>
      <View style={styles.resultadoContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Principal")}>
            <Icon name="arrow-left" size={22} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Resultado</Text>
          <TouchableOpacity onPress={() => setVisible(true)}>
            <Icon name="refresh-cw" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }} 
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.infoBox}>
            <TextInput style={styles.infoTituloInput} placeholder="Qual o exame?" />
            <View style={styles.infoLinha}>
              <TextInput
                style={[styles.input, { flex: 1, marginLeft: 10 }]}
                placeholder="Data de realização"
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.botaoPdf} onPress={() => Alert.alert("Função disponível em breve")}>
            <Icon name="file-text" size={18} color="#fff" />
            <Text style={styles.botaoPdfTexto}>Anexar PDF</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Data do resultado</Text>
          <TextInput
            style={styles.input}
            placeholder="dd/mm/aaaa"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Diagnóstico?</Text>
          <View style={styles.radioGroup}>
            {["Não","Sim"].map((opcao)=>( 
              <TouchableOpacity key={opcao} style={styles.radioItem}>
                <Text style={styles.radioTexto}>{opcao}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput style={styles.input} placeholder="Caso sim, descreva..." multiline />

          <Text style={styles.label}>Orientação médica</Text>
          <TextInput style={[styles.input, { height: 80 }]} placeholder="Digite a orientação" multiline />

          <Text style={styles.label}>Medicamento(s)?</Text>
          <View style={styles.radioGroup}>
            {["Não","Sim"].map((opcao)=>( 
              <TouchableOpacity key={opcao} style={styles.radioItem}>
                <Text style={styles.radioTexto}>{opcao}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput style={styles.input} placeholder="Caso sim, descreva os medicamentos" multiline />

          <Text style={styles.label}>Observações (opcional)</Text>
          <TextInput style={[styles.input, { height: 80 }]} placeholder="Digite observações" multiline />

          <View style={styles.footer}>
            <TouchableOpacity style={styles.botaoCancelar} onPress={() => navigation.navigate("Principal")}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoSalvar} onPress={() => Alert.alert("Resultado salvo")}>
              <Text style={styles.textoSalvar}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );

  const renderConteudo = () => {
    if (evento === "Exame") return <TelaExame />;
    if (evento === "Consulta") return <TelaConsulta />;
    if (evento === "Resultado") return <TelaResultado />;
    return null;
  };

  return (
    <View style={styles.container}>
      {/* Modal inicial */}
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Qual o evento?</Text>
            <TouchableOpacity style={styles.botao} onPress={() => escolherEvento("Exame")}>
              <Text style={styles.botaoTexto}>Exame</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botao} onPress={() => escolherEvento("Consulta")}>
              <Text style={styles.botaoTexto}>Consulta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botao} onPress={() => escolherEvento("Resultado")}>
              <Text style={styles.botaoTexto}>Resultado</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Conteúdo principal */}
      <View style={styles.conteudo}>{renderConteudo()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9fb" },
  conteudo: { flex: 1 },
  tela: { flex: 1 },

  resultadoContainer: {
    flex: 1,
    backgroundColor: "#f9f9fb",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  exameContainer: {
    flex: 1,
    backgroundColor: "#ffe4f0",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  consulContainer: {
    flex: 1, 
    backgroundColor: "#e0f7fa",
    paddingHorizontal: 20,  
    paddingTop: 50, 
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitulo: { fontSize: 18, fontWeight: "600", color: "#333" },

  infoBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTituloInput: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
  },
  infoLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    marginBottom: 10,
  },

  radioGroup: { flexDirection: "column", marginVertical: 10 },
  radioItem: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  radioTexto: { color: "#333", fontWeight: "500" },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 20,  
  },
  botaoCancelar: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#111827",
    alignItems: "center",
  },
  textoCancelar: { color: "#fff", fontWeight: "600", fontSize: 15 },
  botaoSalvar: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#3b82f6",
    alignItems: "center",
  },
  textoSalvar: { color: "#fff", fontWeight: "600", fontSize: 15 },

  botaoPdf: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: "center"
  },
  botaoPdfTexto: { color: "#fff", fontWeight: "600", marginLeft: 8 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    width: "80%",
    alignItems: "center",
  },
  modalTitulo: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  botao: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  botaoTexto: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
