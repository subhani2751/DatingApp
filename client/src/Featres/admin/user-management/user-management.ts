import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { AdminService } from '../../../Core/services/admin-service';
import { User } from '../../../Types/User';

@Component({
  selector: 'app-user-management',
  imports: [],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {
  @ViewChild('rolesModal') rolesModal!: ElementRef<HTMLDialogElement>;
  private adminService = inject(AdminService);
  protected users = signal<User[]>([]);
  protected availableRoles = ['Member', 'Moderator', 'Admin'];
  protected selectedUser: User | null = null;

  ngOnInit(): void {
    this.getUserWithRoles();
  }
  getUserWithRoles() {
    this.adminService.getUserWithRoles().subscribe({
      next: users => {
        debugger;
        this.users.set(users);
      }
    })
  }

  openRolesModal(user: User) {
    this.selectedUser = user;
    this.rolesModal.nativeElement.showModal();
  }

  toggleRole(event: Event, role: string) {
    if (!this.selectedUser) return;
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedUser.roles.push(role);
    }
    else {
      this.selectedUser.roles = this.selectedUser.roles.filter(r => r !== role);
    }
  }

  upDateRoles(){
    debugger;
    if(!this.selectedUser) return;
    this.adminService.updateUserRoles(this.selectedUser.sId,this.selectedUser.roles).subscribe({
      next: updatedRoles => {
        this.users.update(users => users.map(u  =>{
          if(u.sId === this.selectedUser?.sId) u.roles = updatedRoles;
          return u;
        }));
        this.rolesModal.nativeElement.close();
      },
      error: error => console.log('Failed to update roles', error)
    })
  }
}
