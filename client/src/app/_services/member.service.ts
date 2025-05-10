import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { of, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { Photo } from '../_models/photo';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);
  private members = signal<Member[]>([]);
  allMembers = this.members.asReadonly();
  baseUrl = environment.apiUrl;

  getMembers() {
    this.http
      .get<Member[]>(this.baseUrl + 'users')
      .subscribe((members) => this.members.set(members));
  }

  getMember(username: string) {
    const member = this.members().find((m) => m.username === username);
    if (member) return of(member);

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      tap(() => {
        // TODO: update member in members array
        // this.members.update(members =>
        //   members.map(m => m.username === member.username ? member : m));
      })
    );
  }

  setMainPhoto(photo: Photo) {
    return this.http
      .put(this.baseUrl + 'users/set-main-photo/' + photo.id, {})
      .pipe(
        tap(() => {
          this.members.update(members =>
            members.map(m => {
              if (m.photos.find(p => p.id === photo.id)) {
                return {
                  ...m,
                  photoUrl: photo.url,
                  photos: m.photos.map(p => ({ ...p, isMain: p.id === photo.id })),
                };
              }

              return m;
            })
          );
        })
      );
  }

  deletePhoto(photoId: Number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId)
      .pipe(
        tap(() => {
          this.members.update(members => 
            members.map(m => {
              if (m.photos.find(p => p.id === photoId)) {
                return {
                  ...m,
                  photos: m.photos.filter(p => p.id !== photoId)
                };
              }

              return m;
            })
          );
        })
      );
  }
}
