import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../Core/services/member-service';
import { Member, MemberParams } from '../../../Types/members';
import { MemberCard } from "../member-card/member-card";
import { PaginatedResult } from '../../../Types/Pagination';
import { Paginator } from "../../../Shared/paginator/paginator";
import { FilterModal } from '../filter-modal/filter-modal';

@Component({
  selector: 'app-member-list',
  imports: [MemberCard, Paginator, FilterModal],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {
  @ViewChild('filterModal') modal!: FilterModal;
  private memberService = inject(MemberService);
  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  protected memberParams = new MemberParams();
  private updatedParams=new MemberParams();

constructor(){
  const filters=localStorage.getItem('filters');
  if(filters){
    this.memberParams=JSON.parse(filters);
    this.updatedParams=JSON.parse(filters);
  }
}

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers(this.memberParams).subscribe({
      next: result => {
        this.paginatedMembers.set(result)
      }
    });
  }

  onPageChange(event: { pageNumber: number, pageSize: number }) {
    this.memberParams.pageSize = event.pageSize;
    this.memberParams.pageNumber = event.pageNumber;
    this.loadMembers();
  }

  openModal() {
    this.modal.open();
  }

  onClose() {
    console.log('Modal closed');
  }

  onFilterChange(data: MemberParams) {
    console.log('Modal submitted data: ', data);
    this.memberParams = data;
    this.loadMembers();
  }

  resetFilters() {
    this.memberParams = new MemberParams();
    this.updatedParams=new MemberParams();
    this.loadMembers();
  }

  get displayMessage(): string {
    const defaultParams = new MemberParams();
    const filters: string[] = [];
    if (this.memberParams.gender) {
      filters.push(this.memberParams.gender + 's')
    } else {
      filters.push('Males,Females');
    }

    if (this.memberParams.minAge !== defaultParams.minAge
      || this.memberParams.maxAge !== defaultParams.maxAge) {
      filters.push(`ages ${this.memberParams.minAge}-${this.memberParams.maxAge}`)
    }

    filters.push(this.memberParams.orderBy === 'lastActive' ? 'Recently active' : 'Newest members');

    return filters.length > 0 ? `Selected:${filters.join(' | ')}`:'All members'
  }
}

