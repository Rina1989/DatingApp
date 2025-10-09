import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../../Types/members';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../../Core/pipes/age-pipe';
import { LikesService } from '../../../Core/services/likes-service';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink,AgePipe],
  templateUrl: './member-card.html',
  styleUrl: './member-card.css'
})
export class MemberCard {
  private likeService=inject(LikesService);
member=input.required<Member>();
protected hasLiked=computed(()=>this.likeService.likeIds().includes(this.member().id))
}
