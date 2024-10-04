import Space from "@components/Space";
import { useRouter } from "expo-router";
import { FC } from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";

type CustomerPropsT = {
}

const Customer: FC<CustomerPropsT> = ({ }) => {

  // hooks
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{
        padding: 15
      }}>
        <Text style={{
            fontSize: 45,
            fontWeight: 'condensedBold'
          }}>Clientes</Text>
        <Space vertical size={35} />
        <Pressable onPress={() => {
          router.back();
        }}>
          <Text style={{
            color: '#5db075',
            fontSize: 25
          }}>Atras</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
};

export default Customer;
