import { Routes } from '@angular/router';

import { ProfileListComponent } from './profile-list/profile-list.component';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';

export const AdminLayoutRoutes: Routes = [
    { path: '/',      component: ProfileListComponent },
    { path: '/new',   component: ProfileDetailComponent },
    { path: '/:id/edit',   component: ProfileDetailComponent },
];
