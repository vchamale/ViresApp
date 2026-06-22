import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { theme } from '@constants/theme';

type Variant = 'primary' | 'accent' | 'search' | 'create';

export type AppButtonProps = TouchableOpacityProps & {
  title: string;
  onPress: () => void;
  /** Muestra un spinner y deshabilita el botón mientras carga. */
  loading?: boolean;
  disabled?: boolean;
  /** Estilo de color del botón. Por defecto 'accent' (el viejo submitButton). */
  variant?: Variant;
};

const VARIANT_BG: Record<Variant, string> = {
  primary: theme.colors.primary,
  accent: theme.colors.accent,
  search: theme.colors.primary,
  create: theme.colors.create,
};

/**
 * Botón reutilizable con estado de carga integrado.
 * Unifica los distintos `submitButton`/`loginButton`/`searchButton`/`createButton`
 * que estaban dispersos en ~39 pantallas. Solo el login tenía spinner; ahora
 * cualquier botón puede mostrarlo con `loading`.
 */
const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'accent',
  style,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: VARIANT_BG[variant] },
        isDisabled ? styles.disabled : null,
        style as ViewStyle,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={theme.colors.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: theme.colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AppButton;
