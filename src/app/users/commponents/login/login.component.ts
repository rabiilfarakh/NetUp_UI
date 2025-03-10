import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../auth/service/auth.service';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService 
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],  
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
      this.toastr.warning('Veuillez remplir correctement tous les champs', 'Attention');
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
          this.toastr.success('Connexion réussie !', 'Succès');
          
          setTimeout(() => {
            if (response.role === "ROLE_USER") {
              this.router.navigate(['/article/home']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          }, 1500); 
        }
      },
      error: (error: HttpErrorResponse) => {
        let errorMsg = 'Échec de connexion. Vérifiez vos identifiants.';
        if (error.status === 401) {
          errorMsg = 'Nom d\'utilisateur ou mot de passe incorrect';
        }
        this.toastr.error(errorMsg, 'Erreur');
        console.error('Erreur de connexion:', error);
      }
    });
  }
}