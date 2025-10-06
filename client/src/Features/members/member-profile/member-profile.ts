import { Component, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EditableMember, Member } from '../../../Types/members';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../Core/services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../Core/services/toast-service';
import { AccountService } from '../../../Core/services/account-service';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css'
})
export class MemberProfile implements OnInit, OnDestroy {
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: BeforeUnloadEvent) {   //Leave site show msg saved editdata?
    if (this.editForm?.dirty) {
      $event.preventDefault();
    }
  }
  private accountService = inject(AccountService);
  protected memberServices = inject(MemberService);
  private toast = inject(ToastService);
  protected editableMember: EditableMember = {
    displayName: '',
    description: '',
    city: '',
    country: ''
  };

  ngOnInit(): void {

    this.editableMember = {
      displayName: this.memberServices.member()?.displayName || '',
      description: this.memberServices.member()?.description || '',
      city: this.memberServices.member()?.city || '',
      country: this.memberServices.member()?.country || '',
    }
  }

  updateProfile() {
    if (!this.memberServices.member()) return;
    const updatedMember = { ...this.memberServices.member(), ...this.editableMember }
    this.memberServices.updateMember(this.editableMember).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if (currentUser && updatedMember.displayName !== currentUser?.displayName) {
          currentUser.displayName = updatedMember.displayName;
          this.accountService.setCurrentUser(currentUser);
        }
        this.toast.success('Profile updated sucessfully');
        this.memberServices.editMode.set(false);
        this.memberServices.member.set(updatedMember as Member);
        this.editForm?.reset(updatedMember);
      }
    })

  }

  ngOnDestroy(): void {
    if (this.memberServices.editMode()) {
      this.memberServices.editMode.set(false);
    }
  }

}
