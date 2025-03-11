import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { User } from '../../model/user.model';
import { UserService } from '../../service/user.service';
import { AuthService } from '../../auth/service/auth.service';
import { ToastrService } from 'ngx-toastr'; // Importez ToastrService
import { jwtDecode } from 'jwt-decode';

@Component({
  standalone: false,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  loading = true;
  error = '';
  editMode = false;
  profileForm: FormGroup;
  photoPreview: string | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService, // Injectez ToastrService
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthday: [''],
      address: [''],
      experience: [''],
      location: [''],
      photo: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  getUserIdFromToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.authService.getToken();
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          return decodedToken.sub || null;
        } catch (error) {
          console.error('Erreur lors du décodage du token:', error);
          return null;
        }
      }
    }
    return null;
  }

  loadUserProfile(): void {
    this.loading = true;
    const username = this.getUserIdFromToken();
    if (!username) {
      this.error = 'Utilisateur non authentifié';
      this.loading = false;
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getUserByUsername(username).subscribe({
      next: (user) => {
        this.user = user;
        this.initForm(user);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du profil';
        this.loading = false;
        this.toastr.error('Erreur lors du chargement du profil', 'Erreur'); // Message d'erreur
        console.error('Erreur:', err);
      }
    });
  }

  initForm(user: User): void {
    this.profileForm.patchValue({
      username: user.username,
      email: user.email,
      birthday: user.birthday,
      address: user.address,
      experience: user.experience,
      location: user.location,
      photo: user.photo
    });
    this.photoPreview = user.photo ? `/assets/img/${user.photo}` : null;
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode && this.user) {
      this.initForm(this.user);
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const fileName = file.name;

      this.profileForm.patchValue({
        photo: fileName
      });

      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid || !this.user) {
      this.toastr.warning('Veuillez remplir tous les champs requis', 'Attention'); // Message d'avertissement
      return;
    }

    this.loading = true;
    const updatedUser: Partial<User> = {
      username: this.profileForm.get('username')?.value,
      email: this.profileForm.get('email')?.value,
      birthday: this.profileForm.get('birthday')?.value || undefined,
      address: this.profileForm.get('address')?.value || undefined,
      experience: this.profileForm.get('experience')?.value || undefined,
      location: this.profileForm.get('location')?.value || undefined,
      photo: this.profileForm.get('photo')?.value || undefined
    };

    this.userService.updateUser(this.user.id, updatedUser).subscribe({
      next: (user) => {
        this.user = user;
        this.editMode = false;
        this.loading = false;
        this.photoPreview = user.photo ? `/assets/img/${user.photo}` : null;
        this.toastr.success('Profil mis à jour avec succès', 'Succès'); // Message de succès
      },
      error: (err) => {
        this.error = 'Erreur lors de la mise à jour du profil';
        this.loading = false;
        this.toastr.error('Erreur lors de la mise à jour du profil', 'Erreur'); // Message d'erreur
        console.error('Erreur:', err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Non spécifié';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
}