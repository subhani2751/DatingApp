import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { EditableMember, Member, Photo } from '../../Types/member';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient)
  private baseUrl = environment.apiUrl;
  editmode = signal(false);
  member = signal<Member | null>(null)

  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'members/GetMembers')
  }

  getMember(id: string) {
    return this.http.get<Member>(this.baseUrl + 'members/' + id).pipe(
      tap(member => {
        this.member.set(member)
      })
    )
  }

  getMemverPhotos(id: string) {
    return this.http.get<Photo[]>(this.baseUrl + 'members/' + id + '/photos')
  }

  updateMember(member: EditableMember) {
    return this.http.put(this.baseUrl + 'members/UpdateMember', member)
  }

  uploadphoto(file: File) {
    const formdate = new FormData();
    formdate.append('file', file);
    return this.http.post<Photo>(this.baseUrl + 'members/add-photo', formdate)
  }

  setMainPhoto(photo: Photo) {
    return this.http.put(this.baseUrl + 'members/set-main-photo/' + photo.sId, {});
  }

  deletePhoto(photoId: number){
    return this.http.delete(this.baseUrl + 'members/delete-photo/' + photoId )
  }
}
