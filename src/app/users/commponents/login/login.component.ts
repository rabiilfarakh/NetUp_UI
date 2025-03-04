import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../auth/service/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],  
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
  ngOnInit(): void {}

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const loginData = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        if (response.token) {
          this.authService.saveToken(response.token, response.role);

          if(response.role == "USER"){
            console.log(response)
            //this.router.navigate(['users/dashboard']);
          }else{
            console.log(response)
            this.router.navigate(['/dashboard']);
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = 'Échec de connexion. Vérifiez vos identifiants.';
        console.error('Erreur de connexion:', error);
      }
    });
  }
}
