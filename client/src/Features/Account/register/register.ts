import { AccountService } from './../../../Core/services/account-service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Component, inject, input, OnInit, output } from '@angular/core';
import { RegisterCreds, User } from '../../../Types/User';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {

  // membersFromhome=input.required<User[]>();
  private accountService = inject(AccountService);
  CancelRegister = output<boolean>();
  protected creds = {} as RegisterCreds;
  protected registerForm: FormGroup = new FormGroup({})

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = new FormGroup({
      sEmail: new FormControl('subhani@test.com', [Validators.required, Validators.email]),
      sDisplayName: new FormControl('', Validators.required),
      sPassword: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      sConfirmPassword: new FormControl('', [Validators.required,this.matchValues('sPassword')])
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
