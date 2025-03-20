import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { User } from '../_models/user.model';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  model: any = {};
  //@Input({required: true}) users!: User[];
  //@Output() cancelReg = new EventEmitter<boolean>(); 
  //users = input.required<any>();
  cancelReg = output<boolean>();
  private accountService = inject(AccountService);

  register () {
    this.accountService.register(this.model).subscribe({
      next: response => {
        console.log(response);
        this.cancel();
      },
      error: error => console.log(error)
    });
  }

  cancel() {
    console.log('cancelled');
    this.cancelReg.emit(false);
  }
}
