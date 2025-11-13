import { Injectable } from '@angular/core';
import { ConfirmDailog } from '../../Shared/confirm-dailog/confirm-dailog';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDailogService {
  private dailogComponent?: ConfirmDailog;

  register(component: ConfirmDailog){
    this.dailogComponent = component;
  }

  confirm(message='Are you sure?'): Promise<boolean> {
    if(!this.dailogComponent){
      throw new Error('Confirm dailog component is not registerd')
    }
    return this.dailogComponent.open(message)
  }
}
