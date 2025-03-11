import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommunityDTORes } from './model/community.model';
import { CommunityService } from './service/community.service';

@Component({
  selector: 'app-community',
  standalone: false,
  templateUrl: './community.component.html',
})
export class CommunityComponent {
  communities: CommunityDTORes[] = [];
  filteredCommunities: CommunityDTORes[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';
  sortOption = 'name';
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;

  constructor(
    private communityService: CommunityService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCommunities();
  }

  loadCommunities(): void {
    this.loading = true;
    this.communityService.getAllCommunities().subscribe({
      next: (communities) => {
        this.communities = communities;
        this.applyFiltersAndPagination();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des communautés';
        this.loading = false;
        this.toastr.error('Impossible de charger les communautés', 'Erreur');
        console.error(err);
      },
    });
  }

  applyFiltersAndPagination(): void {
    let filtered = [...this.communities];

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter((community) =>
        community.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Sort logic (only by name)
    if (this.sortOption === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Pagination
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredCommunities = filtered.slice(startIndex, endIndex);
  }

  onSearchChange(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  onSortChange(event: Event): void {
    this.sortOption = (event.target as HTMLSelectElement).value;
    this.applyFiltersAndPagination();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFiltersAndPagination();
    }
  }
}