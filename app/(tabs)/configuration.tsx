import { FC } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Switch, Pressable } from 'react-native';
import { useRouter, Href } from 'expo-router';
import CustomHeader from '@components/CustomHeader';
import Space from '@components/Space';
import IconMapper from '@components/IconMapper';

const Configuration: FC = () => {
  const router = useRouter();

  const options: Array<{ label: string; path: Href; iconName: string }> = [
    {
      label: 'Cambiar Contraseña',
      path: './settings/change-password' as Href,
      iconName: 'lock-outline',
    },
    {
      label: 'Configuraciones Generales',
      path: './settings/general' as Href,
      iconName: 'settings-outline',
    },
    {
      label: 'Notificaciones',
      path: './settings/notifications' as Href,
      iconName: 'notifications-outline',
    },
    {
      label: 'Idioma',
      path: './settings/language' as Href,
      iconName: 'language-outline',
    },
  ];

  const toggleOptions = [
    {
      label: 'Habilitar Biométricas',
      iconName: 'finger-print-outline',
      value: false,
      onToggle: (value: boolean) => {
        console.log('Biométricas:', value);
      },
    },
    {
      label: 'Modo Oscuro',
      iconName: 'moon-outline',
      value: false,
      onToggle: (value: boolean) => {
        console.log('Modo Oscuro:', value);
      },
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 15, flex: 1 }}>
        <CustomHeader title="Configuración" showBackButton={false} />
        <Space vertical size={40} />
        <Text style={styles.sectionTitle}>General</Text>
        <Space vertical size={10} />
        <View>
          {options.map((option, index) => (
            <Pressable key={index} onPress={() => router.push(option.path)} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.iconContainer}>
                  <IconMapper iconName={option.iconName} size={20} color="#fff" />
                </View>
                <View style={styles.column}>
                  <Text style={styles.label}>{option.label}</Text>
                </View>
                <View style={styles.rowButton}>
                  <IconMapper iconName="chevron-right" size={25} color="#fff" />
                </View>
              </View>
            </Pressable>
          ))}
        </View>
        <Space vertical size={20} />
        <Text style={styles.sectionTitle}>Preferencias</Text>
        <Space vertical size={10} />
        <View>
          {toggleOptions.map((option, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.iconContainer}>
                  <IconMapper iconName={option.iconName} size={20} color="#fff" />
                </View>
                <View style={styles.column}>
                  <Text style={styles.label}>{option.label}</Text>
                </View>
                <Switch
                  // value={option.value}
                  // onValueChange={option.onToggle}
                  thumbColor="#fff"
                  trackColor={{ false: '#ddd', true: '#88c69a' }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#525358',
    marginBottom: 10,
  },
});

export default Configuration;
