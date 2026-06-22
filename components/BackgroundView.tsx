import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const BackgroundView = ({ children }: { children: React.ReactNode }) => {
  const { width } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
        {/* Banda de marca compacta: línea recta justo debajo del header,
            en vez del bloque de ~425px que antes ocupaba media pantalla. */}
        <Path
          d={`M0,0
              L0,120
              L${width},120
              L${width},0
              Z`}
          fill="#71a780"
        />
      </Svg>
      {children}
    </View>
  );
};

export default BackgroundView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
