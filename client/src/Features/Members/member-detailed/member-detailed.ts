import { MemberService } from './../../../Core/services/member-service';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Member } from '../../../Types/member';
import { AgePipe } from '../../../Core/pipes/age-pipe';
import { AccountService } from '../../../Core/services/account-service';
import { PresenceService } from '../../../Core/services/presence-service';
import { LikesService } from '../../../Core/services/likes-service';

@Component({
  selector: 'app-member-detailed',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css'
})
export class MemberDetailed implements OnInit {
  private route = inject(ActivatedRoute);
  protected memberService = inject(MemberService)
  private accountservice = inject(AccountService);
  protected presenceService = inject(PresenceService);
  protected likeService = inject(LikesService);
  private router = inject(Router);
  protected title = signal<string | undefined>('Profile');
  private routeId = signal<string | null>(null);
  protected isCurrentUser = computed(() => {
    return this.accountservice.currentUser()?.sId === this.routeId();
  });
  protected hasLiked = computed(() => this.likeService.likedIds().includes(this.routeId()!));

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.routeId.set(params.get('id'));
    })
  }

  ngOnInit(): void {
    this.title.set(this.route.firstChild?.snapshot?.title);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(
      {
        next: () => {
          this.title.set(this.route.firstChild?.snapshot?.title)
        }
      })
  }
}
