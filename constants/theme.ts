/**
 * Design tokens propios de la marca ViresApp.
 *
 * A diferencia de `Colors.ts` (que viene de la plantilla de Expo para light/dark),
 * este archivo centraliza los colores reales que se usan a lo largo de la app.
 * Antes estos valores estaban hardcodeados (~224 veces) en las pantallas.
 */
export const theme = {
  colors: {
    primary: '#71a780',
    primaryLight: '#5db075',
    accent: '#3f51b5',
    create: '#2073cdbd',
    white: '#fff',
    border: '#ccc',
    text: '#333',
    placeholder: '#5db07587',
    dangerBg: '#f8d7da',
    dangerBorder: '#f5c6cb',
    dangerText: '#721c24',
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 10,
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
  },
} as const;

export type AppColor = keyof typeof theme.colors;
