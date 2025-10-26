import { FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, Href } from 'expo-router';
import IconMapper from '@components/IconMapper';

interface MenuOption {
  label: string;
  path: Href;
  size: number;
  iconName: string;
}

interface MenuOptionsListProps {
  options: MenuOption[];
}

const MenuOptionsList: FC<MenuOptionsListProps> = ({ options }) => {
  const router = useRouter();

  return (
    <View>
      {options.map((option, index) => (
        <View key={index} style={styles.card}>
          <Pressable
            onPress={() => {
              router.push(option.path);
            }}
          >
            <View style={styles.row}>
              <View style={styles.iconContainer}>
                <IconMapper iconName={option.iconName} size={option.size} color="#fff" />
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>{option.label}</Text>
              </View>
              <View style={styles.rowButton}>
                <IconMapper iconName="chevron-right" size={25} color="#fff" />
              </View>
            </View>
          </Pressable>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#88c69ad4',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    padding: 15,
    marginVertical: 5,
  },
  column: {
    flexDirection: 'column',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  iconContainer: {
    alignContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  label: {
    fontWeight: '700',
    color: '#fff',
    fontSize: 16,
  },
});

export default MenuOptionsList;
