import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { ArticleDTORes } from '../../model/article.model';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  articles: ArticleDTORes[] = [];
  loading = false;
  error: string | null = null;
  likes: { [key: number]: number } = {};
  comments: { [key: number]: string[] } = {};
  newComment: { [key: number]: string } = {};
  mobileMenuOpen = false;

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    if (!this.articleService) {
      this.error = 'Service d’articles non disponible';
      this.loading = false;
      return;
    }
    this.loading = true;
    this.articleService.getAllArticles().subscribe({
      next: (articles) => {
        this.articles = articles;
        this.loading = false;
        articles.forEach(article => {
          this.likes[article.id] = 0;
          this.comments[article.id] = [];
          this.newComment[article.id] = '';
        });
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des articles';
        this.loading = false;
        console.error(err);
      }
    });
  }

  likeArticle(articleId: number): void {
    this.likes[articleId] = (this.likes[articleId] || 0) + 1;
  }

  addComment(articleId: number): void {
    const comment = this.newComment[articleId]?.trim();
    if (comment) {
      this.comments[articleId].push(comment);
      this.newComment[articleId] = '';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}