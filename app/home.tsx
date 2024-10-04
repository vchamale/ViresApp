import DashboardButton from "@components/DashboardButton";
import Space from "@components/Space";
import { useRouter } from "expo-router";
import { FC } from "react";
import { Pressable, SafeAreaView, Text, TextInput, View } from "react-native";

type HomePropsT = {
  navigation: any;
};

const Home: FC<HomePropsT> = ({ navigation }) => {
  // hooks
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 15 }}>
        <Space vertical size={10} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View></View>
          <View
            style={{
              marginRight: 10,
            }}
          >
            <Pressable
              onPress={() => {
                router.push("./login/sign-in");
              }}
            >
              <Text
                style={{
                  color: "#5db075",
                  fontSize: 20,
                }}
              >
                Salir
              </Text>
            </Pressable>
          </View>
        </View>
        <Space vertical size={10} />
        <View
          style={{
            width: "100%",
            borderColor: "#ddd9d9eb",
            backgroundColor: "#e7e7e7c2",
            borderWidth: 1.5,
            borderRadius: 25,
          }}
        >
          <TextInput
            style={{
              color: "#2c4778",
              fontWeight: "600",
              fontSize: 15,
              borderColor: "#fff",
              borderWidth: 0,
              padding: 10,
              paddingRight: 0,
            }}
            editable={true}
            onChangeText={(val) => {}}
            value={""}
            placeholder="Buscar"
            placeholderTextColor="#989393"
            keyboardType="default"
          />
        </View>
        <Space vertical size={50} />
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <DashboardButton
            route={"/shipments/shipment"}
            label={"Viajes"}
            icon={"truck"}
          />
          <DashboardButton
            route={"/clients/customer"}
            label={"Clientes"}
            icon={"people"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
