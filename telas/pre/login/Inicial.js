import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function Inicial({ navigation }) {
  const { width, height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      {/* Topo com Logo */}
      <View style={styles.topContainer}>
        <Image
          source={require('../../../assets/2.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Parte de baixo com fundo branco e botões */}
      <View style={styles.bottomContainer}>
        <Svg
          width={width}
          height={height * 0.5}
          viewBox="0 0 1440 320"
          style={styles.svgCloud}
        >
          <Path
            fill="#FFFFFF"
            d="M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,197.3C672,181,768,107,864,96C960,85,1056,139,1152,165.3C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </Svg>

        {/* Botão Cadastrar */}
        <TouchableOpacity style={styles.bt1} onPress={() => navigation.navigate("Cadastro")}>
          <Text style={styles.loginButtonText}>Cadastrar</Text>
        </TouchableOpacity>
        
        {/* Texto de Login */}
        <View style={styles.textRow}>
          <Text style={styles.normalText}>Já possui uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}>Entrar</Text>
          </TouchableOpacity>
        </View>
        
        {/* Divisor futura conexão com google e apple*/}
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.line} />
        </View>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#AFC8FF',
  },
  topContainer: {
    height: height * 0.4,
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
    backgroundColor: 'white',
    position: 'relative',
    paddingTop: height * 0.08,
  },
  svgCloud: {
    position: 'absolute',
    top: -height * 0.3,
  },
  bt1: {
    width: '85%',
    paddingVertical: height * 0.02,
    borderRadius: height * 0.03,
    backgroundColor: '#A1BBEE',
    alignItems: 'center',
    marginVertical: height * 0.02,
    elevation: 5,
  },
  loginButtonText: {
    fontSize: width * 0.05,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  textRow: {
    flexDirection: 'row',
    marginTop: height * 0.04,
  },
  normalText: {
    fontSize: width * 0.035,
    color: '#a9a9a9',
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
    marginTop: height * 0.04,
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
  },
});
