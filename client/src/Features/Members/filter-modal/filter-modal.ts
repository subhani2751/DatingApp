import { MemberParams } from './../../../Types/member';
import { Component, ElementRef, ViewChild, input, model, output } from '@angular/core';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-filter-modal',
  imports: [FormsModule],
  templateUrl: './filter-modal.html',
  styleUrl: './filter-modal.css'
})
export class FilterModal {
  @ViewChild('filterModal') modalRef!:ElementRef<HTMLDialogElement>;
  closeModal = output();
  submitData = output<MemberParams>();
  memberParams = model(new MemberParams());

  constructor(){
      const filter = localStorage.getItem('filters');
  if(filter){
    this.memberParams.set(JSON.parse(filter));
  }
  }
  open(){
    this.modalRef.nativeElement.showModal();
  }

  close(){
    this.modalRef.nativeElement.close();
    this.closeModal.emit();
  }

  submit(){
    this.submitData.emit(this.memberParams());
    this.close();
  }
  onMinAgeChange() {
    if(this.memberParams().minAge < 18){
      this.memberParams().minAge = 18;
    }
  }

  onMaxAgeChange(){
    if(this.memberParams().maxAge < this.memberParams().minAge){
      this.memberParams().maxAge = this.memberParams().minAge;
    }
  }
}
