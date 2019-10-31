import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized } from '@angular/router';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string; 
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {

	allMenus = {
		/*'dashboard': [
			{ path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
		],*/
    'dashboard': [
        { path: '/dashboard',     title: 'Dashboard',         icon:'nc-bank',       class: '' },
        { path: '/icons',         title: 'Icons',             icon:'nc-diamond',    class: '' },
        { path: '/maps',          title: 'Maps',              icon:'nc-pin-3',      class: '' },
        { path: '/notifications', title: 'Notifications',     icon:'nc-bell-55',    class: '' },
        { path: '/user',          title: 'User Profile',      icon:'nc-single-02',  class: '' },
        { path: '/table',         title: 'Table List',        icon:'nc-tile-56',    class: '' },
        { path: '/typography',    title: 'Typography',        icon:'nc-caps-small', class: '' },
        { path: '/upgrade',       title: 'Upgrade to PRO',    icon:'nc-spaceship',  class: 'active-pro' },
    ],
		'profile': [
			{ path: '/profile/new', title: 'New Profile',  icon:'add_circle_outline', class: '' },
    	{ path: '/profile', title: 'Profiles',  icon:'list', class: '' }
		],
	};

	titles = {
		'profile': 'Profile',
	};

 	menuItems: RouteInfo[];
 	activeTitle: string;

  constructor(private router: Router) { 
  	let menu = this.router.url.split('/')[1];
  	this.menuItems = this.allMenus[menu];
  	this.activeTitle = this.titles[menu];

  	this.router.events
    .pipe(
       filter((event) => event instanceof NavigationStart)
    )
    .subscribe((event:NavigationStart) => {

    	let baseMenu = event.url.split('/')[1];
    	this.activeTitle = this.titles[baseMenu];
    	this.setMenuItems(this.allMenus[baseMenu]);
    })
  }


  setMenuItems(menuItems: RouteInfo[]) {
  	this.menuItems = menuItems;
  	// console.log("New Menu Loaded", this.menuItems)
  }

  getMenuItems(): Observable<RouteInfo[]> {
  	// console.log("Menus Fetched", this.menuItems);
  	return of(this.menuItems);
  }

}
