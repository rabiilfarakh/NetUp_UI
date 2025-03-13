import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleDTOReq } from '../../model/article.model';
import { ArticleService } from '../../services/article.service';

@Component({
  standalone: false,
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css']
})
export class CreateArticleComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  article: ArticleDTOReq = {
    title: '',
    photo: '',
    description: '',
    date: new Date().toISOString(),
    user_id: 0
  };

  selectedFile: File | null = null;

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) {
    this.setUserIdFromToken();
  }

  private setUserIdFromToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
    
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
  
        this.article.user_id = decodedToken.userId;
  
        if (!this.article.user_id) {
          throw new Error('ID utilisateur non trouvé dans le token');
        }
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        this.router.navigate(['/login']);
      }
    } else {
      console.error('Aucun token trouvé');
      this.router.navigate(['/login']);
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (file.size <= 5 * 1024 * 1024) {  
        this.selectedFile = file;

        this.article.photo = file.name;
      } else {
        alert('Le fichier doit être inférieur à 5MB');
      }
    }
  }
  

  onSubmit(): void {
    if (!this.article.title || !this.article.description || !this.article.user_id) {
      alert('Veuillez remplir tous les champs requis (titre, contenu, et utilisateur authentifié)');
      return;
    }
  
    if (!this.article.photo) {
      this.article.photo = '';
    }
  
    this.articleService.createArticle(this.article).subscribe({
      next: (response) => {
        console.log('Article créé avec succès:', response);
        this.router.navigate(['/articles']);
      },
      error: (error) => {
        console.error('Erreur lors de la création de l\'article:', error);
        alert('Une erreur est survenue lors de la publication');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/articles']);
  }
}