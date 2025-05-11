import { Component, inject, OnInit, output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';

import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  model: any = {};
  cancelReg = output<boolean>();
  registerForm: FormGroup = new FormGroup({});
  private accountService = inject(AccountService);
  private toastr = inject(ToastrService);

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(8)
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        this.matchValues('password')
      ]),
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
}
