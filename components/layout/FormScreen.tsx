import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@components/CustomHeader';
import BackgroundView from '@components/BackgroundView';
import { theme } from '@constants/theme';

export type FormScreenProps = {
  title: string;
  onBack?: () => void;
  /** Ícono opcional del módulo. Se muestra pequeño junto al título en el header. */
  icon?: React.ReactNode;
  /** Color de fondo del header. Por defecto el verde primario. */
  headerColor?: string;
  /** Color del texto/ícono del header. */
  headerTextColor?: string;
  children: React.ReactNode;
};

/**
 * Esqueleto reutilizable para pantallas de formulario.
 * Encapsula el bloque repetido en ~25 pantallas:
 * BackgroundView + SafeAreaView + CustomHeader + ScrollView con teclado fluido.
 *
 * El antiguo banner decorativo (ícono de 150px + ~290px de espaciado) se
 * reemplazó por un banner compacto: el ícono ahora vive pequeño dentro del
 * header, dejando el formulario con prioridad visual.
 *
 * El contenido (FormInput, AppButton, etc.) se pasa como children.
 */
const FormScreen: React.FC<FormScreenProps> = ({
  title,
  onBack,
  icon,
  headerColor = theme.colors.primary,
  headerTextColor = theme.colors.white,
  children,
}) => {
  return (
    <BackgroundView>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <CustomHeader
          title={title}
          moduleIcon={icon}
          backgroundColor={headerColor}
          color={headerTextColor}
          onBackPress={onBack}
        />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
});

export default FormScreen;
