import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrService } from 'ngx-toastr';

import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    FormsModule,
    BsDropdownModule,
    RouterLink,
    RouterLinkActive,
    TitleCasePipe,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  model: any = {};
  currentUser = computed(() => this.accountService.currentUser());
  private accountService = inject(AccountService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  login() {
    this.accountService.login(this.model).subscribe({
      next: () => this.router.navigate(['/members']),
      error: error => this.toastr.error(error.error),
      complete: () => this.model = {}
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigate(['/']);
  }
}
