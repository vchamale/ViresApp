import React, { useEffect, useMemo, useState } from 'react'
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet, Pressable } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import BackgroundView from '@components/BackgroundView'
import CustomHeader from '@components/CustomHeader'
import Space from '@components/Space'
import Dropdown from '@components/Dropdown'
import CustomAlert from '@components/CustomAlert'
import CurrencyInput from 'react-native-currency-input'

import {
  useGetShipmentByIdQuery,
  useUpdateShipmentMutation,
} from '@api/shipmentApi'
import { useGetAllShipmentsStatusQuery } from '@api/shipmentStatusApi'
import { useGetAllOriginsQuery } from '@api/originApi'
import { useGetAllDestinationsQuery } from '@api/destinationApi'
import { useGetAllTrucksQuery } from '@api/truckApi'
import { useGetAllDriversQuery } from '@api/driverApi'

const NumNonNeg = z
  .preprocess((v) => (v === '' || v === null || v === undefined ? undefined : v), z.coerce.number())
  // Asegura que sea número válido (no NaN)
  .refine((v): v is number => typeof v === 'number' && !Number.isNaN(v), 'Requerido')
  // Asegura no-negativo
  .refine((v) => v >= 0, 'Requerido')

const Schema = z.object({
  containerNumber: z.string().min(1),
  shipmentStatusId: NumNonNeg,
  originId: NumNonNeg,
  destinationId: NumNonNeg,
  truckId: NumNonNeg,
  driverUserId: z
    .preprocess((v) => (v === '' ? null : v), z.coerce.number())
    .refine((v) => typeof v === 'number' && !Number.isNaN(v), 'Inválido')
    .nullable()
    .optional(),
  weight: NumNonNeg,
  price: NumNonNeg,
})

type FormValues = z.infer<typeof Schema>

export default function EditShipment() {
  const { id, snapshot } = useLocalSearchParams<{ id: string; snapshot?: string }>()
  const router = useRouter()
  const [isAlertVisible, setAlertVisible] = useState(false)

  // Snapshot opcional para defaults instantáneos
  const initialFromSnapshot = useMemo(() => {
    try { return snapshot ? JSON.parse(snapshot) : undefined } catch { return undefined }
  }, [snapshot])

  // Datos canónicos
  const { data } = useGetShipmentByIdQuery(Number(id), {
    selectFromResult: (res) => res,
    refetchOnMountOrArgChange: true,
  })

  const { data: statuses } = useGetAllShipmentsStatusQuery({})
  const clientId = data?.clientId ?? initialFromSnapshot?.clientId
  const { data: origins } = useGetAllOriginsQuery({ clientId }, { skip: !clientId })
  const { data: destinations } = useGetAllDestinationsQuery({ clientId }, { skip: !clientId })
  const { data: trucks } = useGetAllTrucksQuery({})
  const { data: drivers } = useGetAllDriversQuery({})

  // Form
  const { control, handleSubmit, reset, formState: { isDirty, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      containerNumber: initialFromSnapshot?.container?.containerNumber ?? '',
      shipmentStatusId: initialFromSnapshot?.shipmentStatusId ?? undefined,
      originId: initialFromSnapshot?.originId ?? undefined,
      destinationId: initialFromSnapshot?.destinationId ?? undefined,
      truckId: initialFromSnapshot?.truckId ?? undefined,
      driverUserId: initialFromSnapshot?.user?.userId ?? null,
      weight: initialFromSnapshot?.weight ?? 0,
      price: initialFromSnapshot?.price ?? 0,
    },
  })

  useEffect(() => {
    if (!data) return
    reset({
      containerNumber: data.container?.containerNumber ?? '',
      shipmentStatusId: data.shipmentStatusId,
      originId: data.originId,
      destinationId: data.destinationId,
      truckId: data.truckId,
      driverUserId: data.user?.userId ?? null,
      weight: data.weight ?? 0,
      price: data.price ?? 0,
    })
  }, [data, reset])

  const [updateShipment] = useUpdateShipmentMutation()

  const onSubmit = async (values: FormValues) => {
    const dto = {
      containerNumber: values.containerNumber.trim(),
      weight: values.weight,
      price: values.price,
      shipmentStatus: values.shipmentStatusId,
      origin: values.originId,
      destination: values.destinationId,
      driver: values.driverUserId ?? undefined,
      truck: values.truckId,
    }
    await updateShipment({ id: Number(id), body: dto }).unwrap()
    setAlertVisible(false)
    router.back()
  }

  // Primero validamos con RHF y si pasa abrimos el modal de confirmación
  const attemptSubmit = handleSubmit(() => setAlertVisible(true))

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
        <Space vertical size={15} />
        <CustomHeader
          title="Editar Envío"
          backgroundColor="#71a780"
          color="#fff"
          onBackPress={() => router.back()}
        />

        {/* Confirmación */}
        <CustomAlert
          isVisible={isAlertVisible}
          title="¿Estás seguro de modificar?"
          titleColor="#ff0809bd"
          text="Estás a punto de modificar este viaje, ¿deseas continuar?"
          onClose={() => setAlertVisible(false)}
          buttons={[
            <Pressable key="cancel" onPress={() => setAlertVisible(false)}>
              <View style={styles.cancelButtonAlert}>
                <Text style={styles.cancelButtonTextAlert}>Cancelar</Text>
              </View>
            </Pressable>,
            <Pressable key="ok" onPress={handleSubmit(onSubmit)}>
              <View style={styles.continueButtonAlert}>
                <Text style={styles.continueButtonTextAlert}>Modificar</Text>
              </View>
            </Pressable>,
          ]}
        />

        <Space vertical size={50} />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <MaterialCommunityIcons name="file-document-edit" size={150} color="#fff" />
        </View>
        <Space vertical size={120} />

        <ScrollView style={styles.container}>
          {/* No. Contenedor (solo lectura visual, pero proviene del form) */}
          <Text style={styles.label}>No. Contenedor</Text>
          <Controller
            control={control}
            name="containerNumber"
            render={({ field: { value } }) => (
              <TextInput
                editable={false}
                style={styles.disabledInput}
                value={value}
                placeholder="Ingrese el número del contenedor"
              />
            )}
          />

          {/* Estado */}
          <Text style={styles.label}>Estado</Text>
          <Controller
            control={control}
            name="shipmentStatusId"
            render={({ field: { value, onChange } }) => (
              <Dropdown
                items={statuses || []}
                renderItemText={(item: any) => `${item?.description}`}
                keyExtractor={(it: any) => String(it.shipmentStatusId)}
                onItemSelected={(item: any) => onChange(Number(item.shipmentStatusId))}
                placeholder="Selecciona un estado"
                initialSelectedItem={statuses?.find((s: any) => s.shipmentStatusId === value)}
              />
            )}
          />

          {/* Origen */}
          <Text style={styles.label}>Origen</Text>
          <Controller
            control={control}
            name="originId"
            render={({ field: { value, onChange } }) => (
              <Dropdown
                items={origins || []}
                renderItemText={(item: any) => `${item?.name}`}
                keyExtractor={(it: any) => String(it.originId)}
                onItemSelected={(item: any) => onChange(Number(item.originId))}
                placeholder="Selecciona punto de partida"
                initialSelectedItem={origins?.find((o: any) => o.originId === value)}
              />
            )}
          />

          {/* Destino */}
          <Text style={styles.label}>Destino</Text>
          <Controller
            control={control}
            name="destinationId"
            render={({ field: { value, onChange } }) => (
              <Dropdown
                items={destinations || []}
                renderItemText={(item: any) => `${item?.name}`}
                keyExtractor={(it: any) => String(it.destinationId)}
                onItemSelected={(item: any) => onChange(Number(item.destinationId))}
                placeholder="Selecciona destino"
                initialSelectedItem={destinations?.find((d: any) => d.destinationId === value)}
              />
            )}
          />

          {/* Piloto */}
          <Text style={styles.label}>Piloto</Text>
          <Controller
            control={control}
            name="driverUserId"
            render={({ field: { value, onChange } }) => (
              <Dropdown
                items={drivers || []}
                placeholder="Selecciona un piloto"
                placeholderColor="#71a780"
                renderItemText={(item: any) => `${item?.names}`}
                keyExtractor={(it: any) => String(it.userId)}
                onItemSelected={(item: any) => onChange(Number(item.userId))}
                initialSelectedItem={drivers?.find((dr: any) => dr.userId === value)}
              />
            )}
          />

          {/* Vehículo */}
          <Text style={styles.label}>Vehiculo</Text>
          <Controller
            control={control}
            name="truckId"
            render={({ field: { value, onChange } }) => (
              <Dropdown
                items={trucks || []}
                placeholder="Selecciona un vehiculo"
                placeholderColor="#71a780"
                renderItemText={(item: any) => `${item?.plate}`}
                keyExtractor={(it: any) => String(it.truckId)}
                onItemSelected={(item: any) => onChange(Number(item.truckId))}
                initialSelectedItem={trucks?.find((t: any) => t.truckId === value)}
              />
            )}
          />

          {/* Peso */}
          <Text style={styles.label}>Peso (Kg)</Text>
          <Controller
            control={control}
            name="weight"
            render={({ field: { value, onChange } }) => (
              <CurrencyInput
                value={value}
                onChangeValue={(num) => onChange(num ?? 0)}
                delimiter=","
                separator="."
                precision={2}
                keyboardType="decimal-pad"
                style={styles.input}
                placeholder="Ingrese el peso"
              />
            )}
          />

          {/* Precio */}
          <Text style={styles.label}>Precio</Text>
          <Controller
            control={control}
            name="price"
            render={({ field: { value, onChange } }) => (
              <CurrencyInput
                value={value}
                onChangeValue={(num) => onChange(num ?? 0)}
                prefix="Q "
                delimiter=","
                separator="."
                precision={2}
                keyboardType="decimal-pad"
                style={styles.input}
                placeholder="Ingrese el precio"
              />
            )}
          />

          <TouchableOpacity
            style={[styles.submitButton, (!isDirty || isSubmitting) && styles.disabledButton]}
            disabled={!isDirty || isSubmitting}
            onPress={attemptSubmit}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Guardando…' : 'Guardar Cambios'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </BackgroundView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5db075',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  disabledInput: {
    height: 40,
    borderColor: '#ccc',
    backgroundColor: '#dcdcdcff',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  submitButton: {
    backgroundColor: '#3f51b5',
    paddingVertical: 10,
    marginBottom: 50,
    borderRadius: 4,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelButtonAlert: {
    backgroundColor: '#ff0809bd',
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 4,
    marginTop: 20,
  },
  cancelButtonTextAlert: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  continueButtonAlert: {
    backgroundColor: '#3f51b5',
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 4,
    marginTop: 20,
  },
  continueButtonTextAlert: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#9fa8da',
    opacity: 0.7,
  },
})