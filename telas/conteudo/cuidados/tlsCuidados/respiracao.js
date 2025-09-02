import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

export default function Respiracao() {
  const navigation = useNavigation();
  const [started, setStarted] = useState(false);
  const [fase, setFase] = useState("Inspire");

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (started) {
      animarRespiracao();
    }
  }, [started]);

  const animarRespiracao = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 2, // aumenta a bola
        duration: 4000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1, // volta ao tamanho normal
        duration: 4000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // alterna Inspire/Expire
      setFase((prev) => (prev === "Inspire" ? "Expire" : "Inspire"));
      animarRespiracao(); // repete o ciclo
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => navigation.navigate("Cuidados")}
      >
        <Icon name="x" size={24} color="#2D0036" />
      </TouchableOpacity>

      {!started ? (
        <>
          <Text style={styles.title}>Exercício de respiração</Text>
          <Text style={styles.subtitle}>Exercício de respiração</Text>
          <TouchableOpacity style={styles.button} onPress={() => setStarted(true)}>
            <Text style={styles.buttonText}>Começar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.center}>
          <Animated.View
            style={[
              styles.ball,
              { transform: [{ scale: scaleAnim }] },
            ]}
          />
          <Text style={styles.phase}>{fase}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF7FA0",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D0036",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#2D0036",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#2D0036",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  center: {
    alignItems: "center",
  },
  ball: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  phase: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2D0036",
  },
});
