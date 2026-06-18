import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Test = () => {
  const { width } = Dimensions.get('window');
  return <SafeAreaView style={{ flex: 1 }}></SafeAreaView>;
};

export default Test;
