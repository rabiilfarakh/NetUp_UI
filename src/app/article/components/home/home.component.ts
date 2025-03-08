import { Component, OnInit } from "@angular/core";
import { ArticleDTORes } from "../../model/article.model";

import { trigger, transition, style, animate, state } from "@angular/animations";
import { CommentDTOReq, CommentDTORes } from "../../../comment/model/comment.model";
import { ArticleService } from "../../services/article.service";
import { CommentService } from "../../../comment/service/comment.service";


@Component({
  standalone: false,
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  animations: [
    trigger("slideInOut", [
      transition(":enter", [
        style({ height: 0, opacity: 0 }),
        animate("300ms ease-out", style({ height: "*", opacity: 1 })),
      ]),
      transition(":leave", [
        style({ height: "*", opacity: 1 }),
        animate("300ms ease-in", style({ height: 0, opacity: 0 })),
      ]),
    ]),
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
    trigger("expandCollapse", [
      transition(":enter", [
        style({ height: "0", opacity: 0 }),
        animate("300ms ease-out", style({ height: "*", opacity: 1 })),
      ]),
      transition(":leave", [
        style({ height: "*", opacity: 1 }),
        animate("300ms ease-in", style({ height: "0", opacity: 0 })),
      ]),
    ]),
    trigger("cardAnimation", [
      transition(":enter", [
        style({ transform: "translateY(30px)", opacity: 0 }),
        animate("{{delay}}ms 300ms ease-out", style({ transform: "translateY(0)", opacity: 1 })),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  articles: ArticleDTORes[] = [];
  filteredArticles: ArticleDTORes[] = [];
  loading = false;
  error: string | null = null;
  likes: { [key: number]: number } = {};
  likedArticles: Set<number> = new Set();
  comments: { [key: number]: CommentDTORes[] } = {}; 
  newComment: { [key: number]: string } = {};
  showComments: { [key: number]: boolean } = {};
  mobileMenuOpen = false;
  darkMode = false;
  searchTerm = "";
  sortOption = "recent";
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;
  currentYear = new Date().getFullYear();

  navItems = [
    { name: "Accueil", url: "/", active: true },
    { name: "Articles", url: "/articles", active: false },
    { name: "Catégories", url: "/categories", active: false },
    { name: "À propos", url: "/about", active: false },
    { name: "Contact", url: "/contact", active: false },
  ];

  constructor(
    private articleService: ArticleService,
    private commentService: CommentService 
  ) {}

  ngOnInit(): void {
    this.loadArticles();
    // Vérifier si le mode sombre est enregistré dans localStorage
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      this.darkMode = savedDarkMode === "true";
    } else {
      // Vérifier les préférences du système
      this.darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
  }

  loadArticles(): void {
    if (!this.articleService) {
      this.error = "Service d'articles non disponible";
      this.loading = false;
      return;
    }
    this.loading = true;
    this.articleService.getAllArticles().subscribe({
      next: (articles) => {
        this.articles = articles.map((article) => ({
          ...article,
          category: article.user?.community?.name || 'Catégorie inconnue', // Gérer le cas où user ou community est null
          imageUrl: article.photo || "assets/placeholder.jpg", // Utiliser une image par défaut si photo est manquante
          author: {
            name: article.user?.username || 'Auteur inconnu', // Gérer le cas où user est null
            avatar: article.user?.photo || "assets/avatar-placeholder.jpg", // Utiliser un avatar par défaut si photo est manquante
          },
        }));
  
        // Charger les commentaires pour chaque article
        this.articles.forEach((article) => {
          this.loadCommentsForArticle(article.id);
          this.likes[article.id] = Math.floor(Math.random() * 50); // Générer des likes aléatoires (à remplacer par des données réelles si disponible)
        });
  
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = "Erreur lors du chargement des articles";
        this.loading = false;
        console.error(err);
      },
    });
  }

  loadCommentsForArticle(articleId: number): void {
    this.commentService.getCommentsByArticleId(articleId).subscribe({
      next: (comments) => {
        this.comments[articleId] = comments;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des commentaires", err);
      },
    });
  }

  applyFilters(): void {
    let filtered = [...this.articles];

    // Appliquer la recherche
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(search) ||
          article.description.toLowerCase().includes(search),
      );
    }

    // Appliquer le tri
    filtered = this.sortArticlesArray(filtered);

    // Calculer la pagination
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);

    // Appliquer la pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredArticles = filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  sortArticles(): void {
    this.applyFilters();
  }

  sortArticlesArray(articles: ArticleDTORes[]): ArticleDTORes[] {
    switch (this.sortOption) {
      case "popular":
        return [...articles].sort((a, b) => (this.likes[b.id] || 0) - (this.likes[a.id] || 0));
      case "comments":
        return [...articles].sort((a, b) => (this.comments[b.id]?.length || 0) - (this.comments[a.id]?.length || 0));
      case "recent":
      default:
        return [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }

  likeArticle(articleId: number): void {
    if (this.likedArticles.has(articleId)) {
      this.likes[articleId]--;
      this.likedArticles.delete(articleId);
    } else {
      this.likes[articleId] = (this.likes[articleId] || 0) + 1;
      this.likedArticles.add(articleId);
    }
  }

  isLiked(articleId: number): boolean {
    return this.likedArticles.has(articleId);
  }

  addComment(articleId: number): void {
    const commentText = this.newComment[articleId] || "";
    const comment = commentText.trim();
    if (comment) {
      const newComment: CommentDTOReq = {
        description: comment,
        date: new Date().toISOString(),
        articleId: articleId,
      };

      this.commentService.createComment(newComment).subscribe({
        next: (createdComment) => {
          if (!this.comments[articleId]) {
            this.comments[articleId] = [];
          }
          this.comments[articleId].push(createdComment);
          this.newComment[articleId] = "";
        },
        error: (err) => {
          console.error("Erreur lors de l'ajout du commentaire", err);
        },
      });
    }
  }

  toggleComments(articleId: number): void {
    this.showComments[articleId] = !this.showComments[articleId];
  }

  shareArticle(article: ArticleDTORes): void {
    if (navigator.share) {
      navigator
        .share({
          title: article.title,
          text: article.description,
          url: window.location.href,
        })
        .catch((error) => console.log("Erreur de partage", error));
    } else {
      alert(`Partagez cet article: ${article.title}\n${window.location.href}`);
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem("darkMode", this.darkMode.toString());
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
      document.getElementById("articles")?.scrollIntoView({ behavior: "smooth" });
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