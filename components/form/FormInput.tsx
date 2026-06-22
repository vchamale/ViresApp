import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { theme } from '@constants/theme';

export type FormInputProps = TextInputProps & {
  /** Texto de la etiqueta encima del campo. */
  label: string;
  /** Si es true, agrega un asterisco a la etiqueta. */
  required?: boolean;
  /** Mensaje de error a mostrar debajo del campo. */
  error?: string;
};

/**
 * Campo de formulario reutilizable: etiqueta + TextInput con estilo unificado.
 * Reemplaza el bloque `<Text style={label}/> + <TextInput style={input}/>`
 * que estaba duplicado en ~38 pantallas.
 *
 * Acepta todas las props de TextInput (keyboardType, secureTextEntry, etc.).
 */
const FormInput: React.FC<FormInputProps> = ({ label, required, error, style, ...rest }) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        {label}
        {required ? ' *' : ''}
      </Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={theme.colors.placeholder}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    height: 40,
    borderColor: theme.colors.border,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
  inputError: {
    borderColor: theme.colors.dangerText,
  },
  error: {
    color: theme.colors.dangerText,
    fontSize: 12,
    marginTop: 4,
  },
});

export default FormInput;
