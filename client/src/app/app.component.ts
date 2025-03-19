import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';

import { NavComponent } from './nav/nav.component';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'DatingApp';
  users: any;
  private http = inject(HttpClient);
  private accountService = inject(AccountService);

  ngOnInit(): void {
    this.getUsers();
    this.accountService.setCurrentUser();
  }

  getUsers() {
    this.http.get('https://localhost:5001/api/users').subscribe({
      next: response => this.users = response,
      error: error => console.log(error),
      complete: () => console.log('Request has completed.')
    });
  }
}
