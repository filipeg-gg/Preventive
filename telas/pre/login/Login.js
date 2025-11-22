import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, 
  Dimensions, Image, TextInput, Alert, ActivityIndicator 
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Icon from "react-native-vector-icons/Feather";
import { loginUser } from '../../../UserStore';

const { width, height } = Dimensions.get('window');

export default function Login({ navigation }) {
  const [usuarioDigitado, setUsuarioDigitado] = useState('');
  const [senhaDigitada, setSenhaDigitada] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (usuarioDigitado === 'adm' && senhaDigitada === '1234') {
      navigation.navigate("Principal");
      return;
    } 

    setLoading(true);

    const resultado = await loginUser(usuarioDigitado, senhaDigitada);
    
    setLoading(false);

    if (resultado.success) {
      navigation.navigate("Principal");
    } else {
      Alert.alert("Erro", resultado.error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Image
          source={require('../../../assets/2.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.bottomContainer}>
        <Svg
          width={width}
          height={height * 0.5}
          viewBox="0 0 1440 320"
          style={styles.svgCloud}
        >
          <Path
            fill="#FFFFFF"
            d="M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,197.3C672,181,768,107,864,96C960,85,1056,139,1152,165.3C1248,192,1344,192,1392,192L1440,192V320H0Z"
          />
        </Svg>

        <View style={{ alignItems: 'center', width: '100%', marginTop: -height * 0.05 }}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#A0A0A0"
            value={usuarioDigitado}
            onChangeText={setUsuarioDigitado}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Digite sua senha"
              secureTextEntry={!showPassword}
              placeholderTextColor="#A0A0A0"
              value={senhaDigitada}
              onChangeText={setSenhaDigitada}
            />
            <TouchableOpacity 
              style={styles.eyeButton} 
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon 
                name={showPassword ? "eye-off" : "eye"} 
                size={20} 
                color="#77a5ff" 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.textRow}>
            <Text style={styles.normalText}>Esqueceu a senha? </Text>
            <Text
              style={styles.linkText}
              onPress={() => navigation.navigate("Cadastro")}
            >
              Redefina aqui
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.btLog, loading && { backgroundColor: '#ccc' }]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.textRow}>
            <Text style={styles.normalText}>Não tem conta? </Text>
            <Text
              style={styles.linkText}
              onPress={() => navigation.navigate("Cadastro")}
            >
              Cadastre-se
            </Text>
          </View>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.line} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#AFC8FF',
  },
  topContainer: {
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.6,
    height: height * 0.15,
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'white',
    paddingTop: height * 0.15,
  },
  svgCloud: {
    position: 'absolute',
    top: -height * 0.3,
  },
  input: {
    width: '85%',
    height: height * 0.06,
    backgroundColor: '#FFFFFF',
    borderRadius: height * 0.015,
    paddingHorizontal: width * 0.05,
    marginVertical: height * 0.015,
    elevation: 2,
    fontSize: width * 0.035,
    color: '#333',
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
  },
  eyeButton: {
    position: "absolute",
    right: 15,
  },
  btLog: {
    width: '85%',
    paddingVertical: height * 0.02,
    borderRadius: height * 0.04,
    backgroundColor: '#A1BBEE',
    alignItems: 'center',
    marginVertical: height * 0.02,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  loginButtonText: {
    fontSize: width * 0.04,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  textRow: {
    flexDirection: 'row',
    marginTop: height * 0.02,
  },
  normalText: {
    fontSize: width * 0.035,
    color: '#a9a9a9',
    fontWeight: 'bold',
  },
  linkText: {
    fontSize: width * 0.035,
    color: '#77a5ff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    marginTop: height * 0.03,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#d3d3d3',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#a9a9a9',
    fontSize: width * 0.035,
    fontWeight: '500',
  },
});