import { Paginator } from '../../Shared/paginator/paginator';
import { Member } from '../../Types/member';
import { PaginatedResult } from '../../Types/pagination';
import { MembersCard } from '../Members/members-card/members-card';
import { LikesService } from './../../Core/services/likes-service';
import { Component, inject, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-lists',
  imports: [MembersCard,Paginator],
  templateUrl: './lists.html',
  styleUrl: './lists.css'
})
export class Lists implements OnInit {
  private likesService = inject(LikesService);
  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  protected predicate = 'liked';
  protected pageNumber = 1;
  protected pageSize = 5;

  tabs = [
    {label: 'Liked', value: 'liked'},
    {label: 'Liked me', value: 'likedBy'},
    {label: 'Mutual', value: 'mutual'},
  ]

  ngOnInit(): void {
    this.loadLikes();
  }

  setPredicate(predicate: string){
    if(this.predicate !== predicate){
      this.predicate = predicate;
      this.pageNumber = 1;
      this.loadLikes();
    }
  }

  loadLikes(){
    this.likesService.getLikes(this.predicate,this.pageNumber,this.pageSize).subscribe({
      next: result => this.paginatedMembers.set(result)
    })
  }

  onPageChange(event: {pageNumber: number, pageSize: number}){
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.loadLikes();
  }

}
