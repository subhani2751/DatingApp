import { Component, inject } from '@angular/core';
import { MemberService } from '../../../Core/services/member-service';
import { Observable } from 'rxjs';
import { Member } from '../../../Types/member';
import { AsyncPipe } from '@angular/common';
import { MembersCard } from '../members-card/members-card';

@Component({
  selector: 'app-member-list',
  imports: [AsyncPipe,MembersCard],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList {
  private memberservice=inject(MemberService);
  protected members$: Observable<Member[]>;

  constructor(){
    this.members$=this.memberservice.getMembers();
  }
}
