import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@components/CustomHeader';
import BackgroundView from '@components/BackgroundView';
import Space from '@components/Space';
import { theme } from '@constants/theme';

export type FormScreenProps = {
  title: string;
  onBack?: () => void;
  /** Ícono opcional centrado debajo del header (ej. <FontAwesome5 ... size={150} />). */
  icon?: React.ReactNode;
  /** Color de fondo del header. Por defecto el verde primario. */
  headerColor?: string;
  /** Color del texto/ícono del header. */
  headerTextColor?: string;
  /** Espacio vertical antes del ícono. */
  iconTopSpace?: number;
  /** Espacio vertical después del ícono. */
  iconBottomSpace?: number;
  children: React.ReactNode;
};

/**
 * Esqueleto reutilizable para pantallas de formulario.
 * Encapsula el bloque repetido en ~25 pantallas:
 * BackgroundView + SafeAreaView + CustomHeader + ícono centrado + ScrollView.
 *
 * El contenido (FormInput, AppButton, etc.) se pasa como children.
 */
const FormScreen: React.FC<FormScreenProps> = ({
  title,
  onBack,
  icon,
  headerColor = theme.colors.primary,
  headerTextColor = theme.colors.white,
  iconTopSpace = 50,
  iconBottomSpace = 120,
  children,
}) => {
  return (
    <BackgroundView>
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader
          title={title}
          backgroundColor={headerColor}
          color={headerTextColor}
          onBackPress={onBack}
        />
        {icon ? (
          <>
            <Space vertical size={iconTopSpace} />
            <View style={styles.iconRow}>{icon}</View>
            <Space vertical size={iconBottomSpace} />
          </>
        ) : (
          <Space vertical size={20} />
        )}
        <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
      </SafeAreaView>
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
});

export default FormScreen;
