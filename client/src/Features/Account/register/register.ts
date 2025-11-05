import { AccountService } from './../../../Core/services/account-service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Component, inject, input, OnInit, output } from '@angular/core';
import { RegisterCreds, User } from '../../../Types/User';
import { JsonPipe } from '@angular/common';
import { TextInput } from "../../../Shared/text-input/text-input";

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, JsonPipe, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  // membersFromhome=input.required<User[]>();
  private accountService = inject(AccountService);
  private fb =inject(FormBuilder)
  CancelRegister = output<boolean>();
  protected creds = {} as RegisterCreds;
  protected registerForm: FormGroup;

constructor(){
  this.registerForm = this.fb.group({
      sEmail: ['', [Validators.required, Validators.email]],
      sDisplayName: ['', Validators.required],
      sPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      sConfirmPassword: ['', [Validators.required,this.matchValues('sPassword')]]
    });
    this.registerForm.controls['sPassword'].valueChanges.subscribe(()=>{
      this.registerForm.controls['sConfirmPassword'].updateValueAndValidity();
    })
}

  matchValues(matchTo: string):ValidatorFn {

    return (control: AbstractControl) : ValidationErrors | null => {
      const parent = control.parent;
      if(!parent) return null;
      const matchValue = parent.get(matchTo)?.value;
      return control.value === matchValue ? null : {passwordMismatch: true}
    }
  }

  register() {
    console.log(this.registerForm.value)
    // this.accountService.register(this.creds).subscribe({
    //   next: result=> {
    //     console.log(result);
    //     this.cancel();
    //   },
    //   error: error => console.log(error)
    // })
  }

  cancel() {
    this.CancelRegister.emit(false);
  }
}
