export const ERROR_MESSAGES: Record<number, string> = {
  400: 'La solicitud no es válida.',
  401: 'Sesión expirada. Inicia sesión de nuevo.',
  403: 'No tienes permiso para esta acción.',
  404: 'Recurso no encontrado.',
  500: 'Error del servidor. Intenta más tarde.',
  0:   'Sin conexión. Verifica tu red.',
};

export const DEFAULT_ERROR = 'Ocurrió un error inesperado.';