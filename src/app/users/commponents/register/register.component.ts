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
      address: [''],
      experience: [''],
      location: [''],
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
        console.log('Communautés récupérées', res); 
        this.communities = res;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des communautés', err);
      }
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.userService.registerUser(this.registerForm.value).subscribe({
        next: (res) => {
          console.log('Inscription réussie', res);
          alert('Inscription réussie!');
  

          this.router.navigateByUrl('/auth/login');
        },
        error: (err) => {
          console.error('Erreur lors de l’inscription', err);
          alert('Erreur lors de l’inscription');
        }
      });
    }
  }
  
}
