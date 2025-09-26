import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../Core/services/member-service';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Member } from '../../../Types/members';
import { filter, Observable } from 'rxjs';
import { AgePipe } from '../../../Core/pipes/age-pipe';
import { AccountService } from '../../../Core/services/account-service';


@Component({
  selector: 'app-member-detailed',
  imports: [RouterLink, RouterLinkActive, RouterOutlet,AgePipe],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css'
})
export class MemberDetailed implements OnInit {

  private route = inject(ActivatedRoute);
  private accountService=inject(AccountService);
  protected memberService=inject(MemberService);
  private router = inject(Router);
  protected member = signal<Member | undefined>(undefined);
  protected title = signal<string | undefined>('profile');
  protected isCurrentUser=computed(()=>{
return this.accountService.currentUser()?.id===this.route.snapshot.paramMap.get('id');
  })

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => this.member.set(data['member'])
    })
    this.title.set(this.route.firstChild?.snapshot?.title)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe({
      next: () => {
        this.title.set(this.route.firstChild?.snapshot?.title)
      }
    })
  }
}
