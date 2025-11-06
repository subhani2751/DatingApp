import { AccountService } from './../../../Core/services/account-service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Component, inject, output, signal } from '@angular/core';
import { RegisterCreds } from '../../../Types/User';
import { TextInput } from "../../../Shared/text-input/text-input";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  // membersFromhome=input.required<User[]>();
  private accountService = inject(AccountService);
  private route = inject(Router);
  private fb = inject(FormBuilder);
  CancelRegister = output<boolean>();
  protected creds = {} as RegisterCreds;
  protected credentialsForm: FormGroup;
  protected profileForm: FormGroup;
  protected currentStep = signal(1);
  protected ValidationErrors = signal<string[]>([]);

  constructor() {
    this.credentialsForm = this.fb.group({
      sEmail: ['', [Validators.required, Validators.email]],
      sDisplayName: ['', Validators.required],
      sPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      sConfirmPassword: ['', [Validators.required, this.matchValues('sPassword')]]
    });

    this.profileForm = this.fb.group({
      sGender: ['male', Validators.required],
      DateOfBirth: ['', Validators.required],
      sCity: ['', Validators.required],
      sCountry: ['', Validators.required],
    });

    this.credentialsForm.controls['sPassword'].valueChanges.subscribe(() => {
      this.credentialsForm.controls['sConfirmPassword'].updateValueAndValidity();
    })
  }

  matchValues(matchTo: string): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent) return null;
      const matchValue = parent.get(matchTo)?.value;
      return control.value === matchValue ? null : { passwordMismatch: true }
    }
  }

  nextStep() {
    if (this.credentialsForm.valid) {
      this.currentStep.update(prevStep => prevStep + 1);

    }
  }
  prevStep() {
    this.currentStep.update(prevStep => prevStep - 1)
  }

  getMaxDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  }

  register() {
    if (this.profileForm.valid && this.credentialsForm.valid) {
      const formdate = { ...this.credentialsForm.value, ...this.profileForm.value };
      this.accountService.register(formdate).subscribe({
        next: () => {
          this.route.navigateByUrl('/Members');
        },
        error: error => {
          console.log(error);
          this.ValidationErrors.set(error)
        }
      })
    }

  }

  cancel() {
    this.CancelRegister.emit(false);
  }
}
