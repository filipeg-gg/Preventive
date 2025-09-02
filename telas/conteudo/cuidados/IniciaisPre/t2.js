import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Image, Text } from 'react-native';

export default function t2({ navigation }) {
  return (
    <ImageBackground
      source={require('../../../../assets/t2.png')}
      style={styles.backgroundImage}
    >

      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('t3')}
        >
          <Text style={styles.buttonText}> Próximo </Text>
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
    marginBottom: 50,
  },
  button: {
    width: 150,
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
