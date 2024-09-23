import { Text, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';


const LoadingDots = () => {
    const [dotIndex, setDotIndex] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setDotIndex((prevIndex) => (prevIndex + 1) % 4);
      }, 500); // Change dot every 500ms
  
      return () => clearInterval(interval);
    }, []);
  
    const dots = ['.', '..', '...', ''];
  
    return (
        <Text style={styles.loadingText}>Way too lazy to load {dots[dotIndex]}</Text>
    );
  };


function LoadingPage() {
    return (
        <Spinner
            visible={true}
            animation='fade'
            customIndicator={<LoadingDots />}
        />
    );
}

const styles = StyleSheet.create({
    loadingText: {
        fontSize: 18,
        color: 'white',
    },

    spinnerTextStyle: {
    color: 'white'
    },

});

export default LoadingPage