import { RouterLink } from '@angular/router';
import { Member } from './../../../Types/member';
import { Component, input } from '@angular/core';
import { AgePipe } from '../../../Core/pipes/age-pipe';

@Component({
  selector: 'app-members-card',
  imports: [RouterLink, AgePipe],
  templateUrl: './members-card.html',
  styleUrl: './members-card.css'
})
export class MembersCard {
 member=input.required<Member>();

}
