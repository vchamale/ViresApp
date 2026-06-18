import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Space from '@components/Space';
import CustomHeader from '@components/CustomHeader';
import BackgroundView from '@components/BackgroundView';
import { useGetClientByIdQuery } from '@api/clientApi';

// ✅ nuevos hooks
import { useLazyGetOriginsByClientIdQuery } from '@api/originApi';
import { useLazyGetDestinationsByClientIdQuery } from '@api/destinationApi';

type Tab = 'origins' | 'destinations';

const ClientView = () => {
  const { id } = useLocalSearchParams<{ client: any; id: string }>();
  const router = useRouter();

  // cliente
  const { data: client } = useGetClientByIdQuery(id);
  const { name, nit, email, address, contactName, telephone } = client ?? {};

  // ubicaciones
  const [activeTab, setActiveTab] = useState<Tab>('origins');
  const [refreshing, setRefreshing] = useState(false);

  const [triggerOrigins, originsQuery] = useLazyGetOriginsByClientIdQuery();
  const [triggerDestinations, destinationsQuery] = useLazyGetDestinationsByClientIdQuery();

  const loadOrigins = useCallback(
    () => triggerOrigins({ clientId: id as string }),
    [triggerOrigins, id],
  );
  const loadDestinations = useCallback(
    () => triggerDestinations({ clientId: id as string }),
    [triggerDestinations, id],
  );

  // carga inicial solo de la pestaña activa
  useEffect(() => {
    if (activeTab === 'origins') loadOrigins();
    else loadDestinations();
  }, [activeTab, loadOrigins, loadDestinations]);

  const onRefreshLocations = useCallback(() => {
    setRefreshing(true);
    const p = activeTab === 'origins' ? loadOrigins() : loadDestinations();
    Promise.resolve(p).finally(() => setRefreshing(false));
  }, [activeTab, loadDestinations, loadOrigins]);

  const origins = originsQuery.data ?? [];
  const destinations = destinationsQuery.data ?? [];

  const isLocationsLoading =
    (activeTab === 'origins' ? originsQuery.isLoading : destinationsQuery.isLoading) || refreshing;

  const currentList = useMemo(
    () => (activeTab === 'origins' ? origins : destinations),
    [activeTab, origins, destinations],
  );

  const handleEditClient = () => {
    router.push({
      pathname: `/clients/edit/[id]`,
      params: { id, client: JSON.stringify(client) },
    });
  };

  // navegación para crear/editar ubicaciones
  const handleAdd = () => {
    if (activeTab === 'origins') {
      router.push({ pathname: '/origin/create', params: { clientId: id } });
    } else {
      router.push({ pathname: '/destination/create', params: { clientId: id } });
    }
  };

  const handleEditLocation = (id: number, object: any) => {
    if (activeTab === 'origins') {
      router.push({
        pathname: '/origin/edit/[id]',
        params: { origin: JSON.stringify(object), id },
      });
    } else {
      router.push({
        pathname: '/destination/edit/[id]',
        params: { destination: JSON.stringify(object), id },
      });
    }
  };

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
        <Space vertical size={15} />
        <CustomHeader
          title="Cliente"
          color="#fff"
          backgroundColor="#71a780"
          onBackPress={() => router.back()}
          showEditButton={true}
          onEditPress={handleEditClient}
        />
        <Space vertical size={20} />

        {/* Encabezado con nombre (igual que tenías) */}
        <View style={styles.heroCard}>
          <View>
            <Text style={{ color: '#fff' }}>Nombre</Text>
            <Space vertical size={20} />
            <Text style={styles.heroTitle}>{name}</Text>
          </View>
          <View style={{ alignItems: 'center' }} />
        </View>

        <Space vertical size={20} />
        <View style={{ flexDirection: 'row', paddingHorizontal: 0, marginRight: 20 }}>
          <View style={{ width: '50%' }} />
          <View style={{ width: '50%' }}>
            <TouchableOpacity style={styles.createButton} onPress={handleEditClient}>
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Space vertical size={30} />
        <ScrollView
          style={styles.container}
          refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} />}
        >
          {/* Información básica */}
          <View style={styles.card}>
            <View style={[styles.row, { justifyContent: 'space-around' }]}>
              <View>
                <Text style={styles.label}>NIT</Text>
                <Space vertical size={5} />
                <Text style={styles.text}>{nit || 'N/A'}</Text>
              </View>
              <View />
              <View>
                <Text style={styles.label}>Email</Text>
                <Space vertical size={5} />
                <Text style={styles.text}>{email || 'N/A'}</Text>
              </View>
            </View>

            <Space vertical size={10} />
            <View style={{ marginLeft: 22 }}>
              <Text style={styles.label}>Contacto</Text>
              <Space vertical size={5} />
              <Text style={styles.text}>{contactName || 'N/A'}</Text>

              <Space vertical size={10} />
              <View>
                <Text style={styles.label}>No. Teléfono</Text>
                <Space vertical size={5} />
                <Text style={styles.text}>{telephone || 'N/A'}</Text>
              </View>

              <Space vertical size={10} />
              <View>
                <Text style={styles.label}>Dirección</Text>
                <Space vertical size={5} />
                <Text style={styles.text}>{address || 'N/A'}</Text>
              </View>
            </View>
          </View>

          {/* ====== NUEVA SECCIÓN: UBICACIONES ====== */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ubicaciones</Text>
            <View style={styles.segment}>
              <TouchableOpacity
                onPress={() => setActiveTab('origins')}
                style={[styles.segmentBtn, activeTab === 'origins' && styles.segmentBtnActive]}
              >
                <Text
                  style={[styles.segmentText, activeTab === 'origins' && styles.segmentTextActive]}
                >
                  Puntos de partida
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab('destinations')}
                style={[styles.segmentBtn, activeTab === 'destinations' && styles.segmentBtnActive]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    activeTab === 'destinations' && styles.segmentTextActive,
                  ]}
                >
                  Puntos de destino
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            {/* acciones */}
            <View style={[styles.row, { marginBottom: 10 }]}>
              <Text style={[styles.label, { marginLeft: 6 }]}>
                {activeTab === 'origins'
                  ? 'Listado de puntos de partida'
                  : 'Listado de puntos de destino'}
              </Text>
              <TouchableOpacity onPress={handleAdd} style={styles.smallPrimary}>
                <Text style={styles.smallPrimaryText}>
                  {activeTab === 'origins' ? 'Agregar origen' : 'Agregar destino'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* estados */}
            {isLocationsLoading ? (
              <Text style={styles.muted}>Cargando...</Text>
            ) : (activeTab === 'origins' ? originsQuery.isError : destinationsQuery.isError) ? (
              <View>
                <Text style={[styles.muted, { marginBottom: 8 }]}>Ocurrió un error.</Text>
                <TouchableOpacity
                  onPress={onRefreshLocations}
                  style={[styles.smallPrimary, { alignSelf: 'flex-start' }]}
                >
                  <Text style={styles.smallPrimaryText}>Reintentar</Text>
                </TouchableOpacity>
              </View>
            ) : currentList?.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.muted}>No hay registros.</Text>
              </View>
            ) : (
              <View style={{ gap: 10 }}>
                {currentList.map((item: any) => (
                  <View key={item.originId ?? item.destinationId} style={styles.itemRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{item.name}</Text>
                      <Text style={styles.itemSub}>{item.address}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.linkBtn}
                      onPress={() => {
                        handleEditLocation(item.originId ?? item.destinationId, item);
                      }}
                    >
                      <Text style={styles.linkBtnText}>Editar</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* refrescar */}
            <View style={{ marginTop: 12 }}>
              <TouchableOpacity
                onPress={onRefreshLocations}
                style={[styles.secondaryBtn, { alignSelf: 'flex-start' }]}
              >
                <Text style={styles.secondaryBtnText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Space vertical size={40} />
        </ScrollView>
      </SafeAreaView>
    </BackgroundView>
  );
};

export default ClientView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    zIndex: 2,
  },
  heroCard: {
    backgroundColor: '#88c69a',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  heroTitle: { color: '#fff', fontWeight: '900', fontSize: 20 },

  card: {
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontWeight: '700', color: '#5db075', fontSize: 14 },
  text: { fontSize: 14, color: '#333' },

  createButton: {
    backgroundColor: '#2073cdbd',
    paddingVertical: 10,
    borderRadius: 6,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },

  sectionHeader: {
    paddingHorizontal: 4,
    marginBottom: 8,
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#3a3a3a' },

  segment: {
    backgroundColor: '#e9f5ee',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 4,
  },
  segmentBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  segmentBtnActive: { backgroundColor: '#5db075' },
  segmentText: { fontSize: 12, color: '#4b5563', fontWeight: '600' },
  segmentTextActive: { color: '#fff' },

  smallPrimary: {
    backgroundColor: '#2073cdbd',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  smallPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  secondaryBtn: {
    backgroundColor: '#eef6f1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  secondaryBtnText: { color: '#2b6f5f', fontWeight: '700', fontSize: 12 },

  emptyBox: {
    borderWidth: 1,
    borderColor: '#e6efe9',
    borderStyle: 'dashed',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  muted: { color: '#6b7280' },

  itemRow: {
    backgroundColor: '#f7fbf9',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e6efe9',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemTitle: { fontWeight: '700', color: '#1f2937' },
  itemSub: { color: '#6b7280', fontSize: 12 },

  linkBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#dbeeed',
  },
  linkBtnText: { color: '#1e7f76', fontWeight: '700', fontSize: 12 },
});
