import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RencontreService } from './services/rencontre.service';

import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../users/auth/service/auth.service';
import { jwtDecode } from 'jwt-decode';
import { Rencontre, RencontreRequest } from './model/rencontre.model';

@Component({
  standalone: false,
  selector: 'app-rencontre',
  templateUrl: './rencontre.component.html',
  styles: [`
    .card-hover {
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }
    
    .card-hover:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      border-color: #3b4d71;
    }
    
    .modal-enter {
      animation: fadeIn 0.3s ease-out;
    }
    
    .modal-content-enter {
      animation: slideUp 0.3s ease-out;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #3b4d71 0%, #1e2a4a 100%);
      color: white;
      font-weight: 500;
      border-radius: 12px;
      padding: 10px 20px;
      border: none;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transition: all 0.2s ease;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      background: linear-gradient(135deg, #4a5d81 0%, #2e3a5a 100%);
    }
    
    .btn-secondary {
      background: white;
      color: #3b4d71;
      font-weight: 500;
      border-radius: 12px;
      padding: 10px 20px;
      border: 2px solid #3b4d71;
      transition: all 0.2s ease;
    }
    
    .btn-secondary:hover {
      background: #f8fafc;
      transform: translateY(-2px);
    }
    
    .btn-join {
      background: linear-gradient(135deg, #3b4d71 0%, #1e2a4a 100%);
      color: white;
      font-weight: 500;
      border-radius: 12px;
      padding: 8px 16px;
      border: none;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transition: all 0.2s ease;
    }
    
    .btn-join:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    
    .btn-joined {
      background: #dcfce7;
      color: #166534;
      font-weight: 500;
      border-radius: 12px;
      padding: 8px 16px;
      border: 1px solid #bbf7d0;
    }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: .7;
      }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out;
    }
    
    .animate-slideIn {
      animation: slideIn 0.5s ease-out;
    }
    
    @keyframes slideIn {
      from { transform: translateX(20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    .glass-effect {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `]
})
export class RencontreComponent implements OnInit {
  creatorId: number | null = null; 
  rencontres: Rencontre[] = [];
  selectedRencontre: Rencontre | null = null;
  viewMode: 'grid' | 'list' | 'calendar' = 'grid';
  searchQuery: string = '';
  userId: number | null = null;
  isCreateModalOpen: boolean = false;
  loading: boolean = false;
  expandedRencontreId: number | null = null;
  sortBy: 'date' | 'participants' | 'title' = 'date';
  activeCategory: 'all' | 'participating' | 'created' = 'all';

  constructor(
    private rencontreService: RencontreService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.userId = this.getUserIdFromToken();
    this.creatorId = this.userId; 
    this.loadRencontres();
  }

  loadRencontres(): void {
    this.loading = true;
    this.rencontreService.getAllRencontres().subscribe({
      next: (rencontres) => {
        this.rencontres = rencontres;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading rencontres:', error);
        this.loading = false;
      }
    });
  }

  joinRencontre(rencontreId: number, event: Event): void {
    event.stopPropagation();
    
    if (this.userId === null) {
        console.error('Utilisateur non connecté');
        return;
    }
    
    this.loading = true;
    this.expandedRencontreId = rencontreId; 
    
    this.rencontreService.joinRencontre(rencontreId, this.userId).subscribe({
        next: (updatedRencontre) => {
            this.rencontres = this.rencontres.map(r => 
                r.id === updatedRencontre.id ? updatedRencontre : r
            );
            this.loading = false;
            this.expandedRencontreId = null;
        },
        error: (error) => {
            console.error('Error joining rencontre:', error);
            this.loading = false;
            this.expandedRencontreId = null;
        }
    });
}

  toggleViewMode(mode: 'grid' | 'list' | 'calendar'): void {
    this.viewMode = mode;
  }

  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatShortDate(dateTime: string): string {
    return new Date(dateTime).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  }

  formatTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  filterRencontres(): Rencontre[] {
    let filtered = this.rencontres;
    
    // Filter by search query
    if (this.searchQuery) {
      filtered = filtered.filter(rencontre =>
        rencontre.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        rencontre.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (this.activeCategory === 'participating' && this.userId) {
      filtered = filtered.filter(rencontre => 
        this.isUserParticipating(rencontre)
      );
    } else if (this.activeCategory === 'created' && this.userId) {
      filtered = filtered.filter(rencontre => 
        rencontre.creator.id === this.userId
      );
    }
    
    // Sort
    if (this.sortBy === 'date') {
      filtered = filtered.sort((a, b) => 
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
    } else if (this.sortBy === 'participants') {
      filtered = filtered.sort((a, b) => 
        b.participants.length - a.participants.length
      );
    } else if (this.sortBy === 'title') {
      filtered = filtered.sort((a, b) => 
        a.title.localeCompare(b.title)
      );
    }
    
    return filtered;
  }

  private getUserIdFromToken(): number | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.authService.getToken();
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          return decodedToken.userId || null;
        } catch (error) {
          console.error('Erreur lors du décodage du token:', error);
          return null;
        }
      }
    }
    return null;
  }

  openCreateModal(): void {
    this.isCreateModalOpen = true;
  }

  closeCreateModal(): void {
    this.isCreateModalOpen = false;
  }

  createRencontre(rencontreData: any): void {
    if (!rencontreData.title || !rencontreData.description || 
        !rencontreData.startTime || !rencontreData.endTime) {
      console.error('Formulaire incomplet');
      return;
    }
    
    if (this.creatorId === null) {
      console.error('Utilisateur non connecté ou creatorId non défini');
      return;
    }

    console.log('Creator ID utilisé pour la création:', this.creatorId); 

    const formattedData: RencontreRequest = {
      creatorId: this.creatorId,
      title: rencontreData.title,
      description: rencontreData.description,
      startTime: rencontreData.startTime,
      endTime: rencontreData.endTime,
      location: rencontreData.location,
    };
    
    this.loading = true;
    this.rencontreService.createRencontre(formattedData).subscribe({
      next: (newRencontre) => {
        this.rencontres = [...this.rencontres, newRencontre];
        this.closeCreateModal();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error creating rencontre:', error);
        this.loading = false;
      }
    });
  }

  toggleDetails(rencontreId: number): void {
    if (this.expandedRencontreId === rencontreId) {
      this.expandedRencontreId = null;
    } else {
      this.expandedRencontreId = rencontreId; 
      
      this.rencontreService.getRencontreById(rencontreId).subscribe({
        next: (rencontre) => {
          this.rencontres = this.rencontres.map(r => 
            r.id === rencontre.id ? rencontre : r
          );
        },
        error: (error) => {
          console.error('Error loading rencontre details:', error);
        }
      });
    }
  }

  isUserParticipating(rencontre: Rencontre): boolean {
    if (!this.userId) return false;
    
    return rencontre.participants.some(participant => 
        participant.user.id.toString() === this.userId?.toString()
    );
}

  setActiveCategory(category: 'all' | 'participating' | 'created'): void {
    this.activeCategory = category;
  }

  setSortBy(sort: 'date' | 'participants' | 'title'): void {
    this.sortBy = sort;
  }

  getTimeUntil(dateTime: string): string {
    const now = new Date();
    const eventDate = new Date(dateTime);
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Terminé';
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Demain';
    if (diffDays < 7) return `Dans ${diffDays} jours`;
    if (diffDays < 30) return `Dans ${Math.floor(diffDays / 7)} semaines`;
    return `Dans ${Math.floor(diffDays / 30)} mois`;
  }
}