import { LikesService } from './../../../Core/services/likes-service';
import { RouterLink } from '@angular/router';
import { Member } from './../../../Types/member';
import { Component, computed, inject, input } from '@angular/core';
import { AgePipe } from '../../../Core/pipes/age-pipe';
import { PresenceService } from '../../../Core/services/presence-service';

@Component({
  selector: 'app-members-card',
  imports: [RouterLink, AgePipe],
  templateUrl: './members-card.html',
  styleUrl: './members-card.css'
})
export class MembersCard {
  private likeService = inject(LikesService);
  private presenceService = inject(PresenceService)
  member = input.required<Member>();
  protected hasLiked = computed(() => this.likeService.likedIds().includes(this.member().sID));
  protected isOnline = computed(() => this.presenceService.onlineUsers().includes(this.member().sID))

  toggleLike(event: Event) {
    event.stopPropagation();
    this.likeService.toggleLike(this.member().sID).subscribe({
      next: () => {
        if (this.hasLiked()) {
          this.likeService.likedIds.update(ids => ids.filter(x => x !== this.member().sID));
        }
        else {
          this.likeService.likedIds.update(ids => [...ids, this.member().sID]);
        }
      }
    })
  }
}
