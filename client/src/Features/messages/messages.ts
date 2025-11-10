import { Component, inject, OnInit, signal } from '@angular/core';
import { MessageService } from '../../Core/services/message-service';
import { PaginatedResult } from '../../Types/pagination';
import { Message } from '../../Types/message';
import { Paginator } from '../../Shared/paginator/paginator';
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-messages',
  imports: [Paginator, RouterLink, DatePipe],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages implements OnInit {
  private messagesService = inject(MessageService);
  protected container = 'Inbox';
  protected fetchedContainer = 'Inbox';
  protected pageNumber = 1;
  protected pageSize = 10;
  protected paginatedMessages = signal<PaginatedResult<Message> | null>(null);

  tabs = [
    { label: 'Inbox', value: 'Inbox' },
    { label: 'Outbox', value: 'Outbox' },
  ]

  ngOnInit(): void {
    this.loadmessages();
  }
  loadmessages() {
    this.messagesService.getMessages(this.container, this.pageNumber, this.pageSize).subscribe({
      next: response => {
        this.paginatedMessages.set(response)
        this.fetchedContainer = this.container;
      }
    })
  }

  deleteMessage(event: Event, id: string) {
    event.stopPropagation();
    this.messagesService.deleteMessage(id).subscribe({
      next: () => {
        const current = this.paginatedMessages();
        if (current?.items) {
          this.paginatedMessages.update(prev => {
            if (!prev) return null;
            const newItem = prev.items.filter(x => x.id != id) || []
            return {
              items: newItem,
              metadata: prev.metadata
            }
          })
        }
      }
    })
  }

  get isInbox() {
    return this.fetchedContainer === 'Inbox';
  }

  setContainer(container: string) {
    this.container = container;
    this.pageNumber = 1;
    this.loadmessages();
  }

  onPageChange(event: { pageNumber: number, pageSize: number }) {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.loadmessages();
  }
}
