import React from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import Dropdown from "./Dropdown";
import DropdownSkeleton from "./skeleton/DropdownSkeleton";

type DropdownWrapperProps<T> = {
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  items: T[] | null;
  placeholder: string;
  placeholderColor?: string;
  renderItemText: (item: T) => string;
  onItemSelected: (item: T) => void;
  refetch: () => void;
  initialSelectedItem?: T;
  label?: string;
  isEditable?: boolean;
  linkText?: string;
  onLinkPress?: () => void;
};

const DropdownWrapper = <T,>({
  isLoading,
  isFetching,
  isError,
  items,
  placeholder,
  placeholderColor,
  renderItemText,
  onItemSelected,
  refetch,
  label,
  isEditable = false,
  initialSelectedItem,
  linkText,
  onLinkPress,
}: DropdownWrapperProps<T>) => {
  console.log(">>>>> items:", JSON.stringify(items, null, 2));
  console.log(">>>>> renderItemText:", renderItemText);
  console.log(">>>>> onItemSelected:", onItemSelected);
  console.log(">>>>> isEditable:", isEditable);
  console.log(">>>>> linkText:", linkText);
  console.log(">>>>> initialSelectedItem:", initialSelectedItem);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      {isLoading || isFetching ? (
        <DropdownSkeleton />
      ) : items ? (
        <Dropdown
          items={items}
          placeholder={placeholder}
          renderItemText={renderItemText}
          onItemSelected={onItemSelected}
          isEditable={true}
          placeholderColor={placeholderColor}
          linkText={linkText}
          onLinkPress={onLinkPress}
          initialSelectedItem={initialSelectedItem}
        />
      ) : isError ? (
        <Button
          title="Algo ocurrió, has tap para intentar de nuevo o haz swipe down"
          color="red"
          onPress={refetch}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#71a780",
    marginBottom: 8,
  },
});

export default DropdownWrapper;
