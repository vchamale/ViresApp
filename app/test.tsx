import { Dimensions, SafeAreaView, StyleSheet, View } from "react-native";
import Svg, { Path } from 'react-native-svg'

const Test = () => {
  const { width } = Dimensions.get("window");
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
        <Path
          d={`M0,0 
            L0,188
            C29,356,${width / 1.1},150,${width},379
            L${width},0
            Z`}
          fill="#5db075"
        />
      </Svg>
    </SafeAreaView>
  )
}

export default Test;
