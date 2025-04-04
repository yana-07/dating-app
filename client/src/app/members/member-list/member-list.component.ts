import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { MemberService } from '../../_services/member.service';
import { Member } from '../../_models/member';
import { MemberCardComponent } from '../member-card/member-card.component';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit{
  members = computed(() => this.memberService.allMembers());
  private memberService = inject(MemberService);

  ngOnInit() {
    if (this.memberService.allMembers().length === 0) this.loadMembers();  
  }

  loadMembers() {
    this.memberService.getMembers();
  }
}
