import DashboardButton from "@components/DashboardButton";
import Space from "@components/Space";
import { useRouter } from "expo-router";
import { FC } from "react";
import { Pressable, SafeAreaView, Switch, Text, TextInput, View } from "react-native";

type ConfigurationPropsT = {
  navigation: any;
};

const Configuration: FC<ConfigurationPropsT> = ({ navigation }) => {
  // hooks
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          Configuración
        </Text>
        {/* Cambiar contraseña */}
        <Pressable
          onPress={() => router.push("./settings/change-password")}
          style={{
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: "#ddd",
          }}
        >
          <Text style={{ fontSize: 18 }}>Cambiar Contraseña</Text>
        </Pressable>
        {/* Configuraciones Generales */}
        <Pressable
          onPress={() => router.push("./settings/general")}
          style={{
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: "#ddd",
          }}
        >
          <Text style={{ fontSize: 18 }}>Configuraciones Generales</Text>
        </Pressable>
        {/* Habilitar biométricas */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: "#ddd",
          }}
        >
          <Text style={{ fontSize: 18 }}>Habilitar Biométricas</Text>
          <Switch
            value={false}
            onValueChange={(value) => {}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Configuration;
