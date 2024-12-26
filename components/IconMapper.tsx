import React from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from '@expo/vector-icons/Octicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Fontisto from '@expo/vector-icons/Fontisto';
import { AntDesign } from "@expo/vector-icons";

type IconData = {
  library: "FontAwesome" | "FontAwesome5" | "FontAwesome6" | "Ionicons" | "Octicons" | "Fontisto" | "MaterialIcons" | "MaterialCommunityIcons" | "AntDesign";
  name: string;
};

const iconMap: IconData[] = [
  { library: "FontAwesome", name: "drivers-license-o" },
  { library: "FontAwesome5", name: "truck" },
  { library: "FontAwesome5", name: "tools" },
  { library: "FontAwesome5", name: "truck-moving" },
  { library: "FontAwesome5", name: "location-arrow" },
  { library: "FontAwesome5", name: "shipping-fast" }, // shipment status
  { library: "FontAwesome5", name: "receipt" }, // shipment status
  { library: "FontAwesome5", name: "truck-loading" }, // shipment status
  { library: "FontAwesome6", name: "drivers-license" },
  { library: "FontAwesome6", name: "map-location" },
  { library: "FontAwesome6", name: "person-circle-plus" },
  { library: "FontAwesome6", name: "road-circle-check" }, // shipment status
  { library: "Ionicons", name: "people" },
  { library: "Ionicons", name: "create-sharp" }, // shipment status
  { library: "Ionicons", name: "warning" }, // shipment status
  { library: "Ionicons", name: "free-cancellation" }, // shipment status
  { library: "Ionicons", name: "document-text-outline" }, // management option
  { library: "MaterialCommunityIcons", name: "truck-check" }, // shipment status
  { library: "MaterialCommunityIcons", name: "truck-delivery" }, // shipment status
  { library: "MaterialCommunityIcons", name: "map-marker-outline" }, // management option
  { library: "MaterialCommunityIcons", name: "chevron-right" }, // management option
  { library: "MaterialCommunityIcons", name: "truck-outline" }, // management option
  { library: "MaterialIcons", name: "cancel" }, // shipment status
  { library: "MaterialIcons", name: "delete" }, // shipment status
  { library: "Octicons", name: "container" },
  { library: "Octicons", name: "calendar" },
  { library: "Fontisto", name: "map" },
  { library: "AntDesign", name: "user" },
];

const iconLib = {
  'FontAwesome': (name: string, size: number, color: string) => <FontAwesome name={name} color={color} size={size} />,
  'FontAwesome5': (name: string, size: number, color: string) => <FontAwesome5 name={name} color={color} size={size} />,
  'FontAwesome6': (name: string, size: number, color: string) => <FontAwesome6 name={name} color={color} size={size} />,
  'MaterialIcons': (name: string, size: number, color: string) => <MaterialIcons name={name} color={color} size={size} />,
  'MaterialCommunityIcons': (name: string, size: number, color: string) => <MaterialCommunityIcons name={name} color={color} size={size} />,
  'Ionicons': (name: string, size: number, color: string) => <Ionicons name={name} color={color} size={size} />,
  'Fontisto': (name: string, size: number, color: string) => <Fontisto name={name} color={color} size={size} />,
  'AntDesign': (name: string, size: number, color: string) => <AntDesign name={name} color={color} size={size} />,
  'Octicons': (name: string, size: number, color: string) => <Octicons name={name} color={color} size={size} />
}

interface IconMapperProps {
  iconName: string;
  size?: number;
  color?: string;
}

const IconMapper: React.FC<IconMapperProps> = ({ iconName, size = 20, color = 'white' }) => {
  const iconData = iconMap.find((icon) => icon.name === iconName);
  if (!iconData) {
    return null;
  }

  return (
    <>
      {iconLib[iconData.library](iconData.name, size, color)}
    </>
  );
};

export default IconMapper;
