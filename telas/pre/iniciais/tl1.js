import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Text } from 'react-native';

export default function Tl1({ navigation }) {
  return (
    <ImageBackground
      source={require('../../../assets/img1.png')}
      style={styles.backgroundImage}
    >
      {/* Botão Pular */}
      <TouchableOpacity
        style={styles.buttonPul}
        onPress={() => navigation.navigate('Inicial')}
      >
        <Text style={styles.buttonPulText}>Pular</Text>
      </TouchableOpacity>

      {/* Botão Próximo */}
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Tl2')}
        >
          <Text style={styles.buttonText}>Próximo</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
  },
  button: {
    width: 130,
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 45,
    backgroundColor: '#1B0C45',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonPul: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 80,
    height: 35,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  buttonPulText: {
    color: '#1B0C45',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
