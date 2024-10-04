import React from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";

type IconData = {
  library: "FontAwesome5" | "Ionicons";
  name: string;
};

const iconMap: IconData[] = [
  { library: "FontAwesome5", name: "truck" },
  { library: "Ionicons", name: "people" },
];

interface IconMapperProps {
  iconName: string;
  size?: number;
}

const IconMapper: React.FC<IconMapperProps> = ({ iconName, size = 20 }) => {
  const iconData = iconMap.find((icon) => icon.name === iconName);

  if (!iconData) {
    return null;
  }

  return (
    <>
      {iconData.library === "FontAwesome5" ? (
        <FontAwesome5 name={iconData.name} color="white" size={size} />
      ) : (
        <Ionicons name={iconData.name} color="white" size={size} />
      )}
    </>
  );
};

export default IconMapper;
