import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../../../community/service/community.service';
import { CommunityDTORes } from '../../../community/model/community.model';


@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  communities: CommunityDTORes[] = [];

  constructor(private communityService: CommunityService) { }

  ngOnInit(): void {
    this.getAllCommunities();
  }

  getAllCommunities(): void {
    this.communityService.getAllCommunities().subscribe(data => {
      this.communities = data;
    });
  }

  
  updateCommunity(id: number): void {

   /* const updatedCommunity = { };
    this.communityService.updateCommunity(id, updatedCommunity).subscribe(response => {
      this.getAllCommunities(); 
    });*/
    
  }
  

  deleteCommunity(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette communauté ?')) {
      this.communityService.deleteCommunity(id).subscribe(() => {
        this.getAllCommunities(); 
      });
    }
  }
}
