// Ambiente de PRODUCCIÓN
// Se usa con: ng build --configuration=production

export const environment = {
  production: true,
  envName: 'production',
  apiUrl: 'https://api.tuapp.com/v1',
  appVersion: '1.0.0',
  enableLogs: false,
  notificationSenderId: 'TU_SENDER_ID_PROD',
};