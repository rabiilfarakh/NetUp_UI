import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Store} from '@ngrx/store';
import {UserActions} from '../../state/action/user.actions';


@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;


  constructor(private fb: FormBuilder ,private store:Store) {


    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthday: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      address: [''],
      experience: [''],
      location: [''],
      photo: ['']
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.store.dispatch(UserActions.userRegister({request:this.registerForm.value}));
      console.log("hfuisfsidukjfiuhf");
    }else{
      console.log("kujythnrtgefdv"+this.registerForm.value)

    }
  }
}
