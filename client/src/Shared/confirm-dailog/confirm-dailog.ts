import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ConfirmDailogService } from '../../Core/services/confirm-dailog-service';

@Component({
  selector: 'app-confirm-dailog',
  imports: [],
  templateUrl: './confirm-dailog.html',
  styleUrl: './confirm-dailog.css'
})
export class ConfirmDailog {
  @ViewChild('dailogRef') dailogRef!: ElementRef<HTMLDialogElement>;
  message = 'Are you sure?';
  private resolver: ((result: boolean) => void) | null = null;

  constructor() {
    inject(ConfirmDailogService).register(this);
  }
  open(message: string): Promise<boolean> {
    this.message = message;
    this.dailogRef.nativeElement.showModal();
    return new Promise(resolve => (this.resolver = resolve));
  }

  confirm(){
    this.dailogRef.nativeElement.close();
    this.resolver?.(true)
    this.resolver = null;
  }
  cancel(){
    this.dailogRef.nativeElement.close();
    this.resolver?.(false);
    this.resolver = null;
  }
}
