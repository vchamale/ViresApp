import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, View, StyleSheet, TextStyle } from 'react-native';

type AnimatedTextProps = {
  children: string;
  size: number;
  textSize: number;
  fontSize?: number;
  style?: TextStyle;
  speed?: number;
};

const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  size,
  textSize,
  style,
  fontSize = 16,
  speed = 20,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textWidth > 0) {
      const animationDuration = ((textWidth + size) / speed) * 1000; // Duración en ms
      Animated.loop(
        Animated.timing(translateX, {
          toValue: -textWidth + size,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ).start();
    }
  }, [textWidth, size, speed]);

  return (
    <View style={[styles.container, { width: size }]}>
      <Animated.View
        style={{
          transform: [{ translateX }],
        }}
      >
        <Text
          style={[styles.text, { fontSize, width: textSize }, style]}
          onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)} // Obtén el ancho del texto
        >
          {children}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden', // Oculta texto que desborde el contenedor
    justifyContent: 'center',
  },
  text: {
    textAlign: 'left', // Asegura que el texto comience desde la izquierda
  },
});

export default AnimatedText;
