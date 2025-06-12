import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from 'src/app/@core/auth.service';
import { FormService } from 'src/app/services/form/form.service';
import { TranslatedSnackBarService } from 'src/app/services/translated-snack-bar/translated-snack-bar.service';
import { CmTranslateTestingModule } from '../../../../../jest/mock/cm-translate-test-module/cm-translate-test-module.module';
import { RegisterFormComponent } from './register-form.component';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CmTranslateTestingModule,
        ReactiveFormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
      ],
      declarations: [RegisterFormComponent],
      providers: [
        {
          provide: AuthService,
          useValue: { register() {} },
        },
        {
          provide: FormService,
          useValue: { getError() {} },
        },
        {
          provide: TranslatedSnackBarService,
          useValue: { open() {} },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
