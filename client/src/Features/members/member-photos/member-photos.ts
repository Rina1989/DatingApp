import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../Core/services/member-service';
import { ActivatedRoute } from '@angular/router';
import { Member, Photo } from '../../../Types/members';
import { ImageUpload } from '../../../Shared/image-upload/image-upload';
import { AccountService } from '../../../Core/services/account-service';
import { User } from '../../../Types/User';
import { StarButton } from '../../../Shared/star-button/star-button';
import { DeleteButton } from '../../../Shared/delete-button/delete-button';

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload,StarButton,DeleteButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css'
})
export class MemberPhotos implements OnInit {
  protected memberService = inject(MemberService);
  protected accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);

  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (memberId) {
      this.memberService.getMemberPhotos(memberId).subscribe({
        next: photos => this.photos.set(photos)
      })
    }
  }

  onUploadImage(file: File) {
    this.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: photo => {
        this.memberService.editMode.set(false);
        this.loading.set(false);
        this.photos.update(photos => [...photos, photo])
        if(!this.memberService.member()?.imageUrl){
          this.setMainLocalPhoto(photo);
        }
      },
      error: error => {
        console.log('Error uploading image: ', error);
        this.loading.set(false);
      }
    })
  }

  setMainPhoto(photo: Photo) {
    console.log(photo);
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        this.setMainLocalPhoto(photo)
      }
    })
  }

  deletePhoto(photoId:number){
    this.memberService.deletePhoto(photoId).subscribe({
      next:()=>{
        this.photos.update(photos=>photos.filter(x=>x.id!==photoId))
      }
    })
  }

  private setMainLocalPhoto(photo:Photo){
const currentUser = this.accountService.currentUser();
        if (currentUser) currentUser.imageUrl = photo.url;
        this.accountService.setCurrentUser(currentUser as User);
        this.memberService.member.update(member => ({                     //update local data to set photo url
          ...member,                                                      //the existing properties of the member object and copies (spreads) them into a new object.
          imageUrl: photo.url                                             //don’t lose other properties of member, only imageUrl gets updated.
        }) as Member)
  }
}
