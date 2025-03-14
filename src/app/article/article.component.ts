import { Component, OnInit } from "@angular/core";
import { ArticleDTORes } from "./model/article.model";
import { ArticleService } from "./services/article.service";
import { AuthService } from "../users/auth/service/auth.service";
import { UserService } from "../users/service/user.service";
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-article-detail',
  standalone: false,
  templateUrl: './article.component.html',
})
export class ArticleComponent implements OnInit {
  articles: ArticleDTORes[] = [];
  filteredArticles: ArticleDTORes[] = []; 
  featuredArticle: ArticleDTORes | null = null;
  isLoading: boolean = true;
  searchQuery: string = '';

  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    this.loadArticles();
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

  loadArticles(): void {
    this.isLoading = true;
    const username = this.getUserIdFromToken();

    if (!username) {
      console.error('Utilisateur non authentifié');
      this.isLoading = false;
      return;
    }

    this.userService.getUserByUsername(username).subscribe({
      next: (user) => {
        const userCommunityId = user.community?.id;

        this.articleService.getAllArticles().subscribe({
          next: (data) => {
            this.articles = data
              .filter(article => 
                article.user && 
                article.user.community && 
                article.user.community.id === userCommunityId
              )
              .map(article => ({
                ...article,
                date: new Date(article.date).toISOString()
              }));

            this.filteredArticles = [...this.articles]; 
            this.findFeaturedArticle();
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Erreur lors du chargement des articles :', err);
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement du profil utilisateur :', err);
        this.isLoading = false;
      }
    });
  }

  findFeaturedArticle(): void {
    if (this.articles.length > 0) {
      this.featuredArticle = this.articles.reduce((prev, current) =>
        (current.comments.length > prev.comments.length) ? current : prev
      );
    } else {
      this.featuredArticle = null;
    }
  }


  searchArticles(): void {
    if (!this.searchQuery.trim()) {
      this.filteredArticles = [...this.articles]; 
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredArticles = this.articles.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query)
      );
    }
  }
}