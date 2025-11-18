import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../Core/services/member-service';
import { ActivatedRoute } from '@angular/router';
import { ImageUpload } from '../../../Shared/image-upload/image-upload';
import { Member, Photo } from '../../../Types/member';
import { AccountService } from '../../../Core/services/account-service';
import { User } from '../../../Types/User';
import { StarButton } from "../../../Shared/star-button/star-button";
import { DeleteButton } from "../../../Shared/delete-button/delete-button";
import { MemberDetailed } from '../member-detailed/member-detailed';

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, StarButton, DeleteButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css'
})
export class MemberPhotos implements OnInit {
  protected memberService = inject(MemberService);
  protected acountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);

  ngOnInit(): void {
    this.memberService.title.set("Photos");
    const memberId = this.route.parent?.snapshot.paramMap.get('id')
    if (memberId) {
      this.memberService.getMemverPhotos(memberId).subscribe({
        next: Photo => this.photos.set(Photo)
      });
    }
  }

  onUploadImage(file: File) {
    this.loading.set(true);
    this.memberService.uploadphoto(file).subscribe({
      next: photo => {
        this.memberService.editmode.set(false);
        this.loading.set(false);
        this.photos.update(photos => [...photos, photo])
        if(!this.memberService.member()?.sImageUrl){
          this.setMainLocalPhoto(photo);
        }
      },
      error: error => {
        console.log('error uploading the image: ', error);
        this.loading.set(false);
      }
    });
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        this.setMainLocalPhoto(photo);
      }
    });
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        this.photos.update(photos => photos.filter(x => x.sId !== photoId))
      }
    })
  }

  private setMainLocalPhoto(photo: Photo) {
    const currentUser = this.acountService.currentUser();
    if (currentUser) currentUser.sImageUrl = photo.sUrl;
    this.acountService.setCurrentUser(currentUser as User);
    this.memberService.member.update(member => ({
      ...member, sImageUrl: photo.sUrl
    }) as Member)
  }
}
