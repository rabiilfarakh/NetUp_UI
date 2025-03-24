import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommunityDTOReq, CommunityDTORes } from '../../../community/model/community.model';
import { User } from '../../model/user.model';
import { CommunityService } from '../../../community/service/community.service';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  Math = Math;
  communities: CommunityDTORes[] = [];
  users: User[] = [];
  
  stats = {
    totalUsers: 0,
    totalCommunities: 0,
    newUsersThisMonth: 0,
    newCommunitiesThisMonth: 0,
    activeUsers: 0,
    activeCommunities: 0
  };
  
  activeTab: 'dashboard' | 'communities' | 'users' = 'dashboard';
  sidebarOpen = true;
  
  showCommunityModal = false;
  showUserModal = false;
  communityForm: FormGroup;
  userForm: FormGroup;
  editMode = false;
  currentCommunityId: number | null = null;
  currentUserId: number | null = null;

  searchTerm: string = '';
  filteredCommunities: CommunityDTORes[] = [];
  filteredUsers: User[] = [];

  // Pagination pour les communautés
  currentPageCommunities: number = 1;
  itemsPerPageCommunities: number = 10;
  totalPagesCommunities: number = 0;

  // Pagination pour les utilisateurs
  currentPageUsers: number = 1;
  itemsPerPageUsers: number = 10;
  totalPagesUsers: number = 0;

  constructor(
    private communityService: CommunityService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.communityForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCommunities();
    this.loadUsers();
    this.calculateStats();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  setActiveTab(tab: 'dashboard' | 'communities' | 'users'): void {
    this.activeTab = tab;
  }

  loadCommunities(): void {
    this.communityService.getAllCommunities().subscribe({
      next: (data) => {
        this.communities = data;
        this.filteredCommunities = [...this.communities];
        this.updatePaginationCommunities();
        this.calculateStats();
      },
      error: (error) => {
        this.toastr.error('Erreur lors du chargement des communautés', 'Erreur');
        console.error('Erreur lors du chargement des communautés', error);
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = [...this.users];
        this.updatePaginationUsers();
        this.calculateStats();
      },
      error: (error) => {
        this.toastr.error('Erreur lors du chargement des utilisateurs', 'Erreur');
        console.error('Erreur lors du chargement des utilisateurs', error);
      }
    });
  }

  openCommunityModal(community?: CommunityDTORes): void {
    this.editMode = !!community;
    this.currentCommunityId = community?.id || null;
    if (community) {
      this.communityForm.patchValue({
        name: community.name,
        description: community.description
      });
    } else {
      this.communityForm.reset();
    }
    this.showCommunityModal = true;
  }

  closeCommunityModal(): void {
    this.showCommunityModal = false;
    this.communityForm.reset();
    this.editMode = false;
    this.currentCommunityId = null;
  }

  saveCommunity(): void {
    if (this.communityForm.invalid) {
      this.toastr.warning('Veuillez remplir tous les champs requis', 'Attention');
      return;
    }
    
    const communityData: CommunityDTOReq = this.communityForm.value;
    
    if (this.editMode && this.currentCommunityId) {
      this.communityService.updateCommunity(this.currentCommunityId, communityData).subscribe({
        next: () => {
          this.loadCommunities();
          this.closeCommunityModal();
          this.toastr.success('Communauté mise à jour avec succès', 'Succès');
        },
        error: (error) => {
          this.toastr.error('Erreur lors de la mise à jour de la communauté', 'Erreur');
          console.error('Erreur lors de la mise à jour de la communauté', error);
        }
      });
    } else {
      this.communityService.createCommunity(communityData).subscribe({
        next: () => {
          this.loadCommunities();
          this.closeCommunityModal();
          this.toastr.success('Communauté créée avec succès', 'Succès');
        },
        error: (error) => {
          this.toastr.error('Erreur lors de la création de la communauté', 'Erreur');
          console.error('Erreur lors de la création de la communauté', error);
        }
      });
    }
  }

  deleteCommunity(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette communauté ?')) {
      this.communityService.deleteCommunity(id).subscribe({
        next: () => {
          this.loadCommunities();
          this.toastr.success('Communauté supprimée avec succès', 'Succès');
        },
        error: (error) => {
          this.toastr.error('Erreur lors de la suppression de la communauté', 'Erreur');
          console.error('Erreur lors de la suppression de la communauté', error);
        }
      });
    }
  }

  openUserModal(user?: User): void {
    this.editMode = !!user;
    this.currentUserId = user?.id || null;
    if (user) {
      this.userForm.patchValue({
        username: user.username,
        email: user.email
      });
      this.userForm.get('password')?.setValidators(null);
    } else {
      this.userForm.reset();
      this.userForm.get('password')?.setValidators(Validators.required);
    }
    this.userForm.get('password')?.updateValueAndValidity();
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.userForm.reset();
    this.editMode = false;
    this.currentUserId = null;
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.toastr.warning('Veuillez remplir tous les champs requis', 'Attention');
      return;
    }
    
    const formData = this.userForm.value;
    
    if (this.editMode && this.currentUserId) {
      const updateData: Partial<User> = {
        username: formData.username,
        email: formData.email
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      this.userService.updateUser(this.currentUserId, updateData).subscribe({
        next: () => {
          this.loadUsers();
          this.closeUserModal();
          this.toastr.success('Utilisateur mis à jour avec succès', 'Succès');
        },
        error: (error) => {
          this.toastr.error('Erreur lors de la mise à jour de l\'utilisateur', 'Erreur');
          console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
        }
      });
    } else {
      const userData: User = formData;
      this.userService.registerUser(userData).subscribe({
        next: () => {
          this.loadUsers();
          this.closeUserModal();
          this.toastr.success('Utilisateur créé avec succès', 'Succès');
        },
        error: (error) => {
          this.toastr.error('Erreur lors de la création de l\'utilisateur', 'Erreur');
          console.error('Erreur lors de la création de l\'utilisateur', error);
        }
      });
    }
  }

  deleteUser(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
          this.toastr.success('Utilisateur supprimé avec succès', 'Succès');
        },
        error: (error) => {
          this.toastr.error('Erreur lors de la suppression de l\'utilisateur', 'Erreur');
          console.error('Erreur lors de la suppression de l\'utilisateur', error);
        }
      });
    }
  }

  calculateStats(): void {
    this.stats.totalUsers = this.users.length;
    this.stats.totalCommunities = this.communities.length;
    this.stats.newUsersThisMonth = Math.floor(this.users.length * 0.3);
    this.stats.newCommunitiesThisMonth = Math.floor(this.communities.length * 0.2);
    this.stats.activeUsers = Math.floor(this.users.length * 0.7);
    this.stats.activeCommunities = Math.floor(this.communities.length * 0.8);
  }

  searchCommunities(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCommunities = [...this.communities];
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredCommunities = this.communities.filter(
        community => community.name.toLowerCase().includes(term) || 
                     community.description.toLowerCase().includes(term)
      );
    }
    this.currentPageCommunities = 1; // Réinitialiser à la première page
    this.updatePaginationCommunities();
  }

  searchUsers(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredUsers = this.users.filter(
        user => user.username.toLowerCase().includes(term) || 
                user.email.toLowerCase().includes(term)
      );
    }
    this.currentPageUsers = 1; // Réinitialiser à la première page
    this.updatePaginationUsers();
  }

  onSearch(): void {
    this.searchCommunities();
    this.searchUsers();
  }

  // Méthodes de pagination
  updatePaginationCommunities(): void {
    this.totalPagesCommunities = Math.ceil(this.filteredCommunities.length / this.itemsPerPageCommunities) || 1;
    this.currentPageCommunities = Math.min(this.currentPageCommunities, this.totalPagesCommunities);
  }

  updatePaginationUsers(): void {
    this.totalPagesUsers = Math.ceil(this.filteredUsers.length / this.itemsPerPageUsers) || 1;
    this.currentPageUsers = Math.min(this.currentPageUsers, this.totalPagesUsers);
  }

  changePageCommunities(page: number): void {
    if (page >= 1 && page <= this.totalPagesCommunities) {
      this.currentPageCommunities = page;
    }
  }

  changePageUsers(page: number): void {
    if (page >= 1 && page <= this.totalPagesUsers) {
      this.currentPageUsers = page;
    }
  }

  getPaginatedCommunities(): CommunityDTORes[] {
    const startIndex = (this.currentPageCommunities - 1) * this.itemsPerPageCommunities;
    const endIndex = Math.min(startIndex + this.itemsPerPageCommunities, this.filteredCommunities.length);
    return this.filteredCommunities.slice(startIndex, endIndex);
  }

  getPaginatedUsers(): User[] {
    const startIndex = (this.currentPageUsers - 1) * this.itemsPerPageUsers;
    const endIndex = Math.min(startIndex + this.itemsPerPageUsers, this.filteredUsers.length);
    return this.filteredUsers.slice(startIndex, endIndex);
  }
}