import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";

import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
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
    private router: Router) { 

  	this.profileCtrl = new FormControl();

  	this.filteredProfiles = this.profileCtrl.valueChanges
  	.pipe(
  		startWith(''),
        map(profile => profile ? this.filterProfiles(profile) : this.profiles.slice())
  	)


  }


  filterProfiles(name: string) {
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
      gender: ['Male']
    })
  }

  /* Add dynamic skills */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add language
    if ((value || '').trim() && this.skillsArray.length < 5) {
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
  	if (this.profileForm.valid) {
  		console.log({form: this.profileForm});

  		// Hadle form Submission
    }
  }



}
