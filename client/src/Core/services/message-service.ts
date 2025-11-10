import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResult } from '../../Types/pagination';
import { Message } from '../../Types/message';
import { StringToken } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getMessages(container: string, pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('container', container);
    return this.http.get<PaginatedResult<Message>>(this.baseUrl + 'messages/GetMessagesByContainer', { params });
  }

  getMessageThread(memberId: string) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + memberId)
  }

  sendMessage(recipientId: string, content: string) {
    return this.http.post<Message>(this.baseUrl + 'messages/CreateMessage', { recipientId, content })
  }

  deleteMessage(id: string){
    return this.http.delete(this.baseUrl + 'messages/' + id)
  }
}
