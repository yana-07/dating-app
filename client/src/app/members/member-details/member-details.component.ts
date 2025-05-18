import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';

import { MemberService } from '../../_services/member.service';
import { Member } from '../../_models/member';

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [TabsModule, GalleryModule, DatePipe],
  templateUrl: './member-details.component.html',
  styleUrl: './member-details.component.css',
})
export class MemberDetailsComponent implements OnInit {
  member?: Member;
  images: GalleryItem[] = [];
  private route = inject(ActivatedRoute);
  private memberService = inject(MemberService);

  ngOnInit() {
    this.loadMember();
  }

  loadMember() {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) return;

    this.memberService.getMember(username).subscribe({
      next: (member) => {
        this.member = member;
        member.photos.forEach(p => {
          this.images.push(new ImageItem({src: p.url, thumb: p.url}));
        });
      }
    });
  }
}
