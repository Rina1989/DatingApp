import { Component, inject, OnDestroy, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { AccountService } from '../../../Core/services/account-service';
import { ActivatedRoute } from '@angular/router';
import { EditableMember, Member } from '../../../Types/members';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../Core/services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../Core/services/toast-service';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css'
})
export class MemberProfile implements OnInit, OnDestroy {
  @ViewChild('editForm') editForm?: NgForm;
  private route = inject(ActivatedRoute);
  protected memberServices = inject(MemberService);
  private toast = inject(ToastService);
  protected member = signal<Member | undefined>(undefined);
  protected editableMember: EditableMember={
    displayName:'',
description:'',
city:'',
country:''
  };

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.member.set(data['member']);
    })
    this.editableMember = {
      displayName: this.member()?.displayName || '',
      description: this.member()?.description || '',
      city: this.member()?.city || '',
      country: this.member()?.country || '',
    }
  }

  updateProfile() {
    if (!this.member()) return;
    const updateMember = { ...this.member(), ...this.editableMember }
    console.log(updateMember);
    this.toast.success('Profile updated sucessfully');
    this.memberServices.editMode.set(false);
  }

  ngOnDestroy(): void {
    if (this.memberServices.editMode()) {
      this.memberServices.editMode.set(false);
    }
  }

}
