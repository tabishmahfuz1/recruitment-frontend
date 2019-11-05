import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";

import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';

import { ProfileService } from '../profile.service';

import { Profile } from '../types';

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
  id: string;

  profile: Profile = {
    _id: null,
    name: '',
    email: '',
    phone: '',
    profile: '',
    skills: [],
    dob: null,
    gender: 'Male',
    resume: null
  };

  	readonly separatorKeysCodes: number[] = [ENTER, COMMA];
	@ViewChild('skillList', { static: true }) skillList;
 	@ViewChild('resetProfileForm', { static: true }) myNgForm;
  constructor(
  	public fb: FormBuilder,
    private router: Router,
    private profileService: ProfileService,
    private route: ActivatedRoute) { 

    route.params.subscribe((p) => {
      this.id = p.id;
      this.profile._id = this.id;
    });

    if( this.id ) {
      this.fetchProfile();
    }

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
      phone: ['', []],
      profile: ['', []],
      skills: [this.skillsArray],
      dob: ['', []],
      gender: ['Male'],
      resume: [null, (this.isNewProfile? [Validators.required] : [])]
    })
  }

  onFileChange(event) {
	  let reader = new FileReader();
	 
	  if(event.target.files && event.target.files.length) {
	    const [file] = event.target.files;
	    this.profileForm.patchValue({
  		    resume: file
  		});
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
    this.profileForm.get('dob').setValue(e.target.value, {
      onlyself: true
    })

    console.log(this.profileForm.get('dob').value)
  }  


  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.profileForm.controls[controlName].hasError(errorName);
  }  


  fetchProfile() {
    this.profileService
        .getProfile(this.id)
        .subscribe( profile =>  {
          this.profile = profile;
          profile.resume = null;
          this.profileForm.patchValue(profile);
          this.skillsArray = this.profile.skills;
          this.isNewProfile = false;
          let resumeControl = this.profileForm.get('resume');
          resumeControl.clearValidators();
          resumeControl.updateValueAndValidity();
        });
  }


  ObjectToFormData(Obj: Object, formData: FormData = new FormData()): FormData{
    Object.keys(Obj).forEach(key => {

      let data = Obj[key];
      // profileData.append(key, data)
      console.log("Reading", key, data)

      if ( data instanceof Array ) {
        data.forEach(elem => {
          console.log("e", elem)
          formData.append(key, elem)
        });
        console.log(formData)
      } else if ( data instanceof Object && ( ! (data instanceof Date) ) ) {
        Object.keys(data).forEach((elem, k) => formData.append(`${key}[${k}]`, elem));

      } else {
        formData.append(key, data)
      }

    });

    return formData;
  }

  submitProfileForm(){
    let profileData: FormData = this.ObjectToFormData(this.profileForm.value);

    if ( ! profileData.has('resume') ) {
      profileData.set('resume', this.profileForm.get('resume').value);
    }

    if ( this.id ) {
      profileData.set('_id', this.id);
    }

  	if (this.profileForm.valid) {
      this.profileService.saveProfile(profileData)
      .subscribe(data => {
        this.router.navigateByUrl('/profile/'+ data._id+'/edit')
      });
    }
  }



}
