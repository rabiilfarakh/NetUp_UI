import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { CommunityService } from '../../../community/service/community.service';
import { CommunityDTORes } from '../../../community/model/community.model';

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  communities: CommunityDTORes[] = [];
  successMessage: string | null = null; 
  errorMessage: string | null = null; 

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private communityService: CommunityService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthday: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', Validators.required],
      experience: ['', Validators.required],
      location: ['', Validators.required],
      photo: [''],
      community_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getCommunities();
  }

  getCommunities(): void {
    this.communityService.getAllCommunities().subscribe({
      next: (res) => {
        this.communities = res;
      },
      error: (err) => {
        console.error('Error fetching communities', err);
      }
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.userService.registerUser(this.registerForm.value).subscribe({
        next: (res) => {
          this.successMessage = 'Registration successful!'; 
          this.errorMessage = null; 


          setTimeout(() => {
            this.router.navigateByUrl('/login');
          }, 3000);
        },
        error: (err) => {
          this.errorMessage = 'Registration failed. Please try again.';
          this.successMessage = null; 
          console.error('Registration failed', err);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}