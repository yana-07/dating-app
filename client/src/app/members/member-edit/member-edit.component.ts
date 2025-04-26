import { Component, inject, OnInit, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ToastrService } from 'ngx-toastr';

import { Member } from '../../_models/member';
import { AccountService } from '../../_services/account.service';
import { MemberService } from '../../_services/member.service';
import { PhotoEditorComponent } from "../photo-editor/photo-editor.component";

@Component({
  selector: 'app-member-edit',
  imports: [TabsModule, FormsModule, PhotoEditorComponent],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css',
  host: {
    '(window:beforeunload)': 'notify($event)',
  },
})
export class MemberEditComponent implements OnInit {
  editForm = viewChild<NgForm>('editForm');
  member?: Member;
  private accountService = inject(AccountService);
  private memberService = inject(MemberService);
  private toastr = inject(ToastrService);

  ngOnInit() {
    this.loadMember();
  }

  loadMember() {
    const user = this.accountService.currentUser();
    if (!user) return;

    this.memberService.getMember(user.username).subscribe({
      next: (member) => (this.member = member),
    });
  }

  updateMember() {
    this.memberService.updateMember(this.editForm()?.value).subscribe({
      next: () => {
        this.toastr.success('Profile updated successfully!');
        this.editForm()?.reset(this.member);
      }
    });
  }

  onMemberChange(event: Member) {
    this.member = event;
  }

  notify(event: BeforeUnloadEvent) {
    if (this.editForm()?.dirty) {
      event.preventDefault();

      // Included for legacy support, e.g. Chrome/Edge < 119
      event.returnValue = true;
    }
  }
}
