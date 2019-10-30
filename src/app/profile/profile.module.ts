import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileListComponent } from './profile-list/profile-list.component';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';

@NgModule({
  declarations: [ProfileListComponent, ProfileDetailComponent],
  imports: [
    CommonModule
  ]
})
export class ProfileModule { }
