import { inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormService } from './form.service';

describe('FormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      providers: [FormService],
    });
  });

  it('should be created', inject([FormService], (service: FormService) => {
    expect(service).toBeTruthy();
  }));
});
