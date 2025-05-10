import { Component, inject, input, OnInit, output } from '@angular/core';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FileUploader, FileUploadModule } from 'ng2-file-upload'

import { Member } from '../../_models/member';
import { AccountService } from '../../_services/account.service';
import { environment } from '../../../environments/environment';
import { Photo } from '../../_models/photo';
import { MemberService } from '../../_services/member.service';

@Component({
  selector: 'app-photo-editor',
  imports: [NgIf, NgFor, NgStyle, NgClass, FileUploadModule, DecimalPipe],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent implements OnInit {
  member = input.required<Member>();
  uploader?: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  memberChange = output<Member>();
  private accountService = inject(AccountService);
  private memberService = inject(MemberService);

  ngOnInit() {
    this.initializeUploader();
  }

  fileOverBase(event: any) {
    this.hasBaseDropZoneOver = event;
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        this.accountService.updateUserMainPhoto(photo.url);

        const updatedMember = { 
          ...this.member(),
          photoUrl: photo.url,
          photos: [
            ...this.member()
              .photos.map(p => {
                if (p.id === photo.id) return {...p, isMain: true};

                return {...p, isMain: false}
              }),
          ] 
        };

        this.memberChange.emit(updatedMember);
      }
    });
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.accountService.currentUser()?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (fileItem) => {
      fileItem.withCredentials = false;
    };
  
    this.uploader.onSuccessItem = (fileItem, response, status, headers) => {
      const photo = JSON.parse(response);

      const updatedMember = { 
        ...this.member(),
        photos: [
          this.member().photos.map(p => ({...p})),
          photo
        ] 
      };

      this.memberChange.emit(updatedMember);
    };
  }
}
