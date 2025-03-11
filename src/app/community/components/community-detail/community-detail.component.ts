import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommunityService } from '../../service/community.service';
import { CommunityDTORes } from '../../model/community.model';

@Component({
  standalone: false,
  selector: 'app-community-detail',
  templateUrl: './community-detail.component.html',
})
export class CommunityDetailComponent implements OnInit {
  community: CommunityDTORes | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private communityService: CommunityService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCommunity(+id);
    }
  }

  loadCommunity(id: number): void {
    this.loading = true;
    this.communityService.getCommunityById(id).subscribe({
      next: (community) => {
        this.community = community;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de la communauté';
        this.loading = false;
        console.error(err);
      },
    });
  }
}