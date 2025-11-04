import { MemberService } from './../../../Core/services/member-service';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableMember, Member } from '../../../Types/member';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css'
})
export class MemberProfile implements OnInit {
  @ViewChild('editForm') editForm? : NgForm;
  protected memberService = inject(MemberService);
  private route=inject(ActivatedRoute);
  protected member=signal<Member | undefined>(undefined);
  protected editableMember?: EditableMember;

    ngOnInit(): void {
      this.route.parent?.data.subscribe(data=>{
        this.member.set(data['member']);
      })
      this.editableMember = {
        sDisplayName : this.member()?.sDisplayName || '',
        sDescription : this.member()?.sDescription || '',
        sCity : this.member()?.sCity || '',
        sCountry : this.member()?.sCountry || ''
      }
  }
}
