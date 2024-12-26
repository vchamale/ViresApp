import { Dimensions, SafeAreaView } from "react-native";

const Test = () => {
  const { width } = Dimensions.get("window");
  return (
    <SafeAreaView style={{ flex: 1 }}>
    </SafeAreaView>
  )
}

export default Test;
