import { Component, inject, OnInit, output } from '@angular/core';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { AccountService } from '../_services/account.service';
import { TextInputComponent } from "../_forms/text-input/text-input.component";
import { DatePickerComponent } from "../_forms/date-picker/date-picker.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent, DatePickerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  cancelReg = output<boolean>();
  registerForm: FormGroup = new FormGroup({});
  maxDate = new Date();
  validationErrors: string[] | undefined;
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  ngOnInit() {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(8)
      ]],
      confirmPassword: ['', [
        Validators.required,
        this.matchValues('password')
      ]],
    });

    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return (control.value === control.parent?.get(matchTo)?.value) 
        ? null
        : { isNotMatching: true };
    }
  }

  register() {
    const dob = this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);
    this.registerForm.patchValue({ dateOfBirth: dob });
    this.accountService.register(this.registerForm.value).subscribe({
      next: () => this.router.navigate(['/members']),
      error: (error) => this.validationErrors = error
    });
  }

  cancel() {
    this.cancelReg.emit(false);
  }

  private getDateOnly(dob: Date | undefined) {
    if (!dob) return;

    const isoStrDate = new Date(dob).toISOString();

    return isoStrDate.slice(0, isoStrDate.indexOf('T'));
  }

  get knownAsControl(): FormControl {
    return this.registerForm.controls['knownAs'] as FormControl;
  }

  get dateOfBirthControl(): FormControl {
    return this.registerForm.controls['dateOfBirth'] as FormControl;
  }

  get cityControl(): FormControl {
    return this.registerForm.controls['city'] as FormControl;
  }

  get countryControl(): FormControl {
    return this.registerForm.controls['country'] as FormControl;
  }

  get userNameControl(): FormControl {
    return this.registerForm.controls['username'] as FormControl;
  }

  get passwordControl(): FormControl {
    return this.registerForm.controls['password'] as FormControl;
  }

  get confirmPasswordControl(): FormControl {
    return this.registerForm.controls['confirmPassword'] as FormControl;
  }
}
