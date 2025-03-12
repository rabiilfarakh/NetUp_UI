import { Component ,OnInit} from "@angular/core";
import { ArticleDTORes } from "./model/article.model";
import { ArticleService } from "./services/article.service";

@Component({
  selector: 'app-article-detail',
  standalone: false,
  templateUrl: './article.component.html',
})
export class ArticleComponent implements OnInit {
    articles: ArticleDTORes[] = []; // Liste des articles
    isLoading: boolean = true; // Indicateur de chargement
  
    constructor(private articleService: ArticleService) {}
  
    ngOnInit(): void {
      this.loadArticles(); // Chargez les articles au démarrage du composant
    }
  
    // Méthode pour charger les articles
    loadArticles(): void {
      this.isLoading = true; // Activez l'indicateur de chargement
      this.articleService.getAllArticles().subscribe({
        next: (data) => {
          this.articles = data; // Affectez les articles récupérés
          this.isLoading = false; // Désactivez l'indicateur de chargement
        },
        error: (err) => {
          console.error('Erreur lors du chargement des articles :', err);
          this.isLoading = false; // Désactivez l'indicateur de chargement en cas d'erreur
        }
      });
    }
  }