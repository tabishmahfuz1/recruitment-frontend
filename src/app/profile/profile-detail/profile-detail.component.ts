import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";

import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';

import { ProfileService } from '../profile.service';


@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss']
})
export class ProfileDetailComponent implements OnInit {
	profileForm: FormGroup;
	skillsArray: string[] = [];
	isNewProfile: boolean = true;
	profiles: string[] = ["Java Developer", "Software Engineer", "Golang Developer"];
	profileCtrl: FormControl;
	filteredProfiles: Observable<any[]>;
  	readonly separatorKeysCodes: number[] = [ENTER, COMMA];
	@ViewChild('skillList', { static: true }) skillList;
 	@ViewChild('resetProfileForm', { static: true }) myNgForm;
  constructor(
  	public fb: FormBuilder,
    private router: Router,
    private profileService: ProfileService) { 

  	this.profileCtrl = new FormControl();

  	this.filteredProfiles = this.profileCtrl.valueChanges
  	.pipe(
  		startWith(''),
      map(profile => profile ? this.filterProfiles(profile) : this.profiles.slice())
  	)


  }


  filterProfiles(name: string) {
    this.profileForm.get('profile').setValue(name, {
      onlyself: true
    })
    return this.profiles.filter(profile =>
      profile.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  ngOnInit() {
  	this.intializeForm();
  }


  intializeForm() {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      profile: ['', [Validators.required]],
      skills: [this.skillsArray],
      dob: ['', [Validators.required]],
      gender: ['Male'],
      resume: [null, [Validators.required]]
    })
  }

  	onFileChange(event) {
	  let reader = new FileReader();
	 
	  if(event.target.files && event.target.files.length) {
	    const [file] = event.target.files;
	    this.profileForm.patchValue({
		    resume: file
		});
    console.log({file})
		console.log(this.profileForm.value)
	    // reader.readAsDataURL(file);
	  
	    // reader.onload = () => {
	    //   this.profileForm.patchValue({
	    //     resume: reader.result
	    //   });
	    //   // Also try to get resume parsed data here..
	    //   console.log({file: reader.result})
	    //   // need to run CD since file load runs outside of zone
	    //   // this.cd.markForCheck();
	    // };
	  }
	}

  /* Add dynamic skills */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add language
    if ((value || '').trim()) {
      this.skillsArray.push(value.trim())
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }


  /* Remove dynamic skills */
  remove(skill: string): void {
    const index = this.skillsArray.indexOf(skill);
    if (index >= 0) {
      this.skillsArray.splice(index, 1);
    }
  }  


  /* Date */
  formatDate(e) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.profileForm.get('dob').setValue(convertDate, {
      onlyself: true
    })
  }  


  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.profileForm.controls[controlName].hasError(errorName);
  }  

  submitProfileForm(){
    console.log("Hey")
    console.log({form: this.profileForm});
    let profileData = new FormData();

    Object.keys(this.profileForm.value).forEach(key => {

      let data = this.profileForm.get(key).value;
      // profileData.append(key, data)
      console.log("Reading", key, data)

      if ( data instanceof Array ) {
        data.forEach(elem => {
          console.log("e", elem)
          profileData.append(key, elem)
        });
        console.log(profileData)
      } else if ( data instanceof Object ) {
        Object.keys(data).forEach((elem, k) => profileData.append(`${key}[${k}]`, elem));
      } else {
        profileData.append(key, data)
      }

    });


    if ( ! profileData.has('resume') ) {
      profileData.set('resume', this.profileForm.get('resume').value);
    }

    // console.log("Prepared ProfileData", Array.from(profileData.entries()))
    // return '';
  	if (this.profileForm.valid) {
  		// console.log({form: this.profileForm.value});
      this.profileService.saveProfile(profileData)
      .subscribe(data => {
        this.router.navigateByUrl('/profile')
      });
  		// Hadle form Submission
    }
  }



}
