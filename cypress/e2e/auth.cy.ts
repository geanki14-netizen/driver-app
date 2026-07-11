describe('Flujo de autenticación', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  it('debe redirigir a login cuando no hay sesión activa', () => {
    // Limpiar storage para simular usuario no autenticado
    cy.clearLocalStorage();
    cy.visit('/home');
    cy.url().should('include', '/auth/login');
  });

  it('debe mostrar el formulario de login correctamente', () => {
    cy.visit('/auth/login');
    cy.get('ion-input[formcontrolname="email"]').should('exist');
    cy.get('ion-input[formcontrolname="password"]').should('exist');
    cy.get('ion-button[type="submit"]').should('exist');
  });

  it('debe deshabilitar el botón si el formulario es inválido', () => {
    cy.visit('/auth/login');
    cy.get('ion-button[type="submit"]').should('have.attr', 'disabled');
  });

  it('debe habilitar el botón con datos válidos', () => {
    cy.visit('/auth/login');
    // Usar cy.get con pierce para Shadow DOM de Ionic
    cy.get('ion-input[formcontrolname="email"]')
      .find('input', { includeShadowDom: true })
      .type('test@test.com', { force: true });
    cy.get('ion-input[formcontrolname="password"]')
      .find('input', { includeShadowDom: true })
      .type('123456', { force: true });
    cy.get('ion-button[type="submit"]').should('not.have.attr', 'disabled');
  });

  it('debe mostrar error con credenciales incorrectas', () => {
    cy.visit('/auth/login');
    cy.get('ion-input[formcontrolname="email"]')
      .find('input', { includeShadowDom: true })
      .type('wrong@test.com', { force: true });
    cy.get('ion-input[formcontrolname="password"]')
      .find('input', { includeShadowDom: true })
      .type('wrongpassword', { force: true });
    cy.get('ion-button[type="submit"]').click({ force: true });
    // Esperar el toast de error
    cy.get('ion-toast', { timeout: 8000 }).should('exist');
  });

  it('debe navegar a registro al hacer clic en el botón', () => {
    cy.visit('/auth/login');
    cy.contains('Regístrate').click();
    cy.url().should('include', '/auth/register');
  });

  it('debe mostrar el formulario de registro', () => {
    cy.visit('/auth/register');
    cy.get('ion-input[formcontrolname="name"]').should('exist');
    cy.get('ion-input[formcontrolname="email"]').should('exist');
    cy.get('ion-input[formcontrolname="password"]').should('exist');
    cy.get('ion-input[formcontrolname="confirmPassword"]').should('exist');
  });

});