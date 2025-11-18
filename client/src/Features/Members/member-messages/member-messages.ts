import { Messages } from './../../messages/messages';
import { DatePipe } from '@angular/common';
import { Message } from './../../../Types/message';
import { Component, effect, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MessageService } from '../../../Core/services/message-service';
import { MemberService } from '../../../Core/services/member-service';
import { TimeAgoPipe } from '../../../Core/pipes/time-ago-pipe';
import { FormsModule } from '@angular/forms';
import { PresenceService } from '../../../Core/services/presence-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-messages',
  imports: [DatePipe, TimeAgoPipe, FormsModule],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css'
})
export class MemberMessages implements OnInit,OnDestroy {
  @ViewChild('messageEndRef') messageEndRef!: ElementRef;
  protected messageService = inject(MessageService);
  private memberService = inject(MemberService);
  protected presenceService = inject(PresenceService)
  private route = inject(ActivatedRoute);
  protected messageContent = '';

  constructor() {
    effect(() => {
      const currentMessages = this.messageService.messageThread()
      if (currentMessages.length > 0) {
        this.scrollToBottom();
      }
    });
  }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  ngOnInit(): void {
    this.memberService.title.set("Messages");
    this.route.parent?.paramMap.subscribe({
      next: params =>{
        const otherUserId = params.get('id');
        if(!otherUserId){
          throw Error('Cannot connect to hub');
        }
        this.messageService.CreateHubConnection(otherUserId);
      }
    })
  }

  sendMessage() {
    const recipientId = this.memberService.member()?.sID;
    if (!recipientId) return;
    this.messageService.sendMessage(recipientId, this.messageContent)?.then(() =>{
      this.messageContent = '';
    })
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.messageEndRef) {
        this.messageEndRef.nativeElement.scrollIntoView({ behavior: 'smooth' })
      }
    })
  }
}
