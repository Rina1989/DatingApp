import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCreds, User } from '../../../Types/User';
import { AccountService } from '../../../Core/services/account-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  // membersFromHome = input.required<User[]>();
  private accountService=inject(AccountService);
  protected creds = {} as RegisterCreds;
  cancelRegister = output<boolean>();
  register() {
    this.accountService.register(this.creds).subscribe({
      next:response=>{
        console.log(response);
        this.cancel();
      },
      error:error=>console.log(error)
    })
    console.log(this.creds);
  }
  cancel() {
    this.cancelRegister.emit(false);
    console.log(this.cancelRegister)
  }
}
