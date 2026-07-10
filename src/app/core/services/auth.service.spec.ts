import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { CognitoService } from './cognito.service';

describe('AuthService', () => {
  let service: AuthService;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let cognitoServiceSpy: jasmine.SpyObj<CognitoService>;

  const mockUser = {
    id: '1',
    email: 'test@test.com',
    name: 'Test User',
    role: 'user' as const,
    token: 'fake-token',
  };

  beforeEach(() => {
    storageServiceSpy = jasmine.createSpyObj('StorageService', [
      'set', 'get', 'remove', 'clear'
    ]);
    cognitoServiceSpy = jasmine.createSpyObj('CognitoService', [
      'login', 'logout', 'getToken', 'isAuthenticated',
      'getCurrentCognitoUser', 'getUserAttributes'
    ]);

    storageServiceSpy.set.and.returnValue(Promise.resolve());
    storageServiceSpy.get.and.returnValue(Promise.resolve(null));
    storageServiceSpy.remove.and.returnValue(Promise.resolve());
    cognitoServiceSpy.isAuthenticated.and.returnValue(Promise.resolve(false));
    cognitoServiceSpy.getToken.and.returnValue(Promise.resolve(null));
    cognitoServiceSpy.logout.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: CognitoService, useValue: cognitoServiceSpy },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be authenticated initially', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should login and store user', async () => {
    await service.login(mockUser);
    expect(storageServiceSpy.set).toHaveBeenCalledWith('auth_user', mockUser);
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.getCurrentUser()).toEqual(mockUser);
  });

  it('should logout and clear user', async () => {
    await service.login(mockUser);
    await service.logout();
    expect(storageServiceSpy.remove).toHaveBeenCalledWith('auth_user');
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should emit currentUser$ on login', (done) => {
    service.currentUser$.subscribe(user => {
      if (user) {
        expect(user).toEqual(mockUser);
        done();
      }
    });
    service.login(mockUser);
  });

  it('should emit null on logout', async () => {
    await service.login(mockUser);
    let emittedUser: any = undefined;
    service.currentUser$.subscribe(user => emittedUser = user);
    await service.logout();
    expect(emittedUser).toBeNull();
  });

  it('should restore session on init if Cognito is authenticated', async () => {
    cognitoServiceSpy.isAuthenticated.and.returnValue(Promise.resolve(true));
    storageServiceSpy.get.and.returnValue(Promise.resolve(mockUser));
    await service.init();
    expect(service.getCurrentUser()).toEqual(mockUser);
  });

  it('should not restore session on init if Cognito is not authenticated', async () => {
    cognitoServiceSpy.isAuthenticated.and.returnValue(Promise.resolve(false));
    await service.init();
    expect(service.getCurrentUser()).toBeNull();
  });
});