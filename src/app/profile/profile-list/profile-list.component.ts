import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss']
})
export class ProfileListComponent implements OnInit {
	profileList: Observable<any>;
  	constructor(private profileService: ProfileService) { 
  		this.profileList = this.profileService.getProfiles();
  	}

  	ngOnInit() {
  		
  	}

}
