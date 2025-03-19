import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { AccountService } from '../_services/account.service';
import { User } from '../_models/user.model';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, BsDropdownModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  model: any = {};
  currentUser = computed(() => this.accountService.currentUser());
  private accountService = inject(AccountService);

  login() {
    this.accountService.login(this.model).subscribe({
      next: response => {
        console.log(response);
      },
      error: error => console.log(error),
      complete: () => this.model = {}
    });
  }

  logout() {
    this.accountService.logout();
  }
}
