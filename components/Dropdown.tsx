// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
// import AntDesign from '@expo/vector-icons/AntDesign';
// import Space from './Space';
// import { deepEqual } from 'utils/common/deepEqual';

// interface DropdownProps<T> {
//   items: T[];
//   placeholder: string;
//   placeholderColor?: string;
//   renderItemText: (item: T) => string;
//   onItemSelected: (item: T) => void;
//   initialSelectedItem?: T; // Propiedad para el elemento inicial
//   linkText?: string;
//   onLinkPress?: () => void;
// }

// const Dropdown = <T extends {}>({
//   items,
//   placeholder,
//   placeholderColor,
//   renderItemText,
//   onItemSelected,
//   initialSelectedItem,
//   linkText,
//   onLinkPress,
// }: DropdownProps<T>) => {
//   const [selectedItem, setSelectedItem] = useState<T | null>(null);
//   const [filteredItems, setFilteredItems] = useState<T[]>(items); // Lista filtrada
//   const [isDropdownOpen, setDropdownOpen] = useState(false);
//   const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
//   const dropdownButtonRef = useRef<typeof TouchableOpacity>(null);

//   useEffect(() => {
//     setSelectedItem(initialSelectedItem);
//     setFilteredItems(items?.filter((item) => !deepEqual(item, initialSelectedItem)));
//   }, [initialSelectedItem, items]);

//   const handleItemPress = (item: T) => {
//     setSelectedItem(item);
//     setFilteredItems(filteredItems?.filter((filteredItem) => filteredItem !== item)); // Filtra la lista
//     setDropdownOpen(false);
//     onItemSelected(item);
//   };

//   const handleOpenDropdown = () => {
//     if (dropdownButtonRef.current) {
//       dropdownButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
//         setDropdownPosition({ top: pageY + height, left: pageX, width: width });
//       });
//     }
//     setDropdownOpen(true);
//   };

//   const handleCloseDropdown = () => {
//     setDropdownOpen(false);
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={styles.dropdownButton}
//         onPress={handleOpenDropdown}
//         ref={dropdownButtonRef}
//       >
//         <Text style={selectedItem ? styles.dropdownText : { color: placeholderColor ?? styles.placeholder.color }}>
//           {selectedItem ? renderItemText(selectedItem) : placeholder}
//         </Text>
//       </TouchableOpacity>
//       <Modal
//         transparent
//         visible={isDropdownOpen}
//         animationType="fade"
//         onRequestClose={handleCloseDropdown}
//       >
//         <TouchableWithoutFeedback onPress={handleCloseDropdown}>
//           <View style={styles.modalOverlay}>
//             <View
//               style={[
//                 styles.dropdownContainer,
//                 {
//                   top: dropdownPosition.top,
//                   left: dropdownPosition.left,
//                   width: dropdownPosition.width,
//                 },
//               ]}
//             >
//               <FlatList
//                 data={filteredItems} // Usar la lista filtrada
//                 keyExtractor={(item, index) => `${index}`}
//                 renderItem={({ item }) => (
//                   <TouchableOpacity
//                     style={styles.dropdownItem}
//                     onPress={() => handleItemPress(item)}
//                   >
//                     <Text style={styles.dropdownItemText}>{renderItemText(item)}</Text>
//                   </TouchableOpacity>
//                 )}
//                 ListFooterComponent={
//                   linkText ?
//                   <TouchableOpacity onPress={onLinkPress} style={styles.linkContainer}>
//                     <View style={styles.footerLink}>
//                       <Text style={styles.linkText}>{linkText}</Text>
//                       <Space horizontal size={10} />
//                       <AntDesign name="plus" size={20} color="blue" />
//                     </View>
//                   </TouchableOpacity>
//                   : null
//                 }
//               />
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 10,
//   },
//   dropdownButton: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 12,
//     borderRadius: 4,
//     backgroundColor: '#fff',
//   },
//   dropdownText: {
//     fontSize: 16,
//     color: '#000',
//   },
//   dropdownContainer: {
//     position: 'absolute',
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 4,
//     maxHeight: 150,
//     zIndex: 999,
//   },
//   dropdownItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   dropdownItemText: {
//     fontSize: 16,
//   },
//   footerLink: {
//     flexDirection: 'row',
//   },
//   linkContainer: {
//     padding: 15,
//     alignItems: 'center',
//   },
//   linkText: {
//     color: 'blue',
//     fontSize: 16,
//   },
//   placeholder: {
//     color: '#ccc',
//   },
//   modalOverlay: {
//     flex: 1,
//   },
// });

// export default Dropdown;

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, TouchableWithoutFeedback, TextInput } from 'react-native';
import AntDesign from "@react-native-vector-icons/ant-design";
import Space from './Space';
import { deepEqual } from 'utils/common/deepEqual';

interface DropdownProps<T> {
  items: T[];
  placeholder: string;
  placeholderColor?: string;
  renderItemText: (item: T) => string;
  onItemSelected: (item: T) => void;
  initialSelectedItem?: T;
  linkText?: string;
  onLinkPress?: () => void;
  isEditable?: boolean; // Nueva prop para habilitar la escritura
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
  isEditable = false,
}: DropdownProps<T>) => {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [initialSelectedItemS, setInitialSelectedItemS] = useState<T | null>(null);
  const [filteredItems, setFilteredItems] = useState<T[]>(items);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [inputValue, setInputValue] = useState<string>('');
  const [isEditableOpened, setEditableOpened] = useState<boolean>(false);
  const [isFocused, setFocused] = useState<boolean>(false);
  const dropdownButtonRef = useRef<typeof TouchableOpacity>(null);
  const inputRef = useRef<TextInput>(null);

  // Determinar dinámicamente la clave del objeto a partir de la lista inicial de items
  const keyName = useRef<string | null>(
    items?.length > 0 ? Object.keys(items[0]).find((key: T) => renderItemText(items[0]) === items[0][key].toString()) ?? null : null
  );

  useEffect(() => {
    setInitialSelectedItemS(initialSelectedItem ?? null);
  }, [])

  useEffect(() => {
    setSelectedItem(initialSelectedItemS ?? null);
    setFilteredItems(items?.filter((item) => !deepEqual(item, initialSelectedItemS)));
  }, [initialSelectedItemS, items]);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isFocused]);

  const handleItemPress = (item: T) => {
    let filterItemsTemp: T[] = []
    if (initialSelectedItem) {
      filterItemsTemp = items;
    }
    setSelectedItem(item);
    setInitialSelectedItemS(null);
    setFilteredItems(filterItemsTemp?.filter((filteredItem) => filteredItem !== item));
    setDropdownOpen(false);
    setEditableOpened(false);
    setFocused(false);
    setInputValue('');
    onItemSelected(item);
  };

  const handleOpenDropdown = () => {
    if (dropdownButtonRef.current) {
      dropdownButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setDropdownPosition({ top: pageY + height, left: pageX, width: width });
      });
    }
    if (isEditable) {
      setFocused(true);
      setEditableOpened(true);
    }
    setDropdownOpen(true);
  };

  const handleCloseDropdown = () => {
    setDropdownOpen(false);
    setEditableOpened(false);
    setFocused(false);
    if (inputValue) {
      setInputValue(selectedItem?.[keyName?.current] + '')
    }
  };

  const handleNewValueSubmit = () => {
    if (inputValue.trim() && keyName.current) {
      setFocused(false);
      setEditableOpened(false);
      if (selectedItem) {
        setFilteredItems(items);
      }
      const newItem = { [keyName.current]: inputValue.trim() } as T;
      setSelectedItem(newItem);
      onItemSelected(newItem);
      setDropdownOpen(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={handleOpenDropdown}
        ref={dropdownButtonRef}
      >
        {
          isEditable && isEditableOpened 
            ? <TextInput
                ref={inputRef}
                placeholder="Escribe un contenedor"
                value={inputValue}
                onChangeText={setInputValue}
                onSubmitEditing={handleNewValueSubmit}
                returnKeyType="done"
                editable={isEditableOpened}
              />
            : <Text style={selectedItem ? styles.dropdownText : { color: placeholderColor ?? styles.placeholder.color }}>
                {selectedItem ? renderItemText(selectedItem) : placeholder}
              </Text>
        }
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
                data={filteredItems}
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
                  linkText ? (
                    <TouchableOpacity onPress={onLinkPress} style={styles.linkContainer}>
                      <View style={styles.footerLink}>
                        <Text style={styles.linkText}>{linkText}</Text>
                        <Space horizontal size={10} />
                        <AntDesign name="plus" size={20} color="blue" />
                      </View>
                    </TouchableOpacity>
                  ) : null
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
    zIndex: 3,
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
    maxHeight: 200,
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
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 16,
    marginHorizontal: 10,
  },
});

export default Dropdown;
