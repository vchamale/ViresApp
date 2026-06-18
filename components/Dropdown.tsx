// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Modal,
//   TouchableWithoutFeedback,
//   TextInput,
//   LayoutChangeEvent,
//   NativeSyntheticEvent,
//   TextInputSubmitEditingEventData,
//   Platform,
//   KeyboardAvoidingView,
//   Dimensions,
//   Keyboard,
//   TouchableOpacityProps,
// } from 'react-native';
// import AntDesign from '@expo/vector-icons/AntDesign';
// import Space from './Space';
// import { deepEqual } from 'utils/common/deepEqual';

// interface DropdownProps<T> {
//   isDropdown?: boolean;
//   items: T[];
//   placeholder: string;
//   placeholderColor?: string;
//   renderItemText: (item: T) => string;
//   onItemSelected: (item: T) => void;
//   initialSelectedItem?: T;
//   linkText?: string;
//   onLinkPress?: () => void;
//   isEditable?: boolean;
//   /** Para compensar headers/tab bars al evitar el teclado */
//   keyboardVerticalOffset?: number;
// }

// type Position = { top: number; left: number; width: number };

// const SCREEN = Dimensions.get('window');

// const Dropdown = <T extends Record<string, any>>({
//   isDropdown = true,
//   items,
//   placeholder,
//   placeholderColor,
//   renderItemText,
//   onItemSelected,
//   initialSelectedItem,
//   linkText,
//   onLinkPress,
//   isEditable = false,
//   keyboardVerticalOffset = 0,
// }: DropdownProps<T>) => {
//   const [selectedItem, setSelectedItem] = useState<T | null>(null);
//   const [filteredItems, setFilteredItems] = useState<T[]>(items);
//   const [isDropdownOpen, setDropdownOpen] = useState(false);
//   const [dropdownPosition, setDropdownPosition] = useState<Position>({ top: 0, left: 0, width: 0 });
//   const [inputValue, setInputValue] = useState<string>('');
//   const [isEditableOpened, setEditableOpened] = useState<boolean>(false);
//   const [isFocused, setFocused] = useState<boolean>(false);
//   const [keyboardHeight, setKeyboardHeight] = useState(0);

//   const buttonRef = useRef<TouchableOpacityProps | View | null>(null);
//   const inputRef = useRef<TextInput>(null);

//   const inlineEditable = isEditable && !isDropdown;

//   // Deducción de clave para crear item nuevo si escriben
//   const keyName = useMemo(() => {
//     if (!items?.length) return 'value';
//     const sample = items[0] as Record<string, any>;
//     const rendered = renderItemText(items[0]);
//     const found = Object.keys(sample).find((k) => {
//       try {
//         return String(sample[k]) === rendered;
//       } catch {
//         return false;
//       }
//     });
//     return found ?? 'value';
//   }, [items, renderItemText]);

//   // Inicializa seleccionado
//   useEffect(() => {
//     if (initialSelectedItem) {
//       setSelectedItem(initialSelectedItem);
//       setInputValue(renderItemText(initialSelectedItem) ?? '');
//     }
//   }, [initialSelectedItem, renderItemText]);

//   // Lista sin el seleccionado (si aplica)
//   useEffect(() => {
//     setFilteredItems(
//       items?.filter((it) => (selectedItem ? !deepEqual(it, selectedItem) : true)) ?? []
//     );
//   }, [items, selectedItem]);

//   // Foco
//   useEffect(() => {
//     if (isFocused && inputRef.current) {
//       requestAnimationFrame(() => inputRef.current?.focus());
//     }
//   }, [isFocused]);

//   // Keyboard listeners (para modal y/o inline)
//   useEffect(() => {
//     const show = Keyboard.addListener('keyboardDidShow', (e) => {
//       setKeyboardHeight(e.endCoordinates?.height ?? 0);
//     });
//     const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));
//     return () => {
//       show.remove();
//       hide.remove();
//     };
//   }, []);

//   // Medición del botón para posicionar el dropdown
//   const measureButtonInWindow = () => {
//     const node: any = buttonRef.current as any;
//     if (node?.measureInWindow) {
//       node.measureInWindow((x: number, y: number, w: number, h: number) => {
//         setDropdownPosition({ top: y + h, left: x, width: w });
//       });
//     }
//   };

//   const handleButtonLayout = (_e: LayoutChangeEvent) => {};

//   const handleItemPress = (item: T) => {
//     setSelectedItem(item);
//     setEditableOpened(false);
//     setFocused(false);
//     setInputValue(renderItemText(item) ?? '');
//     setDropdownOpen(false);
//     onItemSelected(item);
//   };

//   const handleOpen = () => {
//     if (inlineEditable) {
//       setEditableOpened(true);
//       setFocused(true);
//       return;
//     }
//     measureButtonInWindow();
//     if (isEditable) {
//       setEditableOpened(true);
//       setFocused(true);
//     }
//     setDropdownOpen(true);
//   };

//   const handleClose = () => {
//     setDropdownOpen(false);
//     setEditableOpened(false);
//     setFocused(false);
//     if (!inputValue && selectedItem) {
//       setInputValue(renderItemText(selectedItem) ?? '');
//     }
//   };

//   const handleNewValueSubmit = (
//     _e?: NativeSyntheticEvent<TextInputSubmitEditingEventData>
//   ) => {
//     const val = inputValue.trim();
//     if (!val) {
//       setFocused(false);
//       setEditableOpened(false);
//       setDropdownOpen(false);
//       return;
//     }
//     const newItem = { [keyName]: val } as T;
//     setSelectedItem(newItem);
//     onItemSelected(newItem);
//     setFilteredItems(items);
//     setFocused(false);
//     setEditableOpened(false);
//     setDropdownOpen(false);
//   };

//   // Cálculo de altura disponible para el contenedor del dropdown cuando teclado está visible
//   const availableHeight = SCREEN.height - keyboardHeight - keyboardVerticalOffset - 16; // 16px margen
//   const computedMaxHeight = Math.min(260, Math.max(160, availableHeight)); // límite razonable

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.select({ ios: 'padding', android: 'height' })}
//       keyboardVerticalOffset={keyboardVerticalOffset}
//     >
//       <View style={styles.container}>
//         {/* BOTÓN / INLINE EDITABLE */}
//         {inlineEditable ? (
//           isEditableOpened ? (
//             <View style={styles.dropdownButton} onLayout={handleButtonLayout}>
//               <TextInput
//                 ref={inputRef}
//                 style={styles.input}
//                 placeholder={placeholder}
//                 value={inputValue}
//                 onChangeText={setInputValue}
//                 onSubmitEditing={handleNewValueSubmit}
//                 returnKeyType="done"
//                 autoFocus
//               />
//             </View>
//           ) : (
//             <TouchableOpacity
//               ref={buttonRef as any}
//               style={styles.dropdownButton}
//               onPress={handleOpen}
//               onLayout={handleButtonLayout}
//             >
//               <Text
//                 style={
//                   selectedItem
//                     ? styles.dropdownText
//                     : { color: placeholderColor ?? styles.placeholder.color }
//                 }
//               >
//                 {selectedItem ? renderItemText(selectedItem) : placeholder}
//               </Text>
//             </TouchableOpacity>
//           )
//         ) : (
//           // MODO DROPDOWN CON MODAL
//           <TouchableOpacity
//             ref={buttonRef as any}
//             style={styles.dropdownButton}
//             onPress={handleOpen}
//             onLayout={handleButtonLayout}
//           >
//             <Text
//               style={
//                 selectedItem
//                   ? styles.dropdownText
//                   : { color: placeholderColor ?? styles.placeholder.color }
//               }
//             >
//               {selectedItem ? renderItemText(selectedItem) : placeholder}
//             </Text>
//           </TouchableOpacity>
//         )}

//         {/* MODAL SOLO CUANDO isDropdown === true */}
//         {isDropdown && (
//           <Modal
//             transparent
//             visible={isDropdownOpen}
//             animationType="fade"
//             onRequestClose={handleClose}
//             presentationStyle="overFullScreen"
//           >
//             {/* El KAV aquí asegura que el contenedor se mueva por encima del teclado */}
//             <KeyboardAvoidingView
//               behavior={Platform.select({ ios: 'padding', android: 'height' })}
//               keyboardVerticalOffset={keyboardVerticalOffset}
//               style={styles.modalOverlay}
//             >
//               {/* Backdrop */}
//               <TouchableWithoutFeedback onPress={handleClose}>
//                 <View style={styles.backdrop} />
//               </TouchableWithoutFeedback>

//               {/* Contenedor del dropdown (no cierra al tocar dentro) */}
//               <View
//                 style={[
//                   styles.dropdownContainer,
//                   {
//                     top: dropdownPosition.top,
//                     left: dropdownPosition.left,
//                     width: dropdownPosition.width,
//                     maxHeight: computedMaxHeight, // asegura que el contenido quepa sobre el teclado
//                   },
//                 ]}
//               >
//                 {isEditable && (
//                   <TextInput
//                     ref={inputRef}
//                     style={styles.input}
//                     placeholder={placeholder}
//                     value={inputValue}
//                     onChangeText={setInputValue}
//                     onSubmitEditing={handleNewValueSubmit}
//                     returnKeyType="done"
//                     autoFocus
//                   />
//                 )}

//                 <FlatList
//                   data={filteredItems}
//                   keyExtractor={(_, index) => `${index}`}
//                   keyboardShouldPersistTaps="handled"
//                   renderItem={({ item }) => (
//                     <TouchableOpacity
//                       style={styles.dropdownItem}
//                       onPress={() => handleItemPress(item)}
//                     >
//                       <Text style={styles.dropdownItemText}>{renderItemText(item)}</Text>
//                     </TouchableOpacity>
//                   )}
//                   ListFooterComponent={
//                     linkText ? (
//                       <TouchableOpacity onPress={onLinkPress} style={styles.linkContainer}>
//                         <View style={styles.footerLink}>
//                           <Text style={styles.linkText}>{linkText}</Text>
//                           <Space horizontal size={10} />
//                           <AntDesign name="plus" size={20} />
//                         </View>
//                       </TouchableOpacity>
//                     ) : null
//                   }
//                 />
//               </View>
//             </KeyboardAvoidingView>
//           </Modal>
//         )}
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 10,
//   },
//   dropdownButton: {
//     zIndex: 3,
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
//   placeholder: {
//     color: '#999',
//   },
//   modalOverlay: {
//     flex: 1,
//   },
//   backdrop: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   dropdownContainer: {
//     position: 'absolute',
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 4,
//     maxHeight: 260,
//     zIndex: 999,
//     paddingTop: 8,
//   },
//   dropdownItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
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
//   /** Input compacto, misma altura visual que el texto dentro del botón */
//   input: {
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//     paddingHorizontal: 0,
//     paddingVertical: 0, // clave para no crecer
//     height: 20,         // altura fija compacta
//     lineHeight: 20,
//     fontSize: 16,
//     marginHorizontal: 10,
//     marginBottom: 6,
//     ...(Platform.OS === 'android'
//       ? { textAlignVertical: 'center' as const, includeFontPadding: false as any }
//       : {}),
//   },
// });

// export default Dropdown;

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  Keyboard,
  TouchableOpacityProps,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Space from './Space';
import { deepEqual } from 'utils/common/deepEqual';

interface DropdownProps<T> {
  isDropdown?: boolean;
  items: T[];
  placeholder: string;
  placeholderColor?: string;
  renderItemText: (item: T) => string;
  onItemSelected: (item: T) => void;
  initialSelectedItem?: T;
  linkText?: string;
  onLinkPress?: () => void;
  isEditable?: boolean;
  /** Para compensar headers/tab bars al evitar el teclado */
  keyboardVerticalOffset?: number;
  /** Callback cuando se presiona Enter y isDropdown === false */
  onEnterValue?: (value: string) => void;
}

type Position = { top: number; left: number; width: number };

const SCREEN = Dimensions.get('window');

const Dropdown = <T extends Record<string, any>>({
  isDropdown = true,
  items,
  placeholder,
  placeholderColor,
  renderItemText,
  onItemSelected,
  initialSelectedItem,
  linkText,
  onLinkPress,
  isEditable = false,
  keyboardVerticalOffset = 0,
  onEnterValue,
}: DropdownProps<T>) => {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [filteredItems, setFilteredItems] = useState<T[]>(items);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<Position>({ top: 0, left: 0, width: 0 });
  const [inputValue, setInputValue] = useState<string>('');
  const [isEditableOpened, setEditableOpened] = useState<boolean>(false);
  const [isFocused, setFocused] = useState<boolean>(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const buttonRef = useRef<TouchableOpacityProps | View | null>(null);
  const inputRef = useRef<TextInput>(null);

  const inlineEditable = isEditable && !isDropdown;

  // Deducción de clave para crear item nuevo si escriben
  const keyName = useMemo(() => {
    if (!items?.length) return 'value';
    const sample = items[0] as Record<string, any>;
    const rendered = renderItemText(items[0]);
    const found = Object.keys(sample).find((k) => {
      try {
        return String(sample[k]) === rendered;
      } catch {
        return false;
      }
    });
    return found ?? 'value';
  }, [items, renderItemText]);

  // Inicializa seleccionado
  useEffect(() => {
    if (initialSelectedItem) {
      setSelectedItem(initialSelectedItem);
      setInputValue(renderItemText(initialSelectedItem) ?? '');
    }
  }, [initialSelectedItem, renderItemText]);

  // Lista sin el seleccionado (si aplica)
  useEffect(() => {
    setFilteredItems(
      items?.filter((it) => (selectedItem ? !deepEqual(it, selectedItem) : true)) ?? [],
    );
  }, [items, selectedItem]);

  // Foco
  useEffect(() => {
    if (isFocused && inputRef.current) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isFocused]);

  // Keyboard listeners (para modal y/o inline)
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates?.height ?? 0);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // Medición del botón para posicionar el dropdown
  const measureButtonInWindow = () => {
    const node: any = buttonRef.current as any;
    if (node?.measureInWindow) {
      node.measureInWindow((x: number, y: number, w: number, h: number) => {
        setDropdownPosition({ top: y + h, left: x, width: w });
      });
    }
  };

  const handleButtonLayout = (_e: LayoutChangeEvent) => {};

  const handleItemPress = (item: T) => {
    setSelectedItem(item);
    setEditableOpened(false);
    setFocused(false);
    setInputValue(renderItemText(item) ?? '');
    setDropdownOpen(false);
    onItemSelected(item);
  };

  const handleOpen = () => {
    if (inlineEditable) {
      setEditableOpened(true);
      setFocused(true);
      return;
    }
    measureButtonInWindow();
    if (isEditable) {
      setEditableOpened(true);
      setFocused(true);
    }
    setDropdownOpen(true);
  };

  const handleClose = () => {
    setDropdownOpen(false);
    setEditableOpened(false);
    setFocused(false);
    if (!inputValue && selectedItem) {
      setInputValue(renderItemText(selectedItem) ?? '');
    }
  };

  const handleNewValueSubmit = (_e?: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    const val = inputValue.trim();
    if (!val) {
      setFocused(false);
      setEditableOpened(false);
      setDropdownOpen(false);
      return;
    }

    // Si no es dropdown, dispara el callback externo y termina
    if (!isDropdown && onEnterValue) {
      onEnterValue(val);
      setFocused(false);
      setEditableOpened(false);
      return;
    }

    // Flujo normal (dropdown o inline editable con creación de item)
    const newItem = { [keyName]: val } as T;
    setSelectedItem(newItem);
    onItemSelected(newItem);
    setFilteredItems(items);
    setFocused(false);
    setEditableOpened(false);
    setDropdownOpen(false);
  };

  // Cálculo de altura disponible para el contenedor del dropdown cuando teclado está visible
  const availableHeight = SCREEN.height - keyboardHeight - keyboardVerticalOffset - 16; // 16px margen
  const computedMaxHeight = Math.min(260, Math.max(160, availableHeight)); // límite razonable

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: 'height' })}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={styles.container}>
        {/* BOTÓN / INLINE EDITABLE */}
        {inlineEditable ? (
          isEditableOpened ? (
            <View style={styles.dropdownButton} onLayout={handleButtonLayout}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder={placeholder}
                value={inputValue}
                onChangeText={setInputValue}
                onSubmitEditing={handleNewValueSubmit}
                returnKeyType="done"
                autoFocus
              />
            </View>
          ) : (
            <TouchableOpacity
              ref={buttonRef as any}
              style={styles.dropdownButton}
              onPress={handleOpen}
              onLayout={handleButtonLayout}
            >
              <Text
                style={
                  selectedItem
                    ? styles.dropdownText
                    : { color: placeholderColor ?? styles.placeholder.color }
                }
              >
                {selectedItem ? renderItemText(selectedItem) : placeholder}
              </Text>
            </TouchableOpacity>
          )
        ) : (
          // MODO BOTÓN (si isDropdown === true abre modal; si es false solo abre inline editable si isEditable)
          <TouchableOpacity
            ref={buttonRef as any}
            style={styles.dropdownButton}
            onPress={handleOpen}
            onLayout={handleButtonLayout}
          >
            <Text
              style={
                selectedItem
                  ? styles.dropdownText
                  : { color: placeholderColor ?? styles.placeholder.color }
              }
            >
              {selectedItem ? renderItemText(selectedItem) : placeholder}
            </Text>
          </TouchableOpacity>
        )}

        {/* MODAL SOLO CUANDO isDropdown === true */}
        {isDropdown && (
          <Modal
            transparent
            visible={isDropdownOpen}
            animationType="fade"
            onRequestClose={handleClose}
            presentationStyle="overFullScreen"
          >
            {/* El KAV aquí asegura que el contenedor se mueva por encima del teclado */}
            <KeyboardAvoidingView
              behavior={Platform.select({ ios: 'padding', android: 'height' })}
              keyboardVerticalOffset={keyboardVerticalOffset}
              style={styles.modalOverlay}
            >
              {/* Backdrop */}
              <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.backdrop} />
              </TouchableWithoutFeedback>

              {/* Contenedor del dropdown (no cierra al tocar dentro) */}
              <View
                style={[
                  styles.dropdownContainer,
                  {
                    top: dropdownPosition.top,
                    left: dropdownPosition.left,
                    width: dropdownPosition.width,
                    maxHeight: computedMaxHeight, // asegura que el contenido quepa sobre el teclado
                  },
                ]}
              >
                {isEditable && (
                  <TextInput
                    ref={inputRef}
                    style={styles.input}
                    placeholder={placeholder}
                    value={inputValue}
                    onChangeText={setInputValue}
                    onSubmitEditing={handleNewValueSubmit}
                    returnKeyType="done"
                    autoFocus
                  />
                )}

                <FlatList
                  data={filteredItems}
                  keyExtractor={(_, index) => `${index}`}
                  keyboardShouldPersistTaps="handled"
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
                          <AntDesign name="plus" size={20} />
                        </View>
                      </TouchableOpacity>
                    ) : null
                  }
                />
              </View>
            </KeyboardAvoidingView>
          </Modal>
        )}
      </View>
    </KeyboardAvoidingView>
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
  placeholder: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    maxHeight: 260,
    zIndex: 999,
    paddingTop: 8,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  /** Input compacto, misma altura visual que el texto dentro del botón */
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 0,
    paddingVertical: 0, // clave para no crecer
    height: 20, // altura fija compacta
    lineHeight: 20,
    fontSize: 16,
    marginHorizontal: 10,
    marginBottom: 6,
    ...(Platform.OS === 'android'
      ? { textAlignVertical: 'center' as const, includeFontPadding: false as any }
      : {}),
  },
});

export default Dropdown;
