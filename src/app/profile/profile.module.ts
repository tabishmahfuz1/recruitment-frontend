import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { ProfileListComponent } from './profile-list/profile-list.component';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';
import { ProfilesRoutes } from './profile.routing';
import { AngularMaterialModule } from '../material.module';

@NgModule({
  declarations: [ProfileListComponent, ProfileDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ProfilesRoutes),
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfileModule { }
