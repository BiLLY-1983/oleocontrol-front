/**
 * Función para formatear un número como euro
 * @param {number} value - El número a formatear
 * @returns {string} - El número formateado como euro
 */
export const formatEuro = (value) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

  
  