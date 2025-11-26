import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

export default function Cuidados() {
  const navigation = useNavigation();

  const [abaAtiva, setAbaAtiva] = useState("forum");

  const [subAbaAprenda, setSubAbaAprenda] = useState("noticias");

  const [likes, setLikes] = useState({
    post1: false,
    post2: false,
  });

  const toggleLike = (post) => {
    setLikes(prev => ({
      ...prev,
      [post]: !prev[post],
    }));
  };


  const cuidados = [
    {
      id: 3,
      titulo: "RELATÓRIOS",
      desc: "Acompanhe seu progresso",
      colors: ["#CADBFE", "#DFEAFF"],
      screen: "Relatorios",
    },
    {
      id: 3,
      titulo: "DIÁRIO",
      desc: "Registre seu dia, acompanhe sua luta",
      colors: ["#CADBFE", "#DFEAFF"],
      screen: "Diario",
    },
    {
      id: 4,
      titulo: "YOGA",
      desc: "Que tal relaxar o corpo e a mente?",
      colors: ["#DACDFF", "#fbcfe8"],
      screen: "Yoga",
    },
    {
      id: 5,
      titulo: "RESPIRAÇÃO",
      desc: "Amenize sua ansiedade",
      colors: ["#FF9ED3", "#FFDFF1"],
      screen: "Respiracao",
    },
  ];

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.avatar} activeOpacity={0.8}>
            <Icon name="user" size={24} color="#6b7280" />
          </TouchableOpacity>

          <Text style={styles.headerText}>Meus cuidados</Text>

          <TouchableOpacity
            style={styles.avatar}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Perfil")}
          >
            <Icon name="settings" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* TABS DENTRO DO HEADER */}
        <View style={styles.tabsHeader}>
          <TouchableOpacity
            style={[styles.tab, abaAtiva === "forum" && styles.tabAtiva]}
            onPress={() => setAbaAtiva("forum")}
          >
            <Text style={[styles.tabText, abaAtiva === "forum" && styles.tabTextAtiva]}>
              Fórum
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, abaAtiva === "aprenda" && styles.tabAtiva]}
            onPress={() => setAbaAtiva("aprenda")}
          >
            <Text style={[styles.tabText, abaAtiva === "aprenda" && styles.tabTextAtiva]}>
              Aprenda mais
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, abaAtiva === "saude" && styles.tabAtiva]}
            onPress={() => setAbaAtiva("saude")}
          >
            <Text style={[styles.tabText, abaAtiva === "saude" && styles.tabTextAtiva]}>
              Saúde
            </Text>
          </TouchableOpacity>
        </View>
      </View>




      {/* Conteúdo */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* ====== ABA FORUM ====== */}
        {abaAtiva === "forum" && (
        <View style={{ padding: 16}}>

          {/* Aviso - Post fixo */}
          <View style={styles.avisoPost}>
            <View style={styles.postHeader}>
              <View style={styles.userAvatar} />
              <Text style={styles.userName}>Vita</Text>
            </View>

          <Text style={styles.infoText}>
            O fórum da Preventive foi criado para que nossos usuários possam trocar experiências de saúde, com exames, doenças, desafios e apoio emocional mútuo. Por isso, nós prezamos pelo{" "}
            <Text style={{ color: "red" }}>RESPEITO</Text>,{" "}
            <Text style={{ color: "red" }}>AMOR</Text>,{" "}
            <Text style={{ color: "red" }}>CUIDADO</Text> e{" "}
            <Text style={{ color: "red" }}>RESPONSABILIDADE</Text>! Nossa comunidade é filtrada e conta com mecanismos de segurança de acordo com a Lei Geral de Proteção de Dados (
            <Text style={{ fontWeight: "bold" }}>LGPD</Text>). Qualquer problema ou denúncia poderá acarretar no desligamento do usuário e medidas jurídicas.
          </Text>

          </View>

          {/* POST 1 */}
          <View style={styles.socialPost}>
            <View style={styles.postHeader}>
              <View style={styles.userAvatar} />
              <Text style={styles.userName}>Mascote</Text>
            </View>


              <Image source={require('../../../assets/post.png')} style={styles.fakeImage} resizeMode="contain" />

            <TouchableOpacity onPress={() => toggleLike("post1")}>
              <Icon
                name="heart"
                size={22}
                color={likes.post1 ? "#ef4444" : "#9ca3af"}
                style={{ marginTop: 8 }}
              />
            </TouchableOpacity>
          </View>

          {/* POST 2 */}
          <View style={styles.socialPost}>
            <View style={styles.postHeader}>
              <View style={styles.userAvatar} />
              <Text style={styles.userName}>Camilly Queiroz</Text>
            </View>

            <Text style={styles.postText}>
              Gente, recentemente descobri que estou com câncer de mama... mulheres que lutam ou já lutaram contra a doença, como vocês lidaram com a saúde mental nesse momento delicado? Me sinto ansiosa...
            </Text>

            <TouchableOpacity onPress={() => toggleLike("post2")}>
              <Icon
                name="heart"
                size={22}
                color={likes.post2 ? "#ef4444" : "#9ca3af"}
                style={{ marginTop: 8 }}
              />
            </TouchableOpacity>
          </View>

        </View>


        )}

        {/* ====== ABA APRENDA MAIS ====== */}
        {abaAtiva === "aprenda" && (
         <View>

          {/* Sub-tabs internas */}
          <View style={styles.subTabsContainer}>

            <TouchableOpacity
              style={[
                styles.subTab,
                subAbaAprenda === "noticias" && styles.subTabActive,
              ]}
              onPress={() => setSubAbaAprenda("noticias")}
            >
              <Text
                style={[
                  styles.subTabText,
                  subAbaAprenda === "noticias" && styles.subTabTextActive,
                ]}
              >
                Notícias
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.subTab,
                subAbaAprenda === "midias" && styles.subTabActive,
              ]}
              onPress={() => setSubAbaAprenda("midias")}
            >
              <Text
                style={[
                  styles.subTabText,
                  subAbaAprenda === "midias" && styles.subTabTextActive,
                ]}
              >
                Mídias
              </Text>
            </TouchableOpacity>

          </View>

          <View style={{ paddingHorizontal: 16}}>
            <View style={styles.avisoPost}>

              <View style={styles.postHeader}>
                <View style={styles.userAvatar} />
                <Text style={styles.userName}>Equipe Preventive</Text>
              </View>

              <Text style={styles.postText}>
                {/* VOCÊ PODE COLOCAR SEU TEXTO AQUI */}
                Aqui serão exibidos conteúdos educativos sobre saúde, prevenção e bem-estar criados por nossa equipe 💙
              </Text>

            </View>
          </View>
        </View>

        )}
        {/* ====== ABA SAÚDE ====== */}
        {abaAtiva === "saude" && (
          <View style={styles.grid}>
            {cuidados.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: item.colors[0],
                    shadowColor: item.colors[1],
                  },
                ]}
                onPress={() => navigation.navigate(item.screen)}
              >
                <Text style={styles.cardTitle}>{item.titulo}</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

      </ScrollView>


      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Principal")}
        >
          <Icon name="home" size={25} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Exames")}
        >
          <Icon name="file-text" size={25} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Cuidados")}
        >
          <Icon name="heart" size={25} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("ChatBot")}
        >
          <Icon name="user" size={25} color="#6b7280" />
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: "#EDEDED",
    justifyContent: "center",
    alignItems: "center",
  },
 
  headerContent: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  tabsHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    borderRadius: 20,
    paddingVertical: 6,
  },

  tab: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#EDEDED",
  },

  tabAtiva: {
    backgroundColor: "#5A8EF4",
  },

  tabText: {
    color: "#9E9E9E",
    fontWeight: "400",
  },

  tabTextAtiva: {
    color: "#FFFFFF",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1f2937",
  },

  post: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  postTitle: {
    fontWeight: "700",
    marginBottom: 4,
  },

  postText: {
    color: "#4b5563",
  },
  infoText: {
    fontSize: 12,
    color: "#4b5563",
  },

  artigo: {
    backgroundColor: "#EEF2FF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  artigoTitle: {
    fontWeight: "700",
    marginBottom: 6,
  },

  artigoText: {
    color: "#374151",
  },

  headerText: { fontSize: 20, fontWeight: "700", color: "#120D37" },
  content: { flex: 1},

  avisoPost: {
    backgroundColor: "#E8F0FF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 16,
  },

  socialPost: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    elevation: 2,
  },

  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  userAvatar: {
    width: 35,
    height: 35,
    borderRadius: 50,
    backgroundColor: "#c7d2fe",
    marginRight: 10,
  },

  userName: {
    fontWeight: "700",
    color: "#1f2937",
  },

  fakeImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
  },

  subTabsContainer: {
    flexDirection: "row",
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
    marginBottom: 20,
  },

  subTab: {
    width: "50%",
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  subTabActive: {
    backgroundColor: "#3b82f6",
  },

  subTabText: {
    fontWeight: "600",
    color: "#374151",
  },

  subTabTextActive: {
    color: "#fff",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16
  },
  card: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: "700",
    color: "#1f2937",
    marginTop: 8,
  },
  cardDesc: {
    fontSize: 15,
    color: "#374151",
    marginTop: 4,
  },
  navbar: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingVertical: 12, backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 5, borderRadius: 20, marginHorizontal: 50, bottom: 40 },
  navItem: { alignItems: "center" },
});
