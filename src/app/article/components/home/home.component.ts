import { Component, OnInit } from "@angular/core";
import { trigger, transition, style, animate, state } from "@angular/animations";
import { ToastrService } from "ngx-toastr"; // Ajout de ToastrService
import { CommunityService } from "../../../community/service/community.service"; // Import du service
import { CommunityDTORes } from "../../../community/model/community.model";

@Component({
  standalone: false,
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  animations: [
    trigger("fadeIn", [
      transition(":enter", [style({ opacity: 0 }), animate("600ms ease-out", style({ opacity: 1 }))]),
    ]),
    trigger("fadeInUp", [
      transition(":enter", [
        style({ transform: "translateY(20px)", opacity: 0 }),
        animate("600ms ease-out", style({ transform: "translateY(0)", opacity: 1 })),
      ]),
    ]),
    trigger("float", [
      state("void", style({ transform: "translateY(0)" })),
      state("*", style({ transform: "translateY(0)" })),
      transition(":enter", [
        style({ transform: "translateY(10px)", opacity: 0 }),
        animate("800ms ease-out", style({ transform: "translateY(0)", opacity: 1 })),
      ]),
      transition("* => *", [
        animate("3000ms ease-in-out", style({ transform: "translateY(-10px)" })),
        animate("3000ms ease-in-out", style({ transform: "translateY(10px)" })),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  communities: CommunityDTORes[] = [];
  filteredCommunities: CommunityDTORes[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = "";
  sortOption = "recent";
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  constructor(
    private communityService: CommunityService, // Injection du CommunityService
    private toastr: ToastrService // Injection de ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCommunities();
  }

  loadCommunities(): void {
    this.loading = true;
    this.communityService.getAllCommunities().subscribe({
      next: (communities) => {
        this.communities = communities;
        this.applyFilters();
        this.loading = false;
        this.toastr.success("Communautés chargées avec succès", "Succès");
      },
      error: (err) => {
        this.error = "Erreur lors du chargement des communautés";
        this.loading = false;
        this.toastr.error("Impossible de charger les communautés", "Erreur");
        console.error(err);
      },
    });
  }

  applyFilters(): void {
    let filtered = [...this.communities];

    // Appliquer la recherche
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (community) =>
          community.name.toLowerCase().includes(search) ||
          (community.description?.toLowerCase().includes(search) ?? false)
      );
    }

    // Appliquer le tri
    filtered = this.sortCommunitiesArray(filtered);

    // Calculer la pagination
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);

    // Appliquer la pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredCommunities = filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  sortCommunities(): void {
    this.applyFilters();
  }

  sortCommunitiesArray(communities: CommunityDTORes[]): CommunityDTORes[] {
    switch (this.sortOption) {
      case "popular":
        return [...communities].sort((a, b) => (b.id || 0) - (a.id || 0)); // À adapter selon vos critères
      case "recent":
      default:
        return [...communities].sort((a, b) => (b.id || 0) - (a.id || 0)); // À adapter selon un champ de date si disponible
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
      document.getElementById("communities")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  getPageNumbers(): Array<number | string> {
    const pages: Array<number | string> = [];

    if (this.totalPages <= 7) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (this.currentPage > 3) {
        pages.push("...");
      }
      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(this.totalPages - 1, this.currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (this.currentPage < this.totalPages - 2) {
        pages.push("...");
      }
      pages.push(this.totalPages);
    }

    return pages;
  }
}