import { useGetAllSipmentsQuery } from "@api/shipmentApi";
import Space from "@components/Space";
import { useRouter } from "expo-router";
import { FC } from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";

type TravelPropsT = {}

const Travel: FC<TravelPropsT> = ({}) => {

  // hooks
  const router = useRouter();

  // Api calls
  const { data: shipments } = useGetAllSipmentsQuery({});
  console.log('shipments ', JSON.stringify(shipments))

  return (
    <SafeAreaView>
      <View style={{
        padding: 15
      }}>
        <Text style={{
            fontSize: 45,
            fontWeight: 'condensedBold'
          }}>Viajes</Text>
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

export default Travel;
