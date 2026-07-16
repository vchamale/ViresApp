/**
 * Sanitización y validación de campos de vehículo (placa, año).
 * Los sanitizadores se usan en `onChangeText` para bloquear caracteres inválidos;
 * los validadores devuelven un mensaje de error o `null` si el valor es válido.
 */

/** Placa: exactamente 3 letras (A-Z) seguidas de 3 dígitos, ej. ABC123. */
export const PLATE_REGEX = /^[A-Z]{3}\d{3}$/;

export const PLATE_MAX_LENGTH = 6;
export const YEAR_MAX_LENGTH = 4;

const MIN_YEAR = 1900;

/** Año máximo aceptado: el próximo año (los fabricantes adelantan el año-modelo). */
export const maxYear = (): number => new Date().getFullYear() + 1;

/**
 * Mayúsculas, solo alfanumérico y máximo 6 caracteres.
 * Además fuerza la estructura posicional: las 3 primeras posiciones solo
 * aceptan letras y las 3 últimas solo dígitos.
 */
export const sanitizePlate = (text: string): string => {
  const chars = text
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, PLATE_MAX_LENGTH);

  let result = '';
  for (const char of chars) {
    const isLetter = char >= 'A' && char <= 'Z';
    if (result.length < 3 ? isLetter : !isLetter) {
      result += char;
    }
  }
  return result;
};

/** Solo dígitos, máximo 4. */
export const sanitizeYear = (text: string): string =>
  text.replace(/\D/g, '').slice(0, YEAR_MAX_LENGTH);

/** @returns mensaje de error, o `null` si la placa es válida. */
export const validatePlate = (plate: string): string | null => {
  if (PLATE_REGEX.test(plate)) return null;
  return 'Formato esperado: 3 letras seguidas de 3 números, ej. ABC123';
};

/** @returns mensaje de error, o `null` si el año es válido. */
export const validateYear = (year: string): string | null => {
  if (!/^\d{4}$/.test(year)) return 'El año debe tener 4 dígitos';
  const value = Number(year);
  if (value < MIN_YEAR || value > maxYear()) {
    return `El año debe estar entre ${MIN_YEAR} y ${maxYear()}`;
  }
  return null;
};
