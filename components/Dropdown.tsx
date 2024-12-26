import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Space from './Space';
import { deepEqual } from 'utils/common/deepEqual';

interface DropdownProps<T> {
  items: T[];
  placeholder: string;
  placeholderColor?: string;
  renderItemText: (item: T) => string;
  onItemSelected: (item: T) => void;
  initialSelectedItem?: T; // Propiedad para el elemento inicial
  linkText?: string;
  onLinkPress?: () => void;
}

const Dropdown = <T extends {}>({
  items,
  placeholder,
  placeholderColor,
  renderItemText,
  onItemSelected,
  initialSelectedItem,
  linkText,
  onLinkPress,
}: DropdownProps<T>) => {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [filteredItems, setFilteredItems] = useState<T[]>(items); // Lista filtrada
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownButtonRef = useRef<TouchableOpacity>(null);

  useEffect(() => {
    setSelectedItem(initialSelectedItem);
    setFilteredItems(items?.filter((item) => !deepEqual(item, initialSelectedItem)));
  }, [initialSelectedItem, items]);

  const handleItemPress = (item: T) => {
    setSelectedItem(item);
    setFilteredItems(filteredItems?.filter((filteredItem) => filteredItem !== item)); // Filtra la lista
    setDropdownOpen(false);
    onItemSelected(item);
  };

  const handleOpenDropdown = () => {
    if (dropdownButtonRef.current) {
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
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={handleOpenDropdown}
        ref={dropdownButtonRef}
      >
        <Text style={selectedItem ? styles.dropdownText : { color: placeholderColor ?? styles.placeholder.color }}>
          {selectedItem ? renderItemText(selectedItem) : placeholder}
        </Text>
      </TouchableOpacity>
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
                data={filteredItems} // Usar la lista filtrada
                keyExtractor={(item, index) => `${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleItemPress(item)}
                  >
                    <Text style={styles.dropdownItemText}>{renderItemText(item)}</Text>
                  </TouchableOpacity>
                )}
                ListFooterComponent={
                  linkText ?
                  <TouchableOpacity onPress={onLinkPress} style={styles.linkContainer}>
                    <View style={styles.footerLink}>
                      <Text style={styles.linkText}>{linkText}</Text>
                      <Space horizontal size={10} />
                      <AntDesign name="plus" size={20} color="blue" />
                    </View>
                  </TouchableOpacity>
                  : null
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
    flexDirection: 'row',
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

