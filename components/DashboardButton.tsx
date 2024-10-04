import React from "react";
import { Pressable, Text, View } from "react-native";
import Space from "./Space";
import { Href, Router, useRouter } from "expo-router";
import IconMapper from "./IconMapper";

interface DashboardButtonProps {
  label: string;
  route: Href<string | object>;
  icon: string;
}

const DashboardButton = ({ label, route, icon }: DashboardButtonProps) => {
  const router = useRouter();
  return (
    <View
      style={{
        width: "45%",
        marginLeft: 10,
        marginRight: 5,
      }}
    >
      <Pressable
        onPress={() => {
          router.push(route);
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "column",
            }}
          >
            <View
              style={{
                backgroundColor: "#5db075",
                padding: 32,
                borderRadius: 8,
              }}
            >
              <View>
                <IconMapper iconName={icon} size={64} />
              </View>
            </View>
            <Space vertical size={10} />
            <Text style={{ textAlign: "center", color: "#5db075" }}>
              {label}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default DashboardButton;
