import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
  Easing,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function Respiracao() {
  const navigation = useNavigation();
  const [started, setStarted] = useState(false);
  const [instrucao, setInstrucao] = useState("Prepare-se");
  
  // Valores animados
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;

  // Função para transição suave do texto
  const mudarTexto = (novoTexto) => {
    Animated.sequence([
      Animated.timing(textOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(textOpacity, { toValue: 1, duration: 500, useNativeDriver: true })
    ]).start();
    
    setTimeout(() => setInstrucao(novoTexto), 200);
  };

  const cicloRespiracao = () => {
    if (!started) return;

    // Fase 1: INSPIRAR (4 segundos)
    mudarTexto("Inspire profundamente...");
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 2.5, // Cresce bastante
        duration: 4000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 4000,
        useNativeDriver: true,
      })
    ]).start(() => {
        // Fase 2: EXPIRAR (4 segundos)
        if (!started) return; // Checagem de segurança
        mudarTexto("Expire lentamente...");
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1, // Volta ao normal
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.3,
            duration: 4000,
            useNativeDriver: true,
          })
        ]).start(() => {
            // Loop recursivo
            if (started) cicloRespiracao(); 
        });
    });
  };

  // Iniciar animação quando o estado 'started' mudar
  useEffect(() => {
    if (started) {
      cicloRespiracao();
    } else {
        // Resetar se parar
        scaleAnim.setValue(1);
        opacityAnim.setValue(0.3);
        setInstrucao("Prepare-se");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1B4B" />

      {/* Botão Fechar */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => {
            setStarted(false);
            navigation.navigate("Cuidados");
        }}
      >
        <Icon name="x" size={28} color="#A5B4FC" />
      </TouchableOpacity>

      {!started ? (
        // TELA INICIAL
        <View style={styles.introContainer}>
          <View style={styles.iconContainer}>
             <Icon name="wind" size={60} color="#818CF8" />
          </View>
          <Text style={styles.title}>Pausa para Respirar</Text>
          <Text style={styles.subtitle}>
            Dedique um momento para acalmar sua mente. Siga o ritmo da animação para relaxar.
          </Text>
          
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.8}
            onPress={() => setStarted(true)}
          >
            <Text style={styles.buttonText}>Iniciar Sessão</Text>
            <Icon name="arrow-right" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        // TELA DO EXERCÍCIO
        <View style={styles.animationContainer}>
          
          {/* Círculos da Aura (efeito visual) */}
          <View style={styles.circleWrapper}>
             <Animated.View
                style={[
                  styles.auraCircle,
                  {
                    transform: [{ scale: scaleAnim }],
                    opacity: opacityAnim,
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.innerCircle,
                  {
                    transform: [{ scale: scaleAnim }],
                  }
                ]}
              />
          </View>

          {/* Texto de Instrução */}
          <View style={styles.textWrapper}>
            <Animated.Text style={[styles.phaseText, { opacity: textOpacity }]}>
                {instrucao}
            </Animated.Text>
            <TouchableOpacity 
                style={styles.stopButton}
                onPress={() => setStarted(false)}
            >
                <Text style={styles.stopButtonText}>Parar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1B4B", // Azul Noturno Profundo
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 50,
    right: 30,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  
  // Estilos da Tela Inicial
  introContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
      marginBottom: 30,
      backgroundColor: 'rgba(129, 140, 248, 0.15)',
      padding: 30,
      borderRadius: 100,
      borderWidth: 1,
      borderColor: 'rgba(129, 140, 248, 0.3)',
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#A5B4FC", // Lilás claro
    textAlign: "center",
    marginBottom: 50,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#6366F1", // Indigo Vibrante
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  // Estilos da Animação
  animationContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: '100%',
  },
  circleWrapper: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
  },
  auraCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#818CF8", // Cor da aura
    position: 'absolute',
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#C7D2FE", // Núcleo mais claro
    shadowColor: "#fff",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  textWrapper: {
      position: 'absolute',
      bottom: 100,
      alignItems: 'center',
  },
  phaseText: {
    fontSize: 28,
    fontWeight: "300",
    color: "#fff",
    letterSpacing: 2,
    marginBottom: 40,
  },
  stopButton: {
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.3)',
      borderRadius: 20,
  },
  stopButtonText: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: 14,
  }
});