import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { EditableMember, Member, MemberParams, Photo } from '../../Types/member';
import { tap } from 'rxjs';
import { PaginatedResult } from '../../Types/pagination';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient)
  private baseUrl = environment.apiUrl;
  editmode = signal(false);
  member = signal<Member | null>(null)
  title = signal<string>('');

  getMembers(memberParams: MemberParams) {
    let params = new HttpParams();
    params = params.append('pageNumber',memberParams.pageNumber);
    params = params.append('pageSize',memberParams.pageSize);
    params = params.append('minAge',memberParams.minAge);
    params = params.append('maxAge',memberParams.maxAge);
    params = params.append('orderBy',memberParams.orderBy);
    if(memberParams.gender) params = params.append('gender',memberParams.gender) 

    return this.http.get<PaginatedResult<Member>>(this.baseUrl + 'members/GetMembers',{params}).pipe(
      tap(()=>{
        localStorage.setItem('filters', JSON.stringify(memberParams));
      })
    )
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
