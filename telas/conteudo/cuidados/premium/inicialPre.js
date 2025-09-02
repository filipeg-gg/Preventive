import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Image, Text } from 'react-native';

export default function premium({ navigation }) {
  return (
    <ImageBackground
      source={require('../../../../assets/premium.png')}
      style={styles.backgroundImage}
    >

      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('expliPre')}
        >
          <Text style={styles.buttonText}> Próximo </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonPul}
          onPress={() => navigation.navigate('Principal')}
        >
          <Text style={styles.buttonPulText}> Voltar </Text>
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
    alignItems: 'center',
    padding: 10,
    marginBottom: 150,
  },
  button: {
    width: 250,
    height: 45,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B0C45',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonPul: {
    width: 150,
    height: 45,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPulText: {
    color: '#1B0C45',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
