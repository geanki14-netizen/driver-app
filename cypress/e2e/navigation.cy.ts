describe('Navegación y guards', () => {

  it('debe redirigir /home a login sin sesión', () => {
    cy.clearLocalStorage();
    cy.visit('/home');
    cy.url().should('include', '/auth/login');
  });

  it('debe redirigir /profile a login sin sesión', () => {
    cy.clearLocalStorage();
    cy.visit('/profile');
    cy.url().should('include', '/auth/login');
  });

  it('debe redirigir /admin a login sin sesión', () => {
    cy.clearLocalStorage();
    cy.visit('/admin');
    cy.url().should('include', '/auth/login');
  });

  it('debe mostrar el splash screen al cargar la app', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    // El splash redirige automáticamente
    cy.url().should('satisfy', (url: string) =>
      url.includes('/auth/login') || url.includes('/home')
    );
  });

  it('debe mostrar el botón de regístrate en login', () => {
    cy.visit('/auth/login');
    cy.contains('Regístrate').should('be.visible');
  });

  it('debe navegar de login a registro y volver', () => {
    cy.visit('/auth/login');
    cy.contains('Regístrate').click();
    cy.url().should('include', '/auth/register');
    cy.contains('Inicia sesión').click();
    cy.url().should('include', '/auth/login');
  });

});