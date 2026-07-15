import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import CustomAlert from '@components/CustomAlert';
import { theme } from '@constants/theme';

export type ConfirmDialogProps = {
  visible: boolean;
  title?: string;
  text: string;
  confirmText?: string;
  cancelText?: string;
  /** Muestra un spinner en el botón de confirmar y bloquea el diálogo mientras la acción está en curso. */
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

/**
 * Diálogo de confirmación reutilizable (Cancelar / Confirmar).
 * Envuelve CustomAlert con el par de botones que estaba duplicado
 * en todas las pantallas de edición.
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title = '¿Estás seguro de modificar?',
  text,
  confirmText = 'Modificar',
  cancelText = 'Cancelar',
  loading = false,
  onCancel,
  onConfirm,
}) => {
  return (
    <CustomAlert
      isVisible={visible}
      title={title}
      titleColor="#ff0809bd"
      text={text}
      onClose={loading ? () => {} : onCancel}
      buttons={[
        <Pressable onPress={onCancel} disabled={loading}>
          <View style={[styles.cancelButton, loading && styles.buttonDisabled]}>
            <Text style={styles.buttonText}>{cancelText}</Text>
          </View>
        </Pressable>,
        <Pressable onPress={onConfirm} disabled={loading}>
          <View style={styles.confirmButton}>
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <Text style={styles.buttonText}>{confirmText}</Text>
            )}
          </View>
        </Pressable>,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  cancelButton: {
    backgroundColor: '#ff0809bd',
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: theme.radius.sm,
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: theme.radius.sm,
    marginTop: 20,
    minHeight: 39,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ConfirmDialog;
