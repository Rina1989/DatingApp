import { ResolveFn, Router } from '@angular/router';
import { Member } from '../../Types/members';
import { inject } from '@angular/core';
import { MemberService } from '../services/member-service';
import { EMPTY } from 'rxjs';

export const memberResolver: ResolveFn<Member> = (route, state) => {
  const memberService = inject(MemberService);
  const router = inject(Router);
  const memberId = route.paramMap.get('id');
  if (!memberId) {
    router.navigateByUrl('/not-found');
    return EMPTY;
  }
  return memberService.getMember(memberId);
};
