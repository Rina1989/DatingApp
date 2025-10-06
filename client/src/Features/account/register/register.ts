import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RegisterCreds, User } from '../../../Types/User';
import { AccountService } from '../../../Core/services/account-service';
import { JsonPipe } from '@angular/common';
import { TextInput } from "../../../Shared/text-input/text-input";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, JsonPipe, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private accountService=inject(AccountService);
  private router=inject(Router);
  protected creds = {} as RegisterCreds;
  private fb=inject(FormBuilder);
  cancelRegister = output<boolean>();
protected credentialsForm:FormGroup;
protected profileForm:FormGroup;
protected currentStep=signal(1);
protected validationErrors=signal<string[]>([]);


constructor(){
this.credentialsForm=this.fb.group({
    email:['',[Validators.required,Validators.email]],
    displayName:['',Validators.required],
    password:['',[Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
    confirmPassword: ['',[Validators.required, this.matchValues('password')]]
  });

this.profileForm=this.fb.group({
  gender:['male',Validators.required],
  dateOfBirth:['',Validators.required],
  city:['',Validators.required],
  country:['',Validators.required]
})

  this.credentialsForm.controls['password'].valueChanges.subscribe(()=>{
    this.credentialsForm.controls['confirmPassword'].updateValueAndValidity();
  })
}

matchValues(matchTo:string):ValidatorFn{
  return(control:AbstractControl):ValidationErrors | null=>{
    const parent=control.parent;
    if(!parent)return null;

    const matchValue=parent.get(matchTo)?.value;
    return control.value===matchValue?null:{passwordMismatch:true}
  }
}

nextStep(){
if(this.credentialsForm.valid){
  this.currentStep.update(prevStep=>prevStep+1);
}
}

prevStep(){
  this.currentStep.update(prevStep=>prevStep-1);
}

getMaxDate(){
const today=new Date();
today.setFullYear(today.getFullYear()-18);
return today.toISOString().split('T')[0];
}

  register(){
    if(this.profileForm.valid && this.credentialsForm.valid){
      const formData={...this.credentialsForm.value,...this.profileForm.value};
      console.log('Form data:',formData);
      this.accountService.register(formData).subscribe({
        next:()=>{
          this.router.navigateByUrl('/members');
        },
        error:error=>{console.log(error)
this.validationErrors.set(error)
        }
      })
    }
  }
  cancel() {
    this.cancelRegister.emit(false);
    console.log(this.cancelRegister)
  }
}

// Another way to FormControl write
// export class Register implements OnInit {
//   private accountService=inject(AccountService);
//   protected creds = {} as RegisterCreds;
//   cancelRegister = output<boolean>();
// protected registerForm:FormGroup=new FormGroup({});

// ngOnInit(): void {
//     this.initializeForm();
//   }

// initializeForm(){
//   this.registerForm=new FormGroup({
//     email:new FormControl('',[Validators.required,Validators.email]),
//     displayName: new FormControl('',Validators.required),
//     password:new FormControl('',[Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
//     confirmPassword: new FormControl('',[Validators.required, this.matchValues('password')])
//   });
//   this.registerForm.controls['password'].valueChanges.subscribe(()=>{
//     this.registerForm.controls['confirmPassword'].updateValueAndValidity();
//   })
// }

// matchValues(matchTo:string):ValidatorFn{
//   return(control:AbstractControl):ValidationErrors | null=>{
//     const parent=control.parent;
//     if(!parent)return null;

//     const matchValue=parent.get(matchTo)?.value;
//     return control.value===matchValue?null:{passwordMismatch:true}
//   }
// }

//   register(){
//     console.log(this.registerForm.value);
//   }
//   cancel() {
//     this.cancelRegister.emit(false);
//     console.log(this.cancelRegister)
//   }
// }

//This use for FormModule
// export class Register {
//   // membersFromHome = input.required<User[]>();
//   private accountService=inject(AccountService);
//   protected creds = {} as RegisterCreds;
//   cancelRegister = output<boolean>();
//   register() {
//     this.accountService.register(this.creds).subscribe({
//       next:response=>{
//         console.log(response);
//         this.cancel();
//       },
//       error:error=>console.log(error)
//     })
//     console.log(this.creds);
//   }
//   cancel() {
//     this.cancelRegister.emit(false);
//     console.log(this.cancelRegister)
//   }
// }
