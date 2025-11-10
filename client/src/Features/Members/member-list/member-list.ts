import { filter } from 'rxjs';
import { MemberParams } from './../../../Types/member';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../Core/services/member-service';
import { Member } from '../../../Types/member';
import { MembersCard } from '../members-card/members-card';
import { PaginatedResult } from '../../../Types/pagination';
import { Paginator } from "../../../Shared/paginator/paginator";
import { FilterModal } from '../filter-modal/filter-modal';

@Component({
  selector: 'app-member-list',
  imports: [MembersCard, Paginator, FilterModal],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {
  @ViewChild('filterModal') modal!: FilterModal;
  private memberservice = inject(MemberService);
  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  memberparams = new MemberParams();
  private updatedParams = new MemberParams();

constructor(){
  const filter = localStorage.getItem('filters');
  if(filter){
    this.memberparams = JSON.parse(filter);
    this.updatedParams = JSON.parse(filter);
  }
}

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberservice.getMembers(this.memberparams).subscribe({
      next: result => {
        this.paginatedMembers.set(result);
      }
    });
  }

  onPageChange(event: { pageNumber: number, pageSize: number }) {
    this.memberparams.pageSize = event.pageSize;
    this.memberparams.pageNumber = event.pageNumber;
    this.loadMembers();
  }

  openModal() {
    this.modal.open();
  }
  onClose() {
    console.log('Modal closed');
  }

  onFilterChange(data: MemberParams) {
    this.memberparams = {...data};
    this.updatedParams = {...data};
    this.loadMembers();
  }

  resetFilters() {
    this.memberparams = new MemberParams();
    this.updatedParams = new MemberParams();
    this.loadMembers();
  }

  get displayMessage(): string {
    const defaultParams = new MemberParams()
    const filterParams: string[] = [];
    if (this.updatedParams.gender) {
      filterParams.push(this.updatedParams.gender + 's')
    } else {
      filterParams.push('Males', 'Females');
    }

    if (this.updatedParams.minAge !== defaultParams.minAge || this.updatedParams.maxAge !== defaultParams.maxAge) {
      filterParams.push(` ages ${this.updatedParams.minAge} - ${this.updatedParams.maxAge}`);
    }

    filterParams.push(this.updatedParams.orderBy === 'lastActive' ? 'Recently active' : 'Newest members');

    return filterParams.length > 0 ? `Selected: ${filterParams.join('  | ')}` : 'All members';

  }
}
