import { MemberService } from './../../../Core/services/member-service';
import { Component, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EditableMember, Member } from '../../../Types/member';
import { DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../Core/services/toast-service';
import { AccountService } from '../../../Core/services/account-service';
import { TimeAgoPipe } from '../../../Core/pipes/time-ago-pipe';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, FormsModule,TimeAgoPipe],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css'
})
export class MemberProfile implements OnInit, OnDestroy {

  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: BeforeUnloadEvent) {
    if (this.editForm?.dirty) {
      $event.preventDefault();
    }
  }
  private accountservice = inject(AccountService);
  protected memberService = inject(MemberService);
  private toast = inject(ToastService);
  protected editableMember: EditableMember = {
    sDisplayName: '',
    sDescription: '',
    sCity: '',
    sCountry: ''
  }


  ngOnInit(): void {
    this.editableMember = {
      sDisplayName: this.memberService.member()?.sDisplayName || '',
      sDescription: this.memberService.member()?.sDescription || '',
      sCity: this.memberService.member()?.sCity || '',
      sCountry: this.memberService.member()?.sCountry || ''
    }
  }

  ngOnDestroy(): void {
    if (this.memberService.editmode()) {
      this.memberService.editmode.set(false)
    }
  }

  updateProfile() {
    if (!this.memberService.member()) return;
    const updateMember = { ...this.memberService.member(), ...this.editableMember };
    this.memberService.updateMember(this.editableMember).subscribe({
      next: () => {
        const currentUser = this.accountservice.currentUser();
        if (currentUser && updateMember.sDisplayName !== currentUser?.sDisplayName) {
          currentUser.sDisplayName = updateMember.sDisplayName;
          this.accountservice.setCurrentUser(currentUser);
        }
        this.toast.success('Profile updated successfully');
        this.memberService.editmode.set(false);
        this.memberService.member.set(updateMember as Member);
        this.editForm?.reset(updateMember);
      }
    })

  }
}
