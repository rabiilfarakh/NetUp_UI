import { Component ,OnInit} from "@angular/core";
import { ArticleDTORes } from "./model/article.model";
import { ArticleService } from "./services/article.service";

@Component({
  selector: 'app-article-detail',
  standalone: false,
  templateUrl: './article.component.html',
})
export class ArticleComponent implements OnInit {
    articles: ArticleDTORes[] = []; 
    isLoading: boolean = true; 
  
    constructor(private articleService: ArticleService) {}
  
    ngOnInit(): void {
      this.loadArticles(); 
    }
  
    
    loadArticles(): void {
      this.isLoading = true; 
      this.articleService.getAllArticles().subscribe({
        next: (data) => {
          this.articles = data;
          this.isLoading = false; 
        },
        error: (err) => {
          console.error('Erreur lors du chargement des articles :', err);
          this.isLoading = false; 
        }
      });
    }
  }