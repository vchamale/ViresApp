import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Route,
  Contact,
  Users,
  Truck,
  BarChart3,
  Plus,
  ChevronRight,
  LogOut,
} from 'lucide-react-native';
import useLogout from '@hooks/useLogout';
import { useUserName } from '@hooks/useUserName';

const COLORS = {
  green: '#2f7a43',
  greenTintBg: '#f4f8f4',
  greenTintBorder: '#e6efe7',
  avatarBg: '#e8f2ea',
  ink: '#1f2d24',
  inkSoft: '#223a2b',
  muted: '#9aa79f',
  muted2: '#7d8a80',
  white: '#ffffff',
};

const MODULES = [
  { key: 'viajes', label: 'Viajes', path: '/shipment', Icon: Route },
  { key: 'pilotos', label: 'Pilotos', path: '/drivers', Icon: Contact },
  { key: 'clientes', label: 'Clientes', path: '/clients', Icon: Users },
  { key: 'camiones', label: 'Camiones', path: '/vehicles', Icon: Truck },
] as const;

function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');
}

const Home = () => {
  const router = useRouter();
  const name = useUserName();
  const logout = useLogout();

  const userName = name || 'Invitado';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials(userName)}</Text>
            </View>
            <View>
              <Text style={styles.welcome}>Bienvenido,</Text>
              <Text style={styles.userName}>{userName}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.7}>
            <LogOut size={17} color={COLORS.muted2} />
          </TouchableOpacity>
        </View>

        {/* Crear viaje */}
        <TouchableOpacity
          style={styles.crearViaje}
          onPress={() => router.push('/shipments/create/single/create')}
          activeOpacity={0.9}
        >
          <View style={styles.crearViajeIcon}>
            <Plus size={24} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.crearViajeTitle}>Crear viaje</Text>
            <Text style={styles.crearViajeSub}>Registra un nuevo transporte</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.85)" />
        </TouchableOpacity>

        {/* Título sección */}
        <Text style={styles.sectionLabel}>MÓDULOS</Text>

        {/* Cuadrícula 2 columnas */}
        <View style={styles.grid}>
          {MODULES.map(({ key, label, path, Icon }) => (
            <TouchableOpacity
              key={key}
              style={styles.moduleCard}
              onPress={() => router.push(path)}
              activeOpacity={0.85}
            >
              <View style={styles.moduleIconCircle}>
                <Icon size={27} color={COLORS.white} />
              </View>
              <Text style={styles.moduleLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reportes (tarjeta ancha) */}
        <TouchableOpacity
          style={styles.reportCard}
          onPress={() => router.push('/reports')}
          activeOpacity={0.85}
        >
          <View style={styles.reportIconCircle}>
            <BarChart3 size={24} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.reportTitle}>Reportes</Text>
            <Text style={styles.reportSub}>Resumen y estadísticas</Text>
          </View>
          <ChevronRight size={20} color={COLORS.muted} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { color: COLORS.green, fontWeight: '800', fontSize: 16 },
  welcome: { fontSize: 12, color: COLORS.muted },
  userName: { fontSize: 17, fontWeight: '800', color: COLORS.ink },
  logoutBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f2f5f2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  crearViaje: {
    marginTop: 20,
    backgroundColor: COLORS.green,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  crearViajeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  crearViajeTitle: { fontSize: 16, fontWeight: '800', color: COLORS.white },
  crearViajeSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  sectionLabel: {
    fontSize: 12,
    letterSpacing: 1.2,
    color: COLORS.muted,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 14,
    marginLeft: 4,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moduleCard: {
    width: '48%',
    backgroundColor: COLORS.greenTintBg,
    borderWidth: 1,
    borderColor: COLORS.greenTintBorder,
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 14,
  },
  moduleIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  moduleLabel: { fontSize: 14, fontWeight: '700', color: COLORS.inkSoft },

  reportCard: {
    backgroundColor: COLORS.greenTintBg,
    borderWidth: 1,
    borderColor: COLORS.greenTintBorder,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  reportTitle: { fontSize: 15, fontWeight: '700', color: COLORS.inkSoft },
  reportSub: { fontSize: 12, color: COLORS.muted2, marginTop: 2 },
});

export default Home;
