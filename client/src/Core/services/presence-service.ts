import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { ToastService } from './toast-service';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { User } from '../../Types/User';
import { Messages } from '../../Features/messages/messages';
import { Message } from '../../Types/message';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  private hubUrl = environment.hubUrl;
  private toast = inject(ToastService);
  hubConnection?: HubConnection;
  onlineUsers = signal<string[]>([]);

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.sToken
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .catch(errer => console.log(errer));

    this.hubConnection.on('UserOnline', userId => {
      debugger;
      this.onlineUsers.update(users => [...users, userId]);
    })

    this.hubConnection.on('UserOffline', userId => {
      debugger;
      this.onlineUsers.update(users => users.filter(x => x !== userId));
    })
    this.hubConnection.on('GetOnlineUsers', userIds => {
      debugger;
      this.onlineUsers.set(userIds);
    })
    this.hubConnection.on('NewMessageReceived', (message: Message) => {
      this.toast.info(message.senderDisplayName + ' has sent you a new message', 10000, message.senderImageUrl, `/Members/${message.senderId}/messages`);
    })
  }
  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch(error => console.log(error));
    }
  }
}
