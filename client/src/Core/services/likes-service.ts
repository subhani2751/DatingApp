import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Member } from '../../Types/member';
import { PaginatedResult } from '../../Types/pagination';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  likedIds = signal<string[]>([]);

  toggleLike(tragetMemberId: string) {
    return this.http.post(`${this.baseUrl}likes/${tragetMemberId}`, {}).subscribe({
      next: () => {
        if (this.likedIds().includes(tragetMemberId)) {
          this.likedIds.update(ids => ids.filter(x => x !== tragetMemberId));
        }
        else {
          this.likedIds.update(ids => [...ids, tragetMemberId]);
        }
      }
    });
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('predicate', predicate);
    return this.http.get<PaginatedResult<Member>>(this.baseUrl + 'likes/GetMemberLikes', { params });
  }

  getLikeIds() {
    return this.http.get<string[]>(this.baseUrl + 'likes/list').subscribe({
      next: ids => {
        this.likedIds.set(ids);
      }
    });
  }
  clearLikeIds() {
    this.likedIds.set([]);
  }

}
