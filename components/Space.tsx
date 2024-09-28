import { FC } from "react";
import { View } from "react-native";

type SpaceT =
  | { vertical: true; horizontal?: false; size: number }
  | { vertical?: false; horizontal: true; size: number }
  | { vertical?: false; horizontal?: false; size: number };


const Space: FC<SpaceT> = ({ vertical = false, horizontal = false, size  }) => {
  return (
    <View style={{
      height: vertical ? size : 0,
      width: horizontal ? size : 0
    }} />
  )
};

export default Space;
