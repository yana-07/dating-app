import { Component, inject, OnInit, output } from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';
import { TextInputComponent } from "../_forms/text-input/text-input.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  model: any = {};
  cancelReg = output<boolean>();
  registerForm: FormGroup = new FormGroup({});
  private accountService = inject(AccountService);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);

  ngOnInit() {
    this.initializeForm();
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
    this.accountService.register(this.model).subscribe({
      next: () => this.cancel(),
      error: (error) => this.toastr.error(error.error),
    });
  }

  cancel() {
    this.cancelReg.emit(false);
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
