import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommunityDTOReq, CommunityDTORes } from '../../../community/model/community.model';
import { User } from '../../model/user.model';
import { CommunityService } from '../../../community/service/community.service';
import { UserService } from '../../service/user.service';


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

  constructor(
    private communityService: CommunityService,
    private userService: UserService,
    private fb: FormBuilder
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
        this.calculateStats();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des communautés', error);
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
    if (this.communityForm.invalid) return;
    
    const communityData: CommunityDTOReq = this.communityForm.value;
    
    if (this.editMode && this.currentCommunityId) {
      this.communityService.updateCommunity(this.currentCommunityId, communityData).subscribe({
        next: () => {
          this.loadCommunities();
          this.closeCommunityModal();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de la communauté', error);
        }
      });
    } else {
      this.communityService.createCommunity(communityData).subscribe({
        next: () => {
          this.loadCommunities();
          this.closeCommunityModal();
        },
        error: (error) => {
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
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la communauté', error);
        }
      });
    }
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = [...this.users];
        this.calculateStats();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs', error);
      }
    });
  }

  openUserModal(user?: User): void {
    this.editMode = !!user;
    this.currentUserId = user?.id || null;
    
    if (user) {
      this.userForm.patchValue({
        username: user.username,
        email: user.email
      });
      
      this.userForm.get('password')?.setValidators(this.editMode ? null : Validators.required);
      this.userForm.get('password')?.updateValueAndValidity();
    } else {
      this.userForm.reset();
      this.userForm.get('password')?.setValidators(Validators.required);
      this.userForm.get('password')?.updateValueAndValidity();
    }
    
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.userForm.reset();
    this.editMode = false;
    this.currentUserId = null;
  }

  saveUser(): void {
    if (this.userForm.invalid) return;
    
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
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
        }
      });
    } else {
      const userData: User = formData;
      
      this.userService.registerUser(userData).subscribe({
        next: () => {
          this.loadUsers();
          this.closeUserModal();
        },
        error: (error) => {
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
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de l\'utilisateur', error);
        }
      });
    }
  }

  calculateStats(): void {
    this.stats.totalUsers = this.users.length;
    this.stats.totalCommunities = this.communities.length;
    
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    this.stats.newUsersThisMonth = Math.floor(this.users.length * 0.3);
    this.stats.newCommunitiesThisMonth = Math.floor(this.communities.length * 0.2);
    
    this.stats.activeUsers = Math.floor(this.users.length * 0.7);
    this.stats.activeCommunities = Math.floor(this.communities.length * 0.8);
  }

  searchCommunities(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCommunities = [...this.communities];
      return;
    }
    
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredCommunities = this.communities.filter(
      community => community.name.toLowerCase().includes(term) || 
                  community.description.toLowerCase().includes(term)
    );
  }

  searchUsers(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }
    
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredUsers = this.users.filter(
      user => user.username.toLowerCase().includes(term) || 
              user.email.toLowerCase().includes(term)
    );
  }

  onSearch(): void {
    this.searchCommunities();
    this.searchUsers();
  }
}