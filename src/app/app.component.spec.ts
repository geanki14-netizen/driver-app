import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { AuthService } from './core/services/auth.service';
import { NotificationService } from './core/services/notification.service';

describe('AppComponent', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['init', 'getCurrentUser', 'isAuthenticated']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['init']);

    authServiceSpy.init.and.returnValue(Promise.resolve());
    notificationServiceSpy.init.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule, IonicModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have 3 menu items for regular user', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    // user role — no admin item visible
    authServiceSpy.getCurrentUser.and.returnValue({
      id: '1', email: 'test@test.com',
      name: 'Test', role: 'user', token: 'token'
    });
    expect(app.visibleMenuItems.length).toBe(2);
  });

  it('should have 3 menu items for admin user', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    authServiceSpy.getCurrentUser.and.returnValue({
      id: '1', email: 'admin@test.com',
      name: 'Admin', role: 'admin', token: 'token'
    });
    expect(app.visibleMenuItems.length).toBe(3);
  });

  it('should call auth.init on ngOnInit', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    await app.ngOnInit();
    expect(authServiceSpy.init).toHaveBeenCalled();
  });
});