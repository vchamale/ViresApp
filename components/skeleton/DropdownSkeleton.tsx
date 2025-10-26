import { View } from 'react-native';
import SkeletonLoading from 'expo-skeleton-loading';

const DropdownSkeleton = () => {
  return (
    // <SkeletonLoading background={"#adadad"} highlight={"#ffffff"}>
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: '#adadad', width: '100%', height: 40, borderRadius: 5 }} />
    </View>
    // </SkeletonLoading>
  );
};

export default DropdownSkeleton;
