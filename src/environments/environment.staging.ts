// Ambiente de STAGING / QA
// Se usa con: ng build --configuration=staging

export const environment = {
  production: false,
  envName: 'staging',
  apiUrl: 'https://api-staging.tuapp.com/v1',
  appVersion: '1.0.0',
  enableLogs: true,
  notificationSenderId: 'TU_SENDER_ID_STAGING',
};