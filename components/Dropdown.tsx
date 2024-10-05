// R/RN
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
// Expo
import AntDesign from '@expo/vector-icons/AntDesign';
import Space from './Space';

interface DropdownProps<T> {
  items: T[];
  placeholder: string;
  placeholderColor?: string;
  renderItemText: (item: T) => string;
  onItemSelected: (item: T) => void;
  linkText: string;
  onLinkPress: () => void;
}

const Dropdown = <T extends { id: number }>({
  items,
  placeholder,
  placeholderColor,
  renderItemText,
  onItemSelected,
  linkText,
  onLinkPress,
}: DropdownProps<T>) => {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownButtonRef = useRef<View>(null); // Referencia para medir la posición del botón

  const handleItemPress = (item: T) => {
    setSelectedItem(item);
    setDropdownOpen(false);
    onItemSelected(item);
  };

  const handleOpenDropdown = () => {
    if (dropdownButtonRef.current) {
      // Mide la posición del botón del dropdown
      dropdownButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setDropdownPosition({ top: pageY + height, left: pageX, width: width });
      });
    }
    setDropdownOpen(true);
  };

  const handleCloseDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Botón del dropdown */}
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={handleOpenDropdown}
        ref={dropdownButtonRef} // Asignamos la referencia al botón
      >
        <Text style={selectedItem ? styles.dropdownText : styles.placeholder}>
          {selectedItem ? renderItemText(selectedItem) : placeholder}
        </Text>
      </TouchableOpacity>

      {/* Modal que se abre en la posición medida del botón */}
      <Modal
        transparent
        visible={isDropdownOpen}
        animationType="fade"
        onRequestClose={handleCloseDropdown}
      >
        <TouchableWithoutFeedback onPress={handleCloseDropdown}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.dropdownContainer,
                {
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                  width: dropdownPosition.width,
                },
              ]}
            >
              <FlatList
                data={items}
                keyExtractor={(item) => item?.id?.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleItemPress(item)}
                  >
                    <Text style={styles.dropdownItemText}>{renderItemText(item)}</Text>
                  </TouchableOpacity>
                )}
                ListFooterComponent={
                  <TouchableOpacity onPress={onLinkPress} style={styles.linkContainer}>
                    <View style={styles.footerLink}>
                      <Text style={styles.linkText}>{linkText}</Text>
                      <Space horizontal size={10} />
                      <AntDesign name="plus" size={20} color="blue" />
                    </View>
                  </TouchableOpacity>
                }
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    maxHeight: 150,
    zIndex: 999,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  footerLink: {
    flexDirection: 'row'
  },
  linkContainer: {
    padding: 15,
    alignItems: 'center',
  },
  linkText: {
    color: 'blue',
    fontSize: 16,
  },
  placeholder: {
    color: '#ccc',
  },
  modalOverlay: {
    flex: 1,
  },
});

export default Dropdown;
